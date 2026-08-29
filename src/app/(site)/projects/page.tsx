import UnderConstruction from "@/components/ui/UnderConstruction";
import { getRepository } from "@/content/repository";
import { socialUrl } from "@/content/selectors";

export default async function ProjectsPage() {
  const { socials } = await getRepository().getSiteContent();

  return (
    <UnderConstruction
      page="Projects"
      tagline="Shipping soon. Literally."
      emailHref={socialUrl(socials, "email") ?? "mailto:"}
    />
  );
}
