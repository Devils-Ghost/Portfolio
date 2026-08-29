import UnderConstruction from "@/components/ui/UnderConstruction";
import { getRepository } from "@/content/repository";
import { socialUrl } from "@/content/selectors";

export default async function ExperiencePage() {
  const { socials } = await getRepository().getSiteContent();

  return (
    <UnderConstruction
      page="Experience"
      tagline="Reverse engineering my own timeline."
      emailHref={socialUrl(socials, "email") ?? "mailto:"}
    />
  );
}
