import { NextResponse } from "next/server";
import { getSiteContent } from "@/utils/content";
import {
  APPLICATION_FIELDS,
  CV_PATH_PATTERN,
  isFieldRequired,
  type JobOpening,
} from "@/types/career";

export const runtime = "nodejs";

const MAX_TEXT = 400;
const MAX_COVER_LETTER = 6000;
const MAX_LINKS = 8;

function normalizeLink(raw: string) {
  const value = raw.trim();
  if (!value) return null;
  if (value.length > 500) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Loads the opening the applicant selected, so its required-field rules apply. */
async function loadJob(jobId: string): Promise<JobOpening | null> {
  if (!jobId) return null;
  const content = await getSiteContent();
  const jobs = (content.career?.jobs || []) as JobOpening[];
  return jobs.find((j) => j.id === jobId) || null;
}

/**
 * Checks a job application the same way the live site does.
 *
 * On the live site a valid application is saved to the database and emailed
 * to the team. In this copy it is only printed in the terminal where
 * `npm run dev` is running.
 */
export async function POST(request: Request) {
  function fail(error: string, status = 400) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const body = await request.json();

    const text = (key: string, max = MAX_TEXT) =>
      String(body?.[key] ?? "").trim().slice(0, max);

    // Honeypot — bots fill hidden fields. Pretend everything went fine.
    if (text("company_website")) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const jobId = text("jobId");
    const jobTitle = text("jobTitle");
    const job = await loadJob(jobId);
    const required = (key: string) => isFieldRequired(key, job);

    const values: Record<string, string> = {
      fullName: text("fullName"),
      email: text("email"),
      phone: text("phone"),
      location: text("location"),
      heardFrom: text("heardFrom", 120),
      coverLetter: text("coverLetter", MAX_COVER_LETTER),
    };

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Please choose the position you are applying for." },
        { status: 400 }
      );
    }

    const links: string[] = (Array.isArray(body?.links) ? body.links : [])
      .map((l: unknown) => normalizeLink(String(l)))
      .filter((l: string | null): l is string => !!l)
      .slice(0, MAX_LINKS);

    const cvPath = text("cvPath", 200);
    const cvName = text("cvName", 200) || null;
    let hasCv = false;

    if (cvPath) {
      if (!CV_PATH_PATTERN.test(cvPath)) {
        return NextResponse.json({ error: "Invalid CV upload." }, { status: 400 });
      }
      hasCv = true;
    }

    // Enforce this role's required questions server-side — the browser's
    // `required` attribute is trivially bypassed.
    const missing = APPLICATION_FIELDS.filter((field) => {
      if (!required(field.key)) return false;
      if (field.key === "cv") return !hasCv;
      if (field.key === "links") return links.length === 0;
      return !values[field.key];
    });

    if (missing.length) {
      return fail(`Please fill in: ${missing.map((f) => f.label).join(", ")}.`);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return fail("Please enter a valid email address.");
    }

    const id = crypto.randomUUID();

    console.log("\n[careers] New application (not saved or emailed in this copy):");
    console.table({
      position: jobTitle,
      ...values,
      links: links.join(", "),
      cv: cvName || "not provided",
    });

    return NextResponse.json({ success: true, id, emailSent: false }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "Failed to submit your application. Please try again." },
      { status: 500 }
    );
  }
}
