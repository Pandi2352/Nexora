import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { ContactRepository } from '../repositories/contact.repository';
import { CreateContactDto, UpdateContactDto } from '../dto/create-contact.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly contactRepo: ContactRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listContacts(callerUser: JwtPayload, orgIdOrSlug: string, search?: string, companyId?: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing contacts for org=${org.slug} search="${search ?? ''}"`);
    return this.contactRepo.list(org._id, search, companyId);
  }

  async createContact(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateContactDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Creating contact ${dto.firstName} ${dto.lastName} (${dto.email}) in org=${org.slug}`);
    return this.contactRepo.create({
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      organizationId: org._id,
    });
  }

  async getContact(callerUser: JwtPayload, orgIdOrSlug: string, contactId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const contact = await this.contactRepo.findById(org._id, contactId);
    if (!contact) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Contact not found', ErrorCode.NOT_FOUND);
    }
    return contact;
  }

  async updateContact(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    contactId: string,
    dto: UpdateContactDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const updated = await this.contactRepo.update(org._id, contactId, {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Contact not found', ErrorCode.NOT_FOUND);
    }
    return updated;
  }

  async deleteContact(callerUser: JwtPayload, orgIdOrSlug: string, contactId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const deleted = await this.contactRepo.delete(org._id, contactId);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Contact not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
