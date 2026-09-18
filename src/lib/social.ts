/**
 * Social profiles, from whatever Site Settings happens to hold.
 *
 * Two things make this messier than it looks, and both are handled here so
 * that adding a network is only ever a Site Settings entry, never a code
 * change:
 *
 *  1. The key naming is inconsistent, because people name a setting after
 *     what they are pasting: `linkedin_url` holds a URL, `twitter_handle`
 *     holds "@edoscentre", and `youtube_handle` holds a full URL despite its
 *     name. So each network accepts several key spellings.
 *
 *  2. The value may be a full URL or a bare handle. Anything starting http
 *     is used as-is; anything else is appended to the network's base.
 *
 * To add Facebook, an admin creates one setting called `facebook_url` (or
 * `facebook`) and pastes the page address. It appears in the footer and in
 * the Organization schema's sameAs without anyone touching this file.
 */

export type SocialNetwork = "linkedin" | "twitter" | "facebook" | "instagram" | "youtube" | "tiktok" | "github"

type NetworkSpec = {
  /** Settings keys to look at, in order of preference. */
  keys: string[]
  /** Prepended to a bare handle. */
  base: string
  /** Whether the handle keeps a leading @ in the URL. */
  keepsAt: boolean
  label: string
}

const NETWORKS: Record<SocialNetwork, NetworkSpec> = {
  linkedin: {
    keys: ["linkedin_url", "linkedin", "linkedin_handle"],
    base: "https://www.linkedin.com/company/",
    keepsAt: false,
    label: "LinkedIn",
  },
  twitter: {
    keys: ["twitter_url", "twitter_handle", "twitter", "x_url", "x_handle"],
    base: "https://twitter.com/",
    keepsAt: false,
    label: "X (Twitter)",
  },
  facebook: {
    keys: ["facebook_url", "facebook", "facebook_handle"],
    base: "https://www.facebook.com/",
    keepsAt: false,
    label: "Facebook",
  },
  instagram: {
    keys: ["instagram_url", "instagram", "instagram_handle"],
    base: "https://www.instagram.com/",
    keepsAt: false,
    label: "Instagram",
  },
  youtube: {
    // YouTube channel URLs keep the @: youtube.com/@edoscentre
    keys: ["youtube_url", "youtube_handle", "youtube"],
    base: "https://www.youtube.com/",
    keepsAt: true,
    label: "YouTube",
  },
  tiktok: {
    keys: ["tiktok_url", "tiktok_handle", "tiktok"],
    base: "https://www.tiktok.com/",
    keepsAt: true,
    label: "TikTok",
  },
  github: {
    keys: ["github_url", "github", "github_handle"],
    base: "https://github.com/",
    keepsAt: false,
    label: "GitHub",
  },
}

/** Display order in the footer. */
export const SOCIAL_ORDER: SocialNetwork[] = [
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "github",
]

export function socialLabel(network: SocialNetwork): string {
  return NETWORKS[network].label
}

export function socialUrl(network: SocialNetwork, value?: string | null): string | null {
  const raw = value?.trim()
  if (!raw) return null
  if (/^https?:\/\//i.test(raw)) return raw

  const spec = NETWORKS[network]
  const bare = raw.replace(/^@/, "")
  if (!bare) return null
  return `${spec.base}${spec.keepsAt ? `@${bare}` : bare}`
}

/** Every profile actually filled in, in display order. */
export function socialProfiles(settings: Record<string, string>): { network: SocialNetwork; url: string }[] {
  const found: { network: SocialNetwork; url: string }[] = []

  for (const network of SOCIAL_ORDER) {
    const key = NETWORKS[network].keys.find((k) => settings[k]?.trim())
    if (!key) continue
    const url = socialUrl(network, settings[key])
    if (url) found.push({ network, url })
  }

  return found
}
