import UnderConstruction from "@/components/ui/UnderConstruction";
import { getRepository } from "@/content/repository";
import { socialUrl } from "@/content/selectors";

export default async function AboutPage() {
  const { socials } = await getRepository().getSiteContent();

  return (
    <UnderConstruction
      page="About"
      tagline="The full origin story is still being written."
      emailHref={socialUrl(socials, "email") ?? "mailto:"}
    />
  );
}
