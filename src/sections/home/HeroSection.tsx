import Hero from "./Hero";
import { getRepository } from "@/content/repository";

/**
 * Hero — `site.hero` (§7.1 1.1).
 *
 * A Server Component wrapping the animated hero, so the headline and role
 * lines land in the initial HTML rather than being typed in after hydration.
 */
export default async function HeroSection() {
  const { hero } = await getRepository().getSiteContent();

  return <Hero hero={hero} />;
}
