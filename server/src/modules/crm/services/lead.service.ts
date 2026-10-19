import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { LeadRepository, type LeadFilterOptions } from '../repositories/lead.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { ContactRepository } from '../repositories/contact.repository';
import { OpportunityRepository } from '../repositories/opportunity.repository';
import { CreateLeadDto, UpdateLeadDto } from '../dto/create-lead.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepo: LeadRepository,
    private readonly companyRepo: CompanyRepository,
    private readonly contactRepo: ContactRepository,
    private readonly oppRepo: OpportunityRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listLeads(callerUser: JwtPayload, orgIdOrSlug: string, options: LeadFilterOptions = {}) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing leads for org=${org.slug} status=${options.status ?? 'all'}`);
    return this.leadRepo.list(org._id, options);
  }

  async createLead(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateLeadDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Creating lead for company="${dto.companyName}" owner=${dto.leadOwnerId} org=${org.slug}`);
    return this.leadRepo.create({
      ...dto,
      organizationId: org._id,
      meetingDate: dto.meetingDate ? new Date(dto.meetingDate) : undefined,
      nextContactDate: dto.nextContactDate ? new Date(dto.nextContactDate) : undefined,
      expectedConversionDate: dto.expectedConversionDate ? new Date(dto.expectedConversionDate) : undefined,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
  }

  async getLead(callerUser: JwtPayload, orgIdOrSlug: string, leadId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const lead = await this.leadRepo.findById(org._id, leadId);
    if (!lead) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Lead not found', ErrorCode.NOT_FOUND);
    }
    return lead;
  }

  async updateLead(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    leadId: string,
    dto: UpdateLeadDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const updated = await this.leadRepo.update(org._id, leadId, {
      ...dto,
      meetingDate: dto.meetingDate ? new Date(dto.meetingDate) : undefined,
      nextContactDate: dto.nextContactDate ? new Date(dto.nextContactDate) : undefined,
      expectedConversionDate: dto.expectedConversionDate ? new Date(dto.expectedConversionDate) : undefined,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Lead not found', ErrorCode.NOT_FOUND);
    }
    return updated;
  }

  async convertLead(callerUser: JwtPayload, orgIdOrSlug: string, leadId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const lead = await this.leadRepo.findById(org._id, leadId);
    if (!lead) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Lead not found', ErrorCode.NOT_FOUND);
    }

    // 1. Create or link Company
    let company = lead.companyId ? await this.companyRepo.findById(org._id, lead.companyId) : null;
    if (!company) {
      company = await this.companyRepo.create({
        organizationId: org._id,
        name: lead.companyName,
        status: 'prospect',
        ownerId: lead.leadOwnerId,
        annualRevenue: lead.annualRevenueTarget,
      });
    }

    // 2. Create primary Contact
    const contact = await this.contactRepo.create({
      organizationId: org._id,
      companyId: company._id,
      firstName: lead.contactFirstName,
      lastName: lead.contactLastName,
      salutation: lead.salutation,
      gender: lead.gender,
      designation: lead.designation,
      email: lead.contactEmail,
      phone: lead.contactPhone,
      dateOfBirth: lead.dateOfBirth,
      description: lead.contactDescription,
      linkedInUrl: lead.linkedInUrl,
      twitterHandle: lead.twitterHandle,
      isPrimary: true,
    });

    // 3. Create Opportunity
    const opportunity = await this.oppRepo.create({
      organizationId: org._id,
      title: `${lead.companyName} — Deal`,
      companyId: company._id,
      companyName: company.name,
      leadId: lead._id,
      stage: 'qualification',
      value: lead.annualRevenueTarget || 0,
      probability: 25,
      ownerId: lead.leadOwnerId,
      isMustWin: lead.isMustWin || false,
      notes: lead.scope,
    });

    // 4. Update Lead status to qualified
    await this.leadRepo.update(org._id, leadId, {
      status: 'qualified',
      companyId: company._id,
    });

    this.logger.log(
      `Converted lead "${lead.companyName}" (${leadId}) -> Company=${company._id}, Contact=${contact._id}, Opportunity=${opportunity._id} (₹${opportunity.value}) in org=${org.slug}`,
    );

    return {
      company,
      contact,
      opportunity,
    };
  }

  async deleteLead(callerUser: JwtPayload, orgIdOrSlug: string, leadId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const deleted = await this.leadRepo.delete(org._id, leadId);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Lead not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
