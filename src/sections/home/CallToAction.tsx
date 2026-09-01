import ContactCallout from "./ContactCallout";
import { getRepository } from "@/content/repository";

/**
 * Call to Action — `site.availability` (§7.1 1.9).
 *
 * A Server Component wrapping the scroll-animated callout. The status pill
 * and the location line are content, not copy baked into a component: change
 * `site.availability` and the badge here follows. The button dispatches
 * `{kind:"contact"}`, which resolves the email address itself from
 * `content.site.socials` — this component no longer needs to know it.
 */
export default async function CallToAction() {
  const { availability } = await getRepository().getSiteContent();

  return <ContactCallout availability={availability} />;
}
