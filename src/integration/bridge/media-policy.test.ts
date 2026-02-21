import { describe, it, expect } from "vitest";
import { MediaPolicy } from "./media-policy.js";

describe("MediaPolicy", () => {
  describe("default allowlist", () => {
    const policy = new MediaPolicy();

    it("allows YouTube URLs", () => {
      expect(policy.validate("https://www.youtube.com/embed/abc")).toBeNull();
      expect(policy.validate("https://youtube-nocookie.com/embed/abc")).toBeNull();
      expect(policy.validate("https://youtu.be/abc")).toBeNull();
    });

    it("allows Twitch URLs", () => {
      expect(policy.validate("https://player.twitch.tv/?channel=foo")).toBeNull();
    });

    it("allows Discord URLs", () => {
      expect(policy.validate("https://discord.com/widget?id=123")).toBeNull();
    });

    it("allows Vimeo URLs", () => {
      expect(policy.validate("https://player.vimeo.com/video/123")).toBeNull();
    });

    it("allows Spotify URLs", () => {
      expect(policy.validate("https://open.spotify.com/embed/track/abc")).toBeNull();
    });

    it("allows subdomains of allowed domains", () => {
      expect(policy.validate("https://cdn.youtube.com/something")).toBeNull();
      expect(policy.validate("https://clips.twitch.tv/clip")).toBeNull();
    });

    it("rejects unlisted domains", () => {
      const err = policy.validate("https://evil.com/page");
      expect(err).toContain("not in allowlist");
    });

    it("rejects data: URIs by default", () => {
      const err = policy.validate("data:text/html,<h1>Hi</h1>");
      expect(err).toContain("data:");
    });
  });

  describe("HTTPS enforcement", () => {
    it("rejects HTTP URLs when requireHttps is true (default)", () => {
      const policy = new MediaPolicy();
      const err = policy.validate("http://www.youtube.com/embed/abc");
      expect(err).toContain("HTTPS required");
    });

    it("allows HTTP URLs when requireHttps is false", () => {
      const policy = new MediaPolicy({ requireHttps: false });
      expect(policy.validate("http://www.youtube.com/embed/abc")).toBeNull();
    });

    it("rejects non-http protocols", () => {
      const policy = new MediaPolicy({ requireHttps: false });
      const err = policy.validate("ftp://youtube.com/file");
      expect(err).toContain("Unsupported protocol");
    });
  });

  describe("custom configuration", () => {
    it("adds extra domains via allowedDomains", () => {
      const policy = new MediaPolicy({ allowedDomains: ["example.com"] });
      expect(policy.validate("https://example.com/page")).toBeNull();
      // Defaults still work
      expect(policy.validate("https://youtube.com/embed/abc")).toBeNull();
    });

    it("replaces defaults with overrideDomains", () => {
      const policy = new MediaPolicy({ overrideDomains: ["custom.com"] });
      expect(policy.validate("https://custom.com/page")).toBeNull();
      // Defaults removed
      expect(policy.validate("https://youtube.com/embed/abc")).not.toBeNull();
    });

    it("allows data: URIs when configured", () => {
      const policy = new MediaPolicy({ allowDataUrls: true });
      expect(policy.validate("data:text/html,<h1>Hi</h1>")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("rejects empty URL", () => {
      const policy = new MediaPolicy();
      expect(policy.validate("")).toContain("Empty URL");
    });

    it("rejects malformed URL", () => {
      const policy = new MediaPolicy();
      expect(policy.validate("not-a-url")).toContain("Invalid URL");
    });

    it("returns allowed domains list", () => {
      const policy = new MediaPolicy();
      const domains = policy.getAllowedDomains();
      expect(domains).toContain("youtube.com");
      expect(domains).toContain("discord.com");
    });
  });
});
