export interface TeamSummary {
  id: string;
  name: string;
  description?: string;
  leadUserId?: string;
  lead?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLead: boolean;
  joinedAt: string;
}

export interface TeamDetail {
  id: string;
  name: string;
  description?: string;
  leadUserId?: string;
  members: TeamMember[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  leadUserId?: string;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
  leadUserId?: string | null;
}
