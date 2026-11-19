import Hero from "@/components/preview/Hero";
import About from "@/components/preview/About";
import CoreServices from "@/components/preview/CoreServices";
import FAQ from "@/components/preview/FAQ";
import Portfolio from "@/components/preview/Portfolio";
import ContactForm from "@/components/preview/ContactForm";
import PreviewFooter from "@/components/preview/PreviewFooter";
import { getSiteContent } from "@/utils/content";

export default async function Home() {
  const contentData = await getSiteContent();

  return (
    <main className="w-full min-h-screen bg-background relative">
      <Hero data={contentData.hero} />
      <About data={contentData.about} />
      <CoreServices data={contentData.coreServices} />
      <Portfolio data={contentData.portfolio} />
      <FAQ data={contentData.faq} />
      <ContactForm />
      <PreviewFooter />
    </main>
  );
}
