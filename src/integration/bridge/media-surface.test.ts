import { describe, it, expect, vi } from "vitest";
import { ReferenceMediaSurface } from "./media-surface.js";
import type { MediaElementFactory, VideoElementLike, IframeElementLike } from "./media-surface.js";

// === Test Helpers ===

function createMockElementFactory() {
  const created: unknown[] = [];
  const destroyed: unknown[] = [];
  const attached: Array<{ objectId: string; face: number; element: unknown }> = [];

  const factory: MediaElementFactory & {
    created: unknown[];
    destroyed: unknown[];
    attached: typeof attached;
  } = {
    created,
    destroyed,
    attached,
    createVideoElement(src: string, options?: { muted?: boolean; loop?: boolean; autoplay?: boolean }): VideoElementLike {
      const el: VideoElementLike = {
        src,
        muted: options?.muted ?? true,
        loop: options?.loop ?? false,
        autoplay: options?.autoplay ?? true,
        volume: 1,
        play: vi.fn(),
        pause: vi.fn(),
      };
      created.push(el);
      return el;
    },
    createIframeElement(src: string, width: number, height: number): IframeElementLike {
      const el: IframeElementLike = {
        src,
        width: String(width),
        height: String(height),
        style: {},
      };
      created.push(el);
      return el;
    },
    destroyElement(element: unknown) {
      destroyed.push(element);
    },
    attachToMesh(objectId: string, face: number, element: unknown) {
      attached.push({ objectId, face, element });
    },
  };
  return factory;
}

// Permissive policy for most tests
const PERMISSIVE_POLICY = {
  policy: {
    overrideDomains: ["youtube.com", "discord.com", "twitch.tv", "example.com"],
    requireHttps: false,
  },
};

// === Tests ===

