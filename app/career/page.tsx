import type { Metadata } from "next";
import CareerHero from "@/components/career/CareerHero";
import CareerBoard from "@/components/career/CareerBoard";
import PreviewFooter from "@/components/preview/PreviewFooter";
import { getSiteContent } from "@/utils/content";
import type { CareerContent, JobOpening } from "@/types/career";

const title = "Careers | Jasmine Agency";
const description =
  "Explore open positions at Jasmine Digital Solutions Agency and apply to join our creative team in Sulaimani, Iraq.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    url: "https://jasmine.krd/career",
    siteName: "Jasmine Agency",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default async function CareerPage() {
  const content = await getSiteContent();
  const career = (content.career || {}) as CareerContent;

  // Only roles with a title are shown; closed roles stay listed but cannot be
  // applied to, so candidates can still see what the team hires for.
  const jobs: JobOpening[] = (career.jobs || []).filter((job) =>
    job?.title?.trim()
  );

  return (
    <main className="w-full min-h-screen bg-background relative">
      <CareerHero data={career} />
      <CareerBoard jobs={jobs} />
      <PreviewFooter />
    </main>
  );
}
