/**
 * Reference Media Surface — Manages media-on-a-prim lifecycle.
 *
 * Uses factory injection for DOM element creation and texture assignment,
 * making this testable without a browser.
 *
 * Usage (in World repo):
 *   import { ReferenceMediaSurface } from "blackbox-scripter/bridge";
 *   const media = new ReferenceMediaSurface(domFactory, textureFactory);
 *   const bridge = new ReferenceBabylonBridge(scene, { media });
 */

import type { MediaSurfaceLike, TextureFactoryLike } from "./engine-types.js";
import { MediaPolicy, type MediaPolicyConfig } from "./media-policy.js";

// === Structural interfaces for DOM elements ===

export interface VideoElementLike {
  src: string;
  muted: boolean;
  loop: boolean;
  autoplay: boolean;
  volume: number;
  play(): Promise<void> | void;
  pause(): void;
}

export interface IframeElementLike {
  src: string;
  width: string;
  height: string;
  style: Record<string, string>;
}

/** Factory injected by the host to create/destroy DOM elements */
export interface MediaElementFactory {
  createVideoElement(src: string, options?: {
    muted?: boolean;
    loop?: boolean;
    autoplay?: boolean;
  }): VideoElementLike;
  createIframeElement(src: string, width: number, height: number): IframeElementLike;
  destroyElement(element: unknown): void;
  attachToMesh?(objectId: string, face: number, element: unknown): void;
}

/** Tracks one active media entry on an object face */
interface ActiveMedia {
  objectId: string;
  face: number;
  mediaType: "video" | "iframe" | "stream";
  url: string;
  element: VideoElementLike | IframeElementLike;
  texture?: unknown;
}

export interface MediaSurfaceConfig {
  policy?: MediaPolicyConfig;
}

export class ReferenceMediaSurface implements MediaSurfaceLike {
  private activeMedia = new Map<string, ActiveMedia>();
  private policy: MediaPolicy;
  private elementFactory: MediaElementFactory;
  private textureFactory?: TextureFactoryLike;

  constructor(
    elementFactory: MediaElementFactory,
    textureFactory?: TextureFactoryLike,
    config?: MediaSurfaceConfig,
  ) {
    this.elementFactory = elementFactory;
    this.textureFactory = textureFactory;
    this.policy = new MediaPolicy(config?.policy);
  }

  private key(objectId: string, face: number): string {
    return `${objectId}:${face}`;
  }

  setMedia(
    objectId: string,
    face: number,
    mediaType: string,
    url: string,
    options?: Record<string, unknown>,
  ): void {
    const policyError = this.policy.validate(url);
    if (policyError) {
      return;
    }

    // Clean up existing media on this face
    this.stopMedia(objectId, face);

    const k = this.key(objectId, face);
    const muted = (options?.muted as boolean) ?? true;
    const loop = (options?.loop as boolean) ?? false;
    const autoplay = (options?.autoplay as boolean) ?? true;
    const width = (options?.width as number) ?? 512;
    const height = (options?.height as number) ?? 512;

    let element: VideoElementLike | IframeElementLike;
    let texture: unknown;

    switch (mediaType) {
      case "video": {
        const video = this.elementFactory.createVideoElement(url, { muted, loop, autoplay });
        element = video;
        if (this.textureFactory?.createVideoTexture) {
          texture = this.textureFactory.createVideoTexture(`media_${k}`, url);
        }
        this.elementFactory.attachToMesh?.(objectId, face, video);
        break;
      }
      case "iframe": {
        const iframe = this.elementFactory.createIframeElement(url, width, height);
        element = iframe;
        this.elementFactory.attachToMesh?.(objectId, face, iframe);
        break;
      }
      case "stream": {
        const streamVideo = this.elementFactory.createVideoElement(url, { muted, loop: false, autoplay: true });
        element = streamVideo;
        if (this.textureFactory?.createVideoTexture) {
          texture = this.textureFactory.createVideoTexture(`stream_${k}`, url);
        }
        this.elementFactory.attachToMesh?.(objectId, face, streamVideo);
        break;
      }
      default:
        return;
    }

    this.activeMedia.set(k, {
      objectId,
      face,
      mediaType: mediaType as "video" | "iframe" | "stream",
      url,
      element,
      texture,
    });
  }

  stopMedia(objectId: string, face: number): void {
    const k = this.key(objectId, face);
    const active = this.activeMedia.get(k);
    if (!active) return;

    if (active.mediaType === "video" || active.mediaType === "stream") {
      (active.element as VideoElementLike).pause();
    }

    this.elementFactory.destroyElement(active.element);
    this.activeMedia.delete(k);
  }

  setVolume(objectId: string, volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    for (const active of this.activeMedia.values()) {
      if (active.objectId === objectId &&
          (active.mediaType === "video" || active.mediaType === "stream")) {
        (active.element as VideoElementLike).volume = clamped;
      }
    }
  }

  /** Check if an object face has active media */
  hasMedia(objectId: string, face: number): boolean {
    return this.activeMedia.has(this.key(objectId, face));
  }

  /** Active media entry count (for diagnostics) */
  get activeCount(): number {
    return this.activeMedia.size;
  }

  /** Clean up all active media (e.g., on scene dispose) */
  disposeAll(): void {
    for (const active of this.activeMedia.values()) {
      if (active.mediaType === "video" || active.mediaType === "stream") {
        (active.element as VideoElementLike).pause();
      }
      this.elementFactory.destroyElement(active.element);
    }
    this.activeMedia.clear();
  }
}
