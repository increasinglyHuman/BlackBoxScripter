/**
 * Type Definition Loader — IntelliSense for the TypeScript editor panel.
 *
 * Loads poqpoq type declarations into Monaco's TypeScript language service
 * so that scripts get full IntelliSense: autocomplete, hover info, and
 * type checking for WorldScript, Vector3, Agent, events, etc.
 *
 * The declarations are embedded as template literals rather than loaded from
 * dist/ .d.ts files. This avoids a build-step dependency and gives us precise
 * control over what script authors see in IntelliSense.
 */

import * as monaco from "monaco-editor";

// Monaco 0.55+ marks `languages.typescript` as deprecated in its type defs,
// but the runtime API is fully functional. Access via `any` cast.
/* eslint-disable @typescript-eslint/no-explicit-any */
const tsLang = (monaco.languages as any).typescript;

/** Configure Monaco's TypeScript compiler and load type definitions */
export function loadPoqpoqTypes(): void {
  const ts = tsLang.typescriptDefaults;

  ts.setCompilerOptions({
    target: tsLang.ScriptTarget.ES2022,
    module: tsLang.ModuleKind.ESNext,
    moduleResolution: tsLang.ModuleResolutionKind.Classic,
    strict: true,
    allowNonTsExtensions: true,
    noEmit: true,
  });

  // Suppress default lib diagnostics
  ts.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Load the poqpoq type declarations
  ts.addExtraLib(POQPOQ_TYPES_DTS, "file:///node_modules/poqpoq/types.d.ts");
}

/**
 * Combined type declaration for the poqpoq scripting API.
 * This is what `import { WorldScript } from "poqpoq/types"` resolves to.
 */