describe("ReferenceMediaSurface", () => {
  describe("setMedia", () => {
    it("creates video element for video type", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");

      expect(factory.created).toHaveLength(1);
      expect((factory.created[0] as VideoElementLike).src).toBe("http://youtube.com/embed/abc");
    });

    it("creates iframe element for iframe type", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "iframe", "http://discord.com/widget", { width: 800, height: 600 });

      expect(factory.created).toHaveLength(1);
      const iframe = factory.created[0] as IframeElementLike;
      expect(iframe.src).toBe("http://discord.com/widget");
      expect(iframe.width).toBe("800");
      expect(iframe.height).toBe("600");
    });

    it("creates video element for stream type", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "stream", "http://twitch.tv/stream/abc");

      expect(factory.created).toHaveLength(1);
      const video = factory.created[0] as VideoElementLike;
      expect(video.autoplay).toBe(true);
      expect(video.loop).toBe(false);
    });

    it("passes options to video element", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc", {
        muted: false,
        loop: true,
        autoplay: false,
      });

      const video = factory.created[0] as VideoElementLike;
      expect(video.muted).toBe(false);
      expect(video.loop).toBe(true);
      expect(video.autoplay).toBe(false);
    });

    it("calls attachToMesh with objectId and face", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 2, "video", "http://youtube.com/embed/abc");

      expect(factory.attached).toHaveLength(1);
      expect(factory.attached[0].objectId).toBe("obj-1");
      expect(factory.attached[0].face).toBe(2);
    });

    it("uses texture factory when available", () => {
      const factory = createMockElementFactory();
      const textureFactory = {
        createTexture: vi.fn(),
        createDynamicTexture: vi.fn(),
        createVideoTexture: vi.fn().mockReturnValue("mock-texture"),
      };
      const surface = new ReferenceMediaSurface(factory, textureFactory, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");

      expect(textureFactory.createVideoTexture).toHaveBeenCalledWith("media_obj-1:0", "http://youtube.com/embed/abc");
    });

    it("rejects URLs failing policy validation", () => {
      const factory = createMockElementFactory();
      // Default policy (HTTPS required, limited domains)
      const surface = new ReferenceMediaSurface(factory);

      surface.setMedia("obj-1", 0, "video", "https://evil.com/bad");

      expect(factory.created).toHaveLength(0);
      expect(surface.hasMedia("obj-1", 0)).toBe(false);
    });

    it("cleans up existing media before setting new media on same face", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/first");
      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/second");

      expect(factory.created).toHaveLength(2);
      expect(factory.destroyed).toHaveLength(1);
      expect(surface.activeCount).toBe(1);
    });

    it("ignores unknown media types", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "unknown", "http://example.com");

      expect(factory.created).toHaveLength(0);
    });
  });

  describe("stopMedia", () => {
    it("pauses video element before destroy", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      const video = factory.created[0] as VideoElementLike;

      surface.stopMedia("obj-1", 0);

      expect(video.pause).toHaveBeenCalled();
    });

    it("destroys the DOM element via factory", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      surface.stopMedia("obj-1", 0);

      expect(factory.destroyed).toHaveLength(1);
    });

    it("removes entry from active media map", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      expect(surface.hasMedia("obj-1", 0)).toBe(true);

      surface.stopMedia("obj-1", 0);
      expect(surface.hasMedia("obj-1", 0)).toBe(false);
    });

    it("is a no-op for non-existent media", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      // Should not throw
      surface.stopMedia("obj-1", 0);
      expect(factory.destroyed).toHaveLength(0);
    });
  });

  describe("setVolume", () => {
    it("sets volume on active video elements for an object", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      surface.setVolume("obj-1", 0.5);

      const video = factory.created[0] as VideoElementLike;
      expect(video.volume).toBe(0.5);
    });

    it("clamps volume to 0-1 range", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      const video = factory.created[0] as VideoElementLike;

      surface.setVolume("obj-1", 1.5);
      expect(video.volume).toBe(1);

      surface.setVolume("obj-1", -0.5);
      expect(video.volume).toBe(0);
    });

    it("does not affect iframe elements", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "iframe", "http://discord.com/widget");
      // Should not throw
      surface.setVolume("obj-1", 0.5);
    });
  });

  describe("lifecycle", () => {
    it("disposeAll cleans up all active media", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/a");
      surface.setMedia("obj-2", 0, "video", "http://youtube.com/embed/b");
      surface.setMedia("obj-3", 0, "iframe", "http://discord.com/widget");

      surface.disposeAll();

      expect(factory.destroyed).toHaveLength(3);
      expect(surface.activeCount).toBe(0);
    });

    it("hasMedia returns correct status", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      expect(surface.hasMedia("obj-1", 0)).toBe(false);
      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/abc");
      expect(surface.hasMedia("obj-1", 0)).toBe(true);
    });

    it("activeCount tracks entries", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      expect(surface.activeCount).toBe(0);
      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/a");
      expect(surface.activeCount).toBe(1);
      surface.setMedia("obj-1", 1, "video", "http://youtube.com/embed/b");
      expect(surface.activeCount).toBe(2);
    });
  });

  describe("multiple faces", () => {
    it("supports media on multiple faces of same object", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/a");
      surface.setMedia("obj-1", 2, "iframe", "http://discord.com/widget");

      expect(surface.hasMedia("obj-1", 0)).toBe(true);
      expect(surface.hasMedia("obj-1", 2)).toBe(true);
      expect(surface.activeCount).toBe(2);
    });

    it("stop on one face does not affect other faces", () => {
      const factory = createMockElementFactory();
      const surface = new ReferenceMediaSurface(factory, undefined, PERMISSIVE_POLICY);

      surface.setMedia("obj-1", 0, "video", "http://youtube.com/embed/a");
      surface.setMedia("obj-1", 2, "iframe", "http://discord.com/widget");

      surface.stopMedia("obj-1", 0);

      expect(surface.hasMedia("obj-1", 0)).toBe(false);
      expect(surface.hasMedia("obj-1", 2)).toBe(true);
    });
  });
});
