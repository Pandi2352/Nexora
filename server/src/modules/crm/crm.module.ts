import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from '../organizations/organizations.module';
import { Company, CompanySchema } from './schemas/company.schema';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { SalesActivity, SalesActivitySchema } from './schemas/sales-activity.schema';
import { Opportunity, OpportunitySchema } from './schemas/opportunity.schema';
import { BusinessUnit, BusinessUnitSchema } from './schemas/business-unit.schema';

import { CompanyRepository } from './repositories/company.repository';
import { ContactRepository } from './repositories/contact.repository';
import { LeadRepository } from './repositories/lead.repository';
import { SalesActivityRepository } from './repositories/activity.repository';
import { OpportunityRepository } from './repositories/opportunity.repository';
import { BusinessUnitRepository } from './repositories/business-unit.repository';

import { CrmHelper } from './services/crm-helper';
import { CompanyService } from './services/company.service';
import { ContactService } from './services/contact.service';
import { LeadService } from './services/lead.service';
import { SalesActivityService } from './services/activity.service';
import { OpportunityService } from './services/opportunity.service';
import { BusinessUnitService } from './services/business-unit.service';

import { CompaniesController } from './controllers/companies.controller';
import { ContactsController } from './controllers/contacts.controller';
import { LeadsController } from './controllers/leads.controller';
import { ActivitiesController } from './controllers/activities.controller';
import { OpportunitiesController } from './controllers/opportunities.controller';
import { BusinessUnitsController } from './controllers/business-units.controller';

@Module({
  imports: [
    OrganizationsModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: SalesActivity.name, schema: SalesActivitySchema },
      { name: Opportunity.name, schema: OpportunitySchema },
      { name: BusinessUnit.name, schema: BusinessUnitSchema },
    ]),
  ],
  controllers: [
    CompaniesController,
    ContactsController,
    LeadsController,
    ActivitiesController,
    OpportunitiesController,
    BusinessUnitsController,
  ],
  providers: [
    CrmHelper,
    CompanyRepository,
    ContactRepository,
    LeadRepository,
    SalesActivityRepository,
    OpportunityRepository,
    BusinessUnitRepository,
    CompanyService,
    ContactService,
    LeadService,
    SalesActivityService,
    OpportunityService,
    BusinessUnitService,
  ],
  exports: [
    CompanyRepository,
    ContactRepository,
    LeadRepository,
    SalesActivityRepository,
    OpportunityRepository,
    CompanyService,
    ContactService,
    LeadService,
    SalesActivityService,
    OpportunityService,
  ],
})
export class CrmModule {}
