"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  CV_EXTENSIONS,
  GENERAL_APPLICATION,
  MAX_CV_BYTES,
  isFieldRequired,
  type JobOpening,
} from "@/types/career";

const inputClasses =
  "w-full px-5 py-4 rounded-xl border border-card-border bg-card text-text-main text-base md:text-lg placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all font-sans";

const labelClasses =
  "block text-sm md:text-base font-bold text-text-main tracking-widest uppercase mb-2";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  heardFrom: "",
  coverLetter: "",
};

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Parses a JSON body, tolerating the plain-text bodies platforms return on errors. */
async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Turns a bare HTTP status into something an applicant can act on. Without
 * this, any non-JSON failure surfaced as an unhelpful "something went wrong".
 */
function describeFailure(statusCode: number) {
  if (statusCode === 413) {
    return "Your file is too large to send. Please upload a CV under 8 MB.";
  }
  if (statusCode === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (statusCode >= 500) {
    return `The server could not process your application (error ${statusCode}). Please try again, or email us at info@jasmine.krd.`;
  }
  return `Your application could not be submitted (error ${statusCode}). Please check your details and try again.`;
}

/** Small "(optional)" tag shown next to labels that this role does not require. */
function Optional({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="text-text-muted font-medium normal-case tracking-normal">
      {" "}
      (optional)
    </span>
  );
}

function CvField({
  file,
  required,
  onPick,
  onClear,
}: {
  file: File | null;
  required: boolean;
  onPick: (file: File | null) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor="cv" className={labelClasses}>
        CV / RESUME
        <Optional show={!required} />
      </label>
      <input
        ref={inputRef}
        id="cv"
        type="file"
        accept={CV_EXTENSIONS.map((e) => `.${e}`).join(",")}
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0] || null)}
      />
      {file ? (
        <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-primary/40 bg-card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-primary"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-text-main text-base truncate">{file.name}</p>
            <p className="text-text-muted text-sm">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              onClear();
            }}
            className="shrink-0 text-sm font-bold tracking-widest uppercase text-primary hover:text-primary-hover transition-colors"
          >
            REMOVE
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-dashed border-card-border bg-card hover:border-primary/50 transition-colors text-left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-text-muted"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          <span className="min-w-0">
            <span className="block text-text-main text-base md:text-lg">
              Upload your CV
            </span>
            <span className="block text-text-muted text-sm">
              {CV_EXTENSIONS.join(", ").toUpperCase()} — max 8 MB
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function ApplicationForm({
  jobs,
  selectedKey,
  onSelectedKeyChange,
}: {
  jobs: JobOpening[];
  selectedKey: string;
  onSelectedKeyChange: (key: string) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [links, setLinks] = useState<string[]>([""]);
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const openJobs = jobs.filter((j) => j.status !== "closed");
  const selectedJob = jobs.find((j) => j.id === selectedKey) || null;
  const jobTitle = selectedJob ? selectedJob.title : GENERAL_APPLICATION;

  // Which questions this particular role requires — configured per job in the
  // admin dashboard, so one opening can demand a cover letter while another
  // leaves it optional.
  const req = (key: string) => isFieldRequired(key, selectedJob);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateLink = (index: number, value: string) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (req("cv") && !cv) {
      setStatus("error");
      setErrorMessage("Please attach your CV / resume.");
      return;
    }
    if (cv && cv.size > MAX_CV_BYTES) {
      setStatus("error");
      setErrorMessage("Your CV must be smaller than 8 MB.");
      return;
    }
    if (req("links") && !links.some((l) => l.trim())) {
      setStatus("error");
      setErrorMessage("Please add at least one link.");
      return;
    }

    try {
      // The CV goes straight from the browser to Supabase Storage. Sending it
      // through our API would hit the serverless request-body limit (~4.5 MB),
      // which silently broke large uploads from phones.
      let cvPath = "";
      if (cv) {
        setStatus("uploading");
        const ticket = await fetch("/api/career/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: cv.name, size: cv.size }),
        });
        const ticketJson = await readJson(ticket);
        if (!ticket.ok) {
          setStatus("error");
          setErrorMessage(
            ticketJson?.error || "We could not start the upload. Please try again."
          );
          return;
        }
        const put = await fetch(ticketJson.uploadUrl, {
          method: "PUT",
          body: cv,
          headers: { "Content-Type": cv.type || "application/octet-stream" },
        });
        if (!put.ok) {
          setStatus("error");
          setErrorMessage(
            "Your CV could not be uploaded. Check your connection and try again."
          );
          return;
        }
        cvPath = ticketJson.path;
      }

      setStatus("loading");
      const res = await fetch("/api/career/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          jobTitle,
          jobId: selectedJob?.id || "",
          company_website: "", // honeypot
          links: links.map((l) => l.trim()).filter(Boolean),
          cvPath,
          cvName: cv?.name || "",
        }),
      });
      const json = await readJson(res);

      if (res.ok) {
        setStatus("success");
        setForm(emptyForm);
        setLinks([""]);
        setCv(null);
        setConsent(false);
        window.scrollTo({
          top: (document.getElementById("apply")?.offsetTop || 0) - 100,
          behavior: "smooth",
        });
      } else {
        setStatus("error");
        setErrorMessage(json?.error || describeFailure(res.status));
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not reach the server. Please check your connection and try again."
      );
    }
  };

  if (status === "success") {
    return (
      <section id="apply" className="py-8 md:py-12 bg-background scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-card-border bg-card p-8 md:p-14 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="font-sans font-bold text-2xl md:text-4xl text-text-main tracking-tight mb-4">
              APPLICATION RECEIVED
            </h2>
            <p className="text-text-muted text-base md:text-xl leading-relaxed max-w-[640px] mx-auto mb-8">
              Thank you for applying to Jasmine. Our team reviews every
              application personally and will get back to you at the email
              address you provided.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="px-8 py-3.5 rounded-xl border border-card-border bg-background text-text-main font-bold text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              SUBMIT ANOTHER APPLICATION
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-8 md:py-12 bg-background scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-text-main mb-3 tracking-tight"
        >
          APPLY FOR A POSITION
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-text-muted text-base md:text-lg max-w-[760px] mb-10"
        >
          Fill in your details below. Fields marked as optional can be left
          empty.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-10"
        >
          {/* Honeypot — hidden from humans, catches bots */}
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* --- Position --- */}
          <div>
            <label htmlFor="jobSelect" className={labelClasses}>
              POSITION YOU ARE APPLYING FOR
            </label>
            <select
              id="jobSelect"
              value={selectedKey}
              onChange={(e) => onSelectedKeyChange(e.target.value)}
              className={`${inputClasses} cursor-pointer appearance-none bg-[length:18px] bg-[right_1.25rem_center] bg-no-repeat pr-12`}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              }}
            >
              <option value="">{GENERAL_APPLICATION}</option>
              {openJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* --- Personal details --- */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-text-main tracking-widest uppercase flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> YOUR
              DETAILS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className={labelClasses}>
                  FULL NAME
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name ..."
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>
                  E-MAIL
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className={labelClasses}>
                  CONTACT NUMBER
                  <Optional show={!req("phone")} />
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+964 7XX XXX XXX"
                  className={inputClasses}
                  required={req("phone")}
                />
              </div>
              <div>
                <label htmlFor="location" className={labelClasses}>
                  LOCATION
                  <Optional show={!req("location")} />
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className={inputClasses}
                  required={req("location")}
                />
              </div>
            </div>
          </div>

          {/* --- Documents & portfolio --- */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-text-main tracking-widest uppercase flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> DOCUMENTS
              &amp; PORTFOLIO
            </h3>

            <CvField
              file={cv}
              required={req("cv")}
              onPick={setCv}
              onClear={() => setCv(null)}
            />

            <div>
              <span className={labelClasses}>
                LINKS &amp; RESOURCES
                <Optional show={!req("links")} />
              </span>
              <p className="text-text-muted text-sm md:text-base -mt-1 mb-3">
                Google Drive, Behance, LinkedIn, your portfolio site — anything
                you want us to see.
              </p>
              <div className="space-y-3">
                {links.map((link, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => updateLink(i, e.target.value)}
                      placeholder="https://drive.google.com/... or https://www.behance.net/yourprofile"
                      className={inputClasses}
                      aria-label={`Link ${i + 1}`}
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setLinks((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        aria-label="Remove link"
                        className="shrink-0 w-14 rounded-xl border border-card-border bg-card text-text-muted hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {links.length < 8 && (
                <button
                  type="button"
                  onClick={() => setLinks((prev) => [...prev, ""])}
                  className="mt-3 text-sm font-bold tracking-widest uppercase text-primary hover:text-primary-hover transition-colors"
                >
                  + ADD ANOTHER LINK
                </button>
              )}
            </div>
          </div>

          {/* --- Cover letter --- */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-text-main tracking-widest uppercase flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> TELL US
              MORE
            </h3>

            <div>
              <label htmlFor="coverLetter" className={labelClasses}>
                COVER LETTER
                <Optional show={!req("coverLetter")} />
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={7}
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Why do you see yourself as the best fit for this position?"
                className={`${inputClasses} resize-y leading-relaxed`}
                maxLength={6000}
                required={req("coverLetter")}
              />
              <p className="text-text-muted text-sm mt-2">
                {form.coverLetter.length}/6000
              </p>
            </div>

            <div>
              <label htmlFor="heardFrom" className={labelClasses}>
                HOW DID YOU HEAR ABOUT US?
                <Optional show={!req("heardFrom")} />
              </label>
              <input
                id="heardFrom"
                type="text"
                name="heardFrom"
                value={form.heardFrom}
                onChange={handleChange}
                placeholder="Instagram, LinkedIn, a friend ..."
                className={inputClasses}
                required={req("heardFrom")}
              />
            </div>
          </div>

          {/* --- Consent + submit --- */}
          <div className="space-y-6">
            <label className="flex items-start gap-3 cursor-pointer max-w-[820px]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-1.5 w-5 h-5 shrink-0 accent-[#eb393d] cursor-pointer"
              />
              <span className="text-text-muted text-base md:text-lg leading-relaxed">
                I agree that Jasmine Digital Solutions Agency may store and
                process the information and files I submit for the purpose of
                reviewing my application.
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status === "loading" || status === "uploading"}
                className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-base md:text-lg tracking-widest uppercase hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "uploading"
                  ? "UPLOADING CV..."
                  : status === "loading"
                  ? "SENDING..."
                  : "SUBMIT APPLICATION"}
              </button>
              <p className="text-text-muted text-sm md:text-base">
                Applying for:{" "}
                <span className="text-text-main font-bold">{jobTitle}</span>
              </p>
            </div>

            {status === "error" && errorMessage && (
              <p className="text-base md:text-lg text-primary font-medium tracking-wide">
                {errorMessage}
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
