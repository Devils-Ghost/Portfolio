import UnderConstruction from "@/components/ui/UnderConstruction";
import { getRepository } from "@/content/repository";
import { socialUrl } from "@/content/selectors";

export default async function BlogPage() {
  const { socials } = await getRepository().getSiteContent();

  return (
    <UnderConstruction
      page="Blog"
      tagline="Drafts currently outnumber published posts."
      emailHref={socialUrl(socials, "email") ?? "mailto:"}
    />
  );
}
