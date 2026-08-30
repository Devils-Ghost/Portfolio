import CredentialsGrid from "./CredentialsGrid";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured, published } from "@/content/selectors";

/**
 * Certifications, Beyond the Code and Achievements & Awards (§7.1 1.8, 1.10).
 *
 * Three entities in one section because they render as one arrangement — a
 * triangle of sibling panels sharing a grid. Splitting awards into their own
 * section put a full `py-16` between them and broke the grouping, which is
 * the only thing the layout is trying to say.
 *
 * A Server Component; the client half only stagger-animates the three panels.
 *
 * Phase 2 makes each soft skill and each award clickable through to its
 * modal — which is what turns unfalsifiable adjectives into an entry point
 * for the STAR stories that back them (§3.2b).
 */
export default async function CertificationsSection() {
  const repo = getRepository();
  const [certifications, softSkills, awards] = await Promise.all([
    repo.getCertifications(),
    repo.getSoftSkills(),
    repo.getAwards(),
  ]);

  return (
    <CredentialsGrid
      certifications={featured(certifications, FEATURED_LIMITS.certifications)}
      softSkills={featured(softSkills, FEATURED_LIMITS.softSkills)}
      awards={featured(published(awards), FEATURED_LIMITS.awards)}
    />
  );
}