const POQPOQ_TYPES_DTS = `
declare module "poqpoq/types" {
  // ============================================================
  // Math Types
  // ============================================================

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    add(other: Vector3): Vector3;
    subtract(other: Vector3): Vector3;
    scale(factor: number): Vector3;
    dot(other: Vector3): number;
    cross(other: Vector3): Vector3;
    length(): number;
    normalize(): Vector3;
    distanceTo(other: Vector3): number;
    equals(other: Vector3, epsilon?: number): boolean;
    clone(): Vector3;
    toArray(): [number, number, number];
    toString(): string;
    static readonly ZERO: Vector3;
    static readonly ONE: Vector3;
    static readonly UP: Vector3;
    static readonly FORWARD: Vector3;
    static readonly RIGHT: Vector3;
    static fromLSL(str: string): Vector3;
    static fromString(str: string): Vector3;
  }

  export class Quaternion {
    constructor(x?: number, y?: number, z?: number, s?: number);
    x: number;
    y: number;
    z: number;
    s: number;
    multiply(other: Quaternion): Quaternion;
    normalize(): Quaternion;
    inverse(): Quaternion;
    toEuler(): Vector3;
    equals(other: Quaternion, epsilon?: number): boolean;
    clone(): Quaternion;
    toString(): string;
    static readonly IDENTITY: Quaternion;
    static fromEuler(v: Vector3): Quaternion;
    static fromAxisAngle(axis: Vector3, angle: number): Quaternion;
    static fromLSL(str: string): Quaternion;
    static fromString(str: string): Quaternion;
  }

  export class Color3 {
    constructor(r?: number, g?: number, b?: number);
    r: number;
    g: number;
    b: number;
    toVector3(): Vector3;
    toHex(): string;
    toString(): string;
    static readonly WHITE: Color3;
    static readonly BLACK: Color3;
    static readonly RED: Color3;
    static readonly GREEN: Color3;
    static readonly BLUE: Color3;
    static fromHex(hex: string): Color3;
    static fromVector3(v: Vector3): Color3;
  }

  // ============================================================
  // Agent
  // ============================================================

  export interface Agent {
    readonly id: string;
    readonly name: string;
    readonly username: string;
    getPosition(): Vector3;
    getRotation(): Quaternion;
    getVelocity(): Vector3;
    isPresent(): boolean;
    distanceFrom(point: Vector3): number;
    sendMessage(message: string): void;
    giveItem(itemName: string): void;
    teleport(destination: Vector3, lookAt?: Vector3): Promise<void>;
    playAnimation(animation: string): void;
    stopAnimation(animation: string): void;
    attach(attachPoint: AttachPoint): void;
    detach(): void;
  }

  export enum AttachPoint {
    Chest = 1, Head = 2, LeftShoulder = 3, RightShoulder = 4,
    LeftHand = 5, RightHand = 6, LeftFoot = 7, RightFoot = 8,
    Back = 9, Pelvis = 10, Mouth = 11, Chin = 12,
    LeftEar = 13, RightEar = 14, LeftEye = 15, RightEye = 16,
    Nose = 17, Neck = 39, AvatarCenter = 40,
  }

  // ============================================================
  // World Object
  // ============================================================

  export interface MaterialConfig {
    color?: Color3;
    alpha?: number;
    texture?: string;
    glow?: number;
    fullBright?: boolean;
  }

  export interface ParticleConfig {
    texture?: string;
    color?: Color3;
    endColor?: Color3;
    startAlpha?: number;
    endAlpha?: number;
    startScale?: Vector3;
    endScale?: Vector3;
    burstRate?: number;
    burstCount?: number;
    maxAge?: number;
    particleLifetime?: number;
    speed?: number;
    acceleration?: Vector3;
    pattern?: "drop" | "explode" | "angle" | "cone";
  }

  export interface AnimationOptions {
    duration?: number;
    easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  }

  export interface SoundOptions {
    volume?: number;
    loop?: boolean;
    spatial?: boolean;
    radius?: number;
  }

  export interface PhysicsConfig {
    enabled?: boolean;
    mass?: number;
    friction?: number;
    restitution?: number;
    gravity?: boolean;
  }

  export const ALL_SIDES: number;

  export interface WorldObject {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly creatorId: string;
    readonly ownerId: string;
    getPosition(): Vector3;
    getRotation(): Quaternion;
    getScale(): Vector3;
    setPosition(pos: Vector3, options?: AnimationOptions): Promise<void>;
    setRotation(rot: Quaternion, options?: AnimationOptions): Promise<void>;
    setScale(scale: Vector3, options?: AnimationOptions): Promise<void>;
    rotateTo(x: number, y: number, z: number, options?: AnimationOptions): Promise<void>;
    moveBy(offset: Vector3, options?: AnimationOptions): Promise<void>;
    scaleBy(factor: number, options?: AnimationOptions): Promise<void>;
    setColor(color: Color3, face?: number): void;
    setAlpha(alpha: number, face?: number): void;
    setTexture(texture: string, face?: number): void;
    setMaterial(config: MaterialConfig, face?: number): void;
    setFullBright(bright: boolean, face?: number): void;
    setGlow(intensity: number, face?: number): void;
    setText(text: string, color?: Color3, alpha?: number): void;
    setPhysics(config: PhysicsConfig): void;
    applyForce(force: Vector3, local?: boolean): void;
    applyImpulse(impulse: Vector3, local?: boolean): void;
    getVelocity(): Vector3;
    setVelocity(vel: Vector3): void;
    particles(config: ParticleConfig): void;
    stopParticles(): void;
    playSound(sound: string, options?: SoundOptions): void;
    stopSound(): void;
    loopSound(sound: string, volume?: number): void;
    getLinkCount(): number;
    getLink(linkNumber: number): WorldObject | null;
    getLinks(): WorldObject[];
    setClickAction(action: "none" | "touch" | "sit" | "buy" | "pay" | "open"): void;
    setSitTarget(offset: Vector3, rotation: Quaternion): void;
    canModify(): boolean;
    canCopy(): boolean;
    canTransfer(): boolean;
    raycast(direction: Vector3, distance: number): RaycastHit | null;
  }

  // ============================================================
  // Events
  // ============================================================

  export interface DetectedInfo {
    readonly id: string;
    readonly name: string;
    readonly position: Vector3;
    readonly rotation: Quaternion;
    readonly velocity: Vector3;
    readonly type: DetectedType;
    readonly owner: string;
    readonly group: string;
    readonly linkNumber: number;
  }

  export enum DetectedType {
    Agent = 1, Active = 2, Passive = 4, Scripted = 8,
  }

  export interface RaycastHit {
    readonly object: WorldObject;
    readonly position: Vector3;
    readonly normal: Vector3;
    readonly distance: number;
    readonly face: number;
  }

  export interface WeatherState {
    readonly type: "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm";
    readonly intensity: number;
    readonly windDirection: Vector3;
    readonly windSpeed: number;
  }

  export interface QuestProgress {
    readonly questId: string;
    readonly questName: string;
    readonly stage: number;
    readonly totalStages: number;
  }

  export interface ZoneInfo {
    readonly id: string;
    readonly name: string;
    readonly bounds: { min: Vector3; max: Vector3 };
  }

  export enum ScriptPermission {
    Debit = 0x0002, TakeControls = 0x0004, TriggerAnimation = 0x0010,
    Attach = 0x0020, ChangeLinks = 0x0080, TrackCamera = 0x0400,
    ControlCamera = 0x0800, Teleport = 0x1000, OverrideAnimations = 0x8000,
  }

  export enum ControlFlag {
    Forward = 0x0001, Back = 0x0002, Left = 0x0004, Right = 0x0008,
    Up = 0x0010, Down = 0x0020, RotateLeft = 0x0100, RotateRight = 0x0200,
  }

  export enum ChangeFlag {
    Inventory = 0x0001, Color = 0x0002, Shape = 0x0004, Scale = 0x0008,
    Texture = 0x0010, Link = 0x0020, Owner = 0x0080, Region = 0x0100,
    Teleport = 0x0200,
  }

  // ============================================================
  // NPC System
  // ============================================================

  export interface NPCAppearance {
    preset?: string;
    shape?: string;
    skin?: string;
    hair?: string;
    outfit?: string[];
  }

  export interface NPCMoveOptions {
    speed?: "walk" | "run" | "fly";
    pathfind?: boolean;
    stopDistance?: number;
    timeout?: number;
  }

  export interface PatrolWaypoint {
    position: Vector3;
    lookAt?: Vector3;
    pauseDuration?: number;
    animation?: string;
    say?: string;
  }

  export interface NPC {
    readonly id: string;
    readonly name: string;
    isActive(): boolean;
    getPosition(): Vector3;
    getRotation(): Quaternion;
    setPosition(pos: Vector3): void;
    setRotation(rot: Quaternion): void;
    moveTo(position: Vector3, options?: NPCMoveOptions): Promise<void>;
    stop(): void;
    lookAt(target: Vector3): void;
    follow(agentId: string, distance?: number): void;
    patrol(waypoints: PatrolWaypoint[], loop?: boolean): void;
    wander(center: Vector3, radius: number): void;
    say(message: string, channel?: number): void;
    whisper(message: string, channel?: number): void;
    shout(message: string, channel?: number): void;
    playAnimation(animation: string): void;
    stopAnimation(animation: string): void;
    sit(target: string): void;
    stand(): void;
    setAppearance(appearance: NPCAppearance): void;
    remove(): void;
  }

  export interface NPCFactory {
    create(name: string, position: Vector3, appearance?: NPCAppearance): NPC;
    get(id: string): NPC | null;
    getAll(): NPC[];
    removeAll(): void;
  }

  // ============================================================
  // AI Companion
  // ============================================================

  export interface Companion {
    readonly name: string;
    readonly id: string;
    ask(prompt: string): Promise<string>;
    announce(message: string): void;
    say(message: string, channel?: number): void;
    requestAction(action: string): Promise<boolean>;
    getMood(): string;
  }

  export interface CompanionAPI {
    get(): Companion | null;
    isAvailable(): boolean;
  }

  // ============================================================
  // Script Container
  // ============================================================

  export type AssetType = "texture" | "sound" | "animation" | "notecard" | "script" | "object" | "clothing" | "bodypart" | "landmark";

  export interface Asset {
    readonly id: string;
    readonly name: string;
    readonly type: AssetType;
  }

  export const LINK_SET: number;
  export const LINK_ALL_OTHERS: number;
  export const LINK_ALL_CHILDREN: number;
  export const LINK_THIS: number;
  export const LINK_ROOT: number;
  export type LinkTarget = number;

  export interface ScriptContainer {
    readonly id: string;
    readonly object: WorldObject;
    readonly scripts: readonly string[];
    getAsset(name: string): Asset | null;
    getAssets(type?: AssetType): Asset[];
    hasAsset(name: string): boolean;
    getAssetCount(type?: AssetType): number;
    sendLinkMessage(link: LinkTarget, num: number, str: string, id: string): void;
  }

  // ============================================================
  // World API
  // ============================================================

  export interface HttpResponse {
    readonly status: number;
    readonly headers: Record<string, string>;
    readonly body: string;
  }

  export interface StorageAPI {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
  }

  export interface HttpAPI {
    get(url: string, headers?: Record<string, string>): Promise<HttpResponse>;
    post(url: string, body: string, headers?: Record<string, string>): Promise<HttpResponse>;
    put(url: string, body: string, headers?: Record<string, string>): Promise<HttpResponse>;
    delete(url: string, headers?: Record<string, string>): Promise<HttpResponse>;
  }

  export interface EnvironmentAPI {
    getTimeOfDay(): number;
    setTimeOfDay(hour: number): void;
    getWeather(): WeatherState;
    setWeather(weather: Partial<WeatherState>): void;
    setWind(direction: Vector3, speed: number): void;
    setGravity(strength: number): void;
    getSunDirection(): Vector3;
  }

  export interface WorldAPI {
    getObject(idOrName: string): WorldObject | null;
    getObjectsInRadius(center: Vector3, radius: number): WorldObject[];
    getGroundHeight(position: Vector3): number;
    say(channel: number, message: string): void;
    whisper(channel: number, message: string): void;
    shout(channel: number, message: string): void;
    regionSay(channel: number, message: string): void;
    listen(channel: number, name?: string, id?: string, message?: string): ListenHandle;
    getAgent(id: string): Agent | null;
    getAgents(): Agent[];
    getAgentCount(): number;
    setTimer(interval: number, id?: string): TimerHandle;
    clearTimer(id?: string): void;
    sensor(name: string, id: string, type: number, range: number, arc: number): void;
    sensorRepeat(name: string, id: string, type: number, range: number, arc: number, rate: number): void;
    sensorRemove(): void;
    raycast(start: Vector3, end: Vector3): RaycastHit[];
    requestPermissions(agentId: string, permissions: ScriptPermission): void;
    readonly npc: NPCFactory;
    readonly storage: StorageAPI;
    readonly http: HttpAPI;
    readonly environment: EnvironmentAPI;
    readonly companion: CompanionAPI;
    getTime(): number;
    getUnixTime(): number;
    getRegionName(): string;
    log(...args: unknown[]): void;
    sleep(seconds: number): Promise<void>;
  }

  // ============================================================
  // WorldScript — Base class for all scripts
  // ============================================================

  export type StateDefinition = Partial<ScriptEventHandlers>;

  export interface TimerHandle {
    readonly id: string;
    cancel(): void;
  }

  export interface ListenHandle {
    readonly id: string;
    remove(): void;
  }

  export interface ScriptEventHandlers {
    onStateEntry?(state: string): void | Promise<void>;
    onStateExit?(state: string): void | Promise<void>;
    onRez?(startParam: number): void | Promise<void>;
    onScriptReset?(): void | Promise<void>;
    onTouchStart?(agent: Agent, face: number): void | Promise<void>;
    onTouch?(agent: Agent, face: number): void | Promise<void>;
    onTouchEnd?(agent: Agent, face: number): void | Promise<void>;
    onCollisionStart?(detected: DetectedInfo[]): void | Promise<void>;
    onCollision?(detected: DetectedInfo[]): void | Promise<void>;
    onCollisionEnd?(detected: DetectedInfo[]): void | Promise<void>;
    onLandCollisionStart?(position: Vector3): void | Promise<void>;
    onListen?(channel: number, name: string, id: string, message: string): void | Promise<void>;
    onTimer?(timerId?: string): void | Promise<void>;
    onSensor?(detected: DetectedInfo[]): void | Promise<void>;
    onNoSensor?(): void | Promise<void>;
    onMoney?(agent: Agent, amount: number): void | Promise<void>;
    onControl?(agent: Agent, held: number, changed: number): void | Promise<void>;
    onPermissions?(agent: Agent, permissions: number): void | Promise<void>;
    onChanged?(change: number): void | Promise<void>;
    onAttach?(agentId: string): void | Promise<void>;
    onMovingStart?(): void | Promise<void>;
    onMovingEnd?(): void | Promise<void>;
    onLinkMessage?(senderLink: number, num: number, str: string, id: string): void | Promise<void>;
    onDataserver?(queryId: string, data: string): void | Promise<void>;
    onHttpResponse?(requestId: string, status: number, headers: Record<string, string>, body: string): void | Promise<void>;
    onAtTarget?(handle: number, targetPos: Vector3, currentPos: Vector3): void | Promise<void>;
    onNotAtTarget?(): void | Promise<void>;
    onCompanionMessage?(companion: Companion, message: string): void | Promise<void>;
    onPlayerEnterZone?(agent: Agent, zone: ZoneInfo): void | Promise<void>;
    onPlayerLeaveZone?(agent: Agent, zone: ZoneInfo): void | Promise<void>;
    onDayNightCycle?(phase: "dawn" | "day" | "dusk" | "night"): void | Promise<void>;
    onWeatherChange?(weather: WeatherState): void | Promise<void>;
    onQuestProgress?(progress: QuestProgress): void | Promise<void>;
  }

  export abstract class WorldScript implements ScriptEventHandlers {
    readonly object: WorldObject;
    readonly world: WorldAPI;
    readonly owner: Agent;
    readonly container: ScriptContainer;
    readonly scriptId: string;
    readonly currentState: string;
    states: Record<string, StateDefinition>;
    transitionTo(newState: string): Promise<void>;
    say(channel: number, message: string): void;
    whisper(channel: number, message: string): void;
    shout(channel: number, message: string): void;
    listen(channel: number, name?: string, id?: string, message?: string): ListenHandle;
    sendLinkMessage(link: LinkTarget, num: number, str: string, id: string): void;
    setTimer(interval: number, id?: string): TimerHandle;
    clearTimer(id?: string): void;
    delay(seconds: number): Promise<void>;
    sensor(name: string, id: string, type: number, range: number, arc: number): void;
    sensorRepeat(name: string, id: string, type: number, range: number, arc: number, rate: number): void;
    sensorRemove(): void;
    requestPermissions(agent: Agent, permissions: ScriptPermission): void;
    random(): number;
    getTime(): number;
    reset(): void;
    log(...args: unknown[]): void;
  }
}
`;
