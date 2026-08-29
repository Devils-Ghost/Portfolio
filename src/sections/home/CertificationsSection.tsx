import CredentialsGrid from "./CredentialsGrid";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured } from "@/content/selectors";

/**
 * Certifications + Beyond the Code —
 * `featured(certifications, …)` alongside `featured(softSkills, …)`.
 *
 * A Server Component: two repository reads, two `featured()` calls, and the
 * scroll-staggered pair of cards handed off to the client view. §Q2 puts the
 * full certification list on /about; three of them live here.
 *
 * Phase 2 makes each soft skill clickable through to its evidence modal —
 * which is what turns four unfalsifiable adjectives into an entry point for
 * the STAR stories that back them (§3.2b).
 */
export default async function CertificationsSection() {
  const repo = getRepository();
  const [certifications, softSkills] = await Promise.all([
    repo.getCertifications(),
    repo.getSoftSkills(),
  ]);

  return (
    <CredentialsGrid
      certifications={featured(certifications, FEATURED_LIMITS.certifications)}
      softSkills={featured(softSkills, FEATURED_LIMITS.softSkills)}
    />
  );
}
