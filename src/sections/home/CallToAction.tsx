import ContactCallout from "./ContactCallout";
import { getRepository } from "@/content/repository";
import { socialUrl } from "@/content/selectors";

/**
 * Call to Action — `site.availability` (§7.1 1.9).
 *
 * A Server Component wrapping the scroll-animated callout. The status pill
 * and the location line are content, not copy baked into a component: change
 * `site.availability` and both the badge here and (in Phase 2) the contact
 * modal follow, rather than drifting apart.
 */
export default async function CallToAction() {
  const { availability, socials } = await getRepository().getSiteContent();

  return (
    <ContactCallout
      availability={availability}
      emailHref={socialUrl(socials, "email") ?? "mailto:"}
    />
  );
}
