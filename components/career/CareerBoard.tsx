"use client";

import { useState } from "react";
import JobOpenings from "./JobOpenings";
import ApplicationForm from "./ApplicationForm";
import type { JobOpening } from "@/types/career";

/**
 * Ties the openings list to the application form: clicking "Apply" on a role
 * preselects it in the form and scrolls the applicant straight to it.
 */
export default function CareerBoard({ jobs }: { jobs: JobOpening[] }) {
  const [selectedKey, setSelectedKey] = useState("");

  const handleApply = (job: JobOpening | null) => {
    setSelectedKey(job?.id || "");
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <JobOpenings jobs={jobs} onApply={handleApply} />
      <ApplicationForm
        jobs={jobs}
        selectedKey={selectedKey}
        onSelectedKeyChange={setSelectedKey}
      />
    </>
  );
}
