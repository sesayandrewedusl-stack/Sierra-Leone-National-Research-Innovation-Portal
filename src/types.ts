export type UserRole =
  | 'student'
  | 'lecturer'
  | 'researcher'
  | 'institution_admin'
  | 'evaluator'
  | 'ministry_admin'
  | 'superadmin';

export interface UserProfile {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  profilePicture: string | null;
  role: UserRole;
  institution?: string;
  district?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface OtpRecord {
  id: string;
  email: string;
  otpCode: string;
  expiresAtMs: number;
  createdAtMs: number;
  consumed: boolean;
}

export interface DispatchedEmail {
  id: string;
  to: string;
  subject: string;
  type: 'registration_otp' | 'forgot_password' | 'proposal_update' | 'system_alert';
  timestamp: string;
  contentHtml: string;
  previewData?: {
    code?: string;
    tempPassword?: string;
    expiresInSeconds?: number;
  };
}

export interface ResearchProposal {
  id: string;
  trackingCode: string;
  title: string;
  abstract: string;
  category: 'Renewable Energy' | 'Sustainable Agriculture' | 'Healthcare & Epidemics' | 'AI & Digital Systems' | 'Mining & Environment';
  budgetNLe: number;
  authorId: string;
  authorName: string;
  authorEmail: string;
  institution: string;
  district: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Revision Requested' | 'Awarded';
  createdAt: string;
  evaluationScores?: {
    originality: number;
    innovation: number;
    feasibility: number;
    relevance: number;
    impact: number;
    total: number;
    evaluatorNotes?: string;
  };
}

export interface Competition {
  id: string;
  title: string;
  category: string;
  prizePoolNLe: number;
  deadline: string;
  status: 'Active' | 'Under Review' | 'Concluded';
  description: string;
  eligibility: string;
  applicantsCount: number;
}
