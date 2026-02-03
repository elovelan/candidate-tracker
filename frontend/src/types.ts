export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "accepted";

export type InterviewType =
  | "phone screen"
  | "technical"
  | "onsite"
  | "behavioral"
  | "other";

export interface JobApplication {
  id: string;
  companyName: string;
  roleName: string;
  score: number;
  salaryMin?: number;
  salaryMax?: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  applicationId: string;
  description: string;
  done: boolean;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  dateTime: string;
  interviewType: InterviewType;
  notes?: string;
}

export interface Note {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
}
