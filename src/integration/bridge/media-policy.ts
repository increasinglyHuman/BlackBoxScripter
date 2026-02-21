/**
 * Media Policy — URL allowlist + CSP validation for media-on-a-prim.
 *
 * Deployers customize allowed domains via MediaPolicyConfig.
 * Defaults include common embedding hosts (YouTube, Twitch, Discord, etc.).
 *
 * Usage:
 *   const policy = new MediaPolicy({ allowedDomains: ["example.com"] });
 *   const error = policy.validate("https://youtube.com/embed/abc");
 *   if (error) console.warn("Rejected:", error);
 */

export interface MediaPolicyConfig {
  /** Extra domains to allow (added to defaults) */
  allowedDomains?: string[];
  /** Replace the default allowlist entirely */
  overrideDomains?: string[];
  /** Allow data: URIs (default: false) */
  allowDataUrls?: boolean;
  /** Require HTTPS (default: true) */
  requireHttps?: boolean;
}

const DEFAULT_ALLOWED_DOMAINS: string[] = [
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "twitch.tv",
  "www.twitch.tv",
  "player.twitch.tv",
  "discord.com",
  "vimeo.com",
  "player.vimeo.com",
  "open.spotify.com",
  "w.soundcloud.com",
];

export class MediaPolicy {
  private allowedDomains: Set<string>;
  private allowDataUrls: boolean;
  private requireHttps: boolean;

  constructor(config: MediaPolicyConfig = {}) {
    const base = config.overrideDomains ?? DEFAULT_ALLOWED_DOMAINS;
    const extra = config.allowedDomains ?? [];
    this.allowedDomains = new Set([...base, ...extra]);
    this.allowDataUrls = config.allowDataUrls ?? false;
    this.requireHttps = config.requireHttps ?? true;
  }

  /** Validate a URL for media embedding. Returns null if valid, error string if rejected. */
  validate(url: string): string | null {
    if (!url) return "Empty URL";

    if (url.startsWith("data:")) {
      return this.allowDataUrls ? null : "data: URIs are not allowed by media policy";
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return `Invalid URL: ${url}`;
    }

    if (this.requireHttps && parsed.protocol !== "https:") {
      return `HTTPS required, got ${parsed.protocol}`;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return `Unsupported protocol: ${parsed.protocol}`;
    }

    if (!this.isDomainAllowed(parsed.hostname)) {
      return `Domain not in allowlist: ${parsed.hostname}`;
    }

    return null;
  }

  private isDomainAllowed(hostname: string): boolean {
    if (this.allowedDomains.has(hostname)) return true;
    for (const domain of this.allowedDomains) {
      if (hostname.endsWith("." + domain)) return true;
    }
    return false;
  }

  /** Get the current allowed domains (for debugging/display) */
  getAllowedDomains(): string[] {
    return [...this.allowedDomains];
  }
}
