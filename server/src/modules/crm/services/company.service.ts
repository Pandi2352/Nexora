import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { CompanyRepository } from '../repositories/company.repository';
import { ContactRepository } from '../repositories/contact.repository';
import { OpportunityRepository } from '../repositories/opportunity.repository';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/create-company.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly contactRepo: ContactRepository,
    private readonly oppRepo: OpportunityRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listCompanies(callerUser: JwtPayload, orgIdOrSlug: string, search?: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing companies for org=${org.slug} search="${search ?? ''}"`);
    return this.companyRepo.list(org._id, search);
  }

  async createCompany(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateCompanyDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Creating company "${dto.name}" in org=${org.slug} by user=${callerUser.sub}`);
    return this.companyRepo.create({
      ...dto,
      organizationId: org._id,
      ownerId: dto.ownerId ?? callerUser.sub,
    });
  }

  async getCompany(callerUser: JwtPayload, orgIdOrSlug: string, companyId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const company = await this.companyRepo.findById(org._id, companyId);
    if (!company) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Company not found', ErrorCode.NOT_FOUND);
    }
    const [contacts, opportunities] = await Promise.all([
      this.contactRepo.list(org._id, undefined, company._id),
      this.oppRepo.list(org._id, { companyId: company._id }),
    ]);
    return {
      ...company.toObject(),
      contacts,
      opportunities,
    };
  }

  async updateCompany(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    companyId: string,
    dto: UpdateCompanyDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Updating company id=${companyId} in org=${org.slug}`);
    const updated = await this.companyRepo.update(org._id, companyId, dto);
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Company not found', ErrorCode.NOT_FOUND);
    }
    return updated;
  }

  async deleteCompany(callerUser: JwtPayload, orgIdOrSlug: string, companyId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Deleting company id=${companyId} in org=${org.slug}`);
    const deleted = await this.companyRepo.delete(org._id, companyId);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Company not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
