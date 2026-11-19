// Shared types + constants for the Careers page and the admin dashboard.

export type JobStatus = "open" | "closed";

export interface JobOpening {
  id: string;
  title: string;
  /** Full-time, Part-time, Internship, Contract, Freelance */
  type?: string;
  /** On-site, Hybrid, Remote */
  workMode?: string;
  location?: string;
  /** ISO date (yyyy-mm-dd) */
  deadline?: string;
  summary?: string;
  status?: JobStatus;
  /**
   * Keys from APPLICATION_FIELDS that applicants must fill in for this role.
   * Undefined means "use DEFAULT_REQUIRED_FIELDS".
   */
  requiredFields?: string[];
}

/** A question on the application form whose required/optional state is configurable. */
export interface ApplicationField {
  key: string;
  label: string;
  /** Locked on: an application without it cannot be processed. */
  alwaysRequired?: boolean;
  hint?: string;
}

export const APPLICATION_FIELDS: ApplicationField[] = [
  { key: "fullName", label: "Full name", alwaysRequired: true },
  { key: "email", label: "E-mail", alwaysRequired: true },
  { key: "phone", label: "Contact number" },
  { key: "location", label: "Location" },
  { key: "cv", label: "CV / resume upload" },
  { key: "links", label: "Links & resources", hint: "Google Drive, Behance, portfolio ..." },
  { key: "coverLetter", label: "Cover letter" },
  { key: "heardFrom", label: "How did you hear about us" },
];

/** Applied to open applications and to roles saved before this setting existed. */
export const DEFAULT_REQUIRED_FIELDS = ["phone", "location", "cv"];

/** Single source of truth for required-ness, shared by the form and the API. */
export function isFieldRequired(key: string, job?: JobOpening | null): boolean {
  const field = APPLICATION_FIELDS.find((f) => f.key === key);
  if (!field) return false;
  if (field.alwaysRequired) return true;
  const configured = job?.requiredFields ?? DEFAULT_REQUIRED_FIELDS;
  return configured.includes(key);
}

export interface CareerContent {
  eyebrow?: string;
  title?: string;
  jobs?: JobOpening[];
}

export const GENERAL_APPLICATION = "General Application";

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];

export const WORK_MODES = ["On-site", "Hybrid", "Remote"];

export const defaultCareerContent: CareerContent = {
  eyebrow: "JOIN THE TEAM",
  title: "CAREERS AT JASMINE",
  jobs: [],
};

/** Application pipeline stages shown in the admin dashboard. */
export const APPLICATION_STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const APPLICATION_STATUS_VALUES = APPLICATION_STATUSES.map(
  (s) => s.value
) as string[];

export interface JobApplication {
  id: string;
  created_at: string;
  job_id: string | null;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  heard_from: string | null;
  cover_letter: string | null;
  links: string[];
  cv_path: string | null;
  cv_name: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  email_sent: boolean;
}

/** Supabase Storage bucket that holds CVs and work samples (private). */
export const APPLICATIONS_BUCKET = "applications";

/**
 * 8 MB — comfortably under the bucket's 10 MB ceiling. The CV is uploaded
 * straight to Supabase from the browser, so the serverless request-body limit
 * (~4.5 MB on Vercel) does not apply.
 */
export const MAX_CV_BYTES = 8 * 1024 * 1024;

export const CV_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "odt"];

/** Strips path separators and exotic characters out of an uploaded filename. */
export function safeCvFileName(name: string) {
  return (
    name
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-80) || "cv"
  );
}

/** Shape of the storage paths this app mints — anything else is rejected. */
export const CV_PATH_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/cv-[A-Za-z0-9._-]+$/;
