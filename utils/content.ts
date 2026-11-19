import siteContent from "@/data/site-content.json";

export type SiteContent = typeof siteContent;

/**
 * Text and images for the home page and the careers page.
 *
 * On the live site this content is stored in a database and edited from the
 * admin dashboard. In this copy it is read from data/site-content.json, so you
 * can change it freely and see the result straight away.
 */
export async function getSiteContent(): Promise<SiteContent> {
  return siteContent;
}
