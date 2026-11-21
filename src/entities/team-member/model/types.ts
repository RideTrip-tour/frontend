export interface MemberAction {
  label: string;
  href: string;
}

export interface MemberCardData {
  firstName: string;
  lastName: string;
  role: string;
  bio: string[];
  skills: string[];
  avatarUrl?: string;
  contactAction: MemberAction;
  portfolioAction: MemberAction;
}
