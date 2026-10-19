import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { TeamMembership, TeamMembershipDocument } from './schemas/team-membership.schema';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(TeamMembership.name)
    private readonly teamMembershipModel: Model<TeamMembershipDocument>,
  ) {}

  async createTeam(data: Partial<Team>): Promise<TeamDocument> {
    return this.teamModel.create(data);
  }

  async findTeamById(orgId: string, teamId: string): Promise<TeamDocument | null> {
    return this.teamModel.findOne({ _id: teamId, organizationId: orgId }).exec();
  }

  async findTeamByName(orgId: string, name: string): Promise<TeamDocument | null> {
    return this.teamModel
      .findOne({ organizationId: orgId, name: { $regex: `^${name.trim()}$`, $options: 'i' } })
      .exec();
  }

  async listTeams(orgId: string): Promise<TeamDocument[]> {
    return this.teamModel.find({ organizationId: orgId }).sort({ createdAt: -1 }).exec();
  }

  async updateTeam(
    orgId: string,
    teamId: string,
    update: Partial<Team>,
  ): Promise<TeamDocument | null> {
    return this.teamModel
      .findOneAndUpdate({ _id: teamId, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async deleteTeam(orgId: string, teamId: string): Promise<boolean> {
    const res = await this.teamModel.deleteOne({ _id: teamId, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }

  async countMembersByTeams(orgId: string): Promise<Record<string, number>> {
    const agg = await this.teamMembershipModel
      .aggregate<{ _id: string; count: number }>([
        { $match: { organizationId: orgId } },
        { $group: { _id: '$teamId', count: { $sum: 1 } } },
      ])
      .exec();

    const counts: Record<string, number> = {};
    for (const item of agg) {
      counts[item._id] = item.count;
    }
    return counts;
  }

  async findMembershipsByTeam(orgId: string, teamId: string): Promise<TeamMembershipDocument[]> {
    return this.teamMembershipModel
      .find({ organizationId: orgId, teamId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findMembership(
    orgId: string,
    teamId: string,
    userId: string,
  ): Promise<TeamMembershipDocument | null> {
    return this.teamMembershipModel.findOne({ organizationId: orgId, teamId, userId }).exec();
  }

  async addMembership(
    orgId: string,
    teamId: string,
    userId: string,
  ): Promise<TeamMembershipDocument> {
    return this.teamMembershipModel.findOneAndUpdate(
      { organizationId: orgId, teamId, userId },
      { $setOnInsert: { organizationId: orgId, teamId, userId, joinedAt: new Date() } },
      { upsert: true, new: true },
    );
  }

  async removeMembership(orgId: string, teamId: string, userId: string): Promise<boolean> {
    const res = await this.teamMembershipModel
      .deleteOne({ organizationId: orgId, teamId, userId })
      .exec();
    return res.deletedCount > 0;
  }

  async deleteMembershipsByTeam(orgId: string, teamId: string): Promise<number> {
    const res = await this.teamMembershipModel
      .deleteMany({ organizationId: orgId, teamId })
      .exec();
    return res.deletedCount;
  }

  async deleteMembershipsByUser(orgId: string, userId: string): Promise<number> {
    const res = await this.teamMembershipModel
      .deleteMany({ organizationId: orgId, userId })
      .exec();
    return res.deletedCount;
  }
}
