/*!
 * Urchin Version 0.2
 * A light-weight 3D renderer for realtime rendering in browser applications with the use of Canvas 2D.
 *
 * Copyright Trevor Richard
 *
 * Released under the MIT license
 * http://urchin3d.org/license
 */
declare var URCHIN_PATH: string;
declare type OffscreenRenderingContext2D = any;
declare class Vector {
    x: number;
    y: number;
    z: number;
    static X_AXIS: number;
    static Y_AXIS: number;
    static Z_AXIS: number;
    constructor(x?: number, y?: number, z?: number);
    copy(): Vector;
    mag(): number;
    add(a: number | Vector): this;
    addX(a: number): this;
    addY(a: number): this;
    addZ(a: number): this;
    sub(a: number | Vector): this;
    subX(a: number): this;
    subY(a: number): this;
    subZ(a: number): this;
    div(a: number | Vector): this;
    divX(a: number): this;
    divY(a: number): this;
    divZ(a: number): this;
    normalize(): this;
    mult(a: number | Vector): this;
    multX(a: number): this;
    multY(a: number): this;
    multZ(a: number): this;
    neg(): this;
    cross(v: Vector): this;
    dot(v: Vector): number;
    qRotate(q: Quaternion): this;
    quaternionRotate(q: Quaternion): this;
    transform(M: Array<Array<number>>): this;
    rotateAxis(axis: number | Vector, angle: number): this;
    rotateX(xAngle: number): this;
    rotateY(yAngle: number): this;
    rotateZ(zAngle: number): this;
    angleBetween(v: Vector): number;
    project(v: Vector): this;
    planarProject(origin: Vector, normal: Vector): this;
    project2d(origin: Vector, normal: Vector, zAxis: Vector): this;
    equals(v: Vector): boolean;
    closest(V: Array<Vector>): Vector;
    furthest(V: Array<Vector>): Vector;
    static copy(v: Vector | {
        x: number;
        y: number;
        z: number;
    }): Vector;
    static mag(v: Vector): number;
    static normalize(v: Vector): Vector;
    static add(v: Vector, a: number | Vector): Vector;
    static addX(v: Vector, a: number): Vector;
    static addY(v: Vector, a: number): Vector;
    static addZ(v: Vector, a: number): Vector;
    static sub(v: Vector, a: number | Vector): Vector;
    static subX(v: Vector, a: number): Vector;
    static subY(v: Vector, a: number): Vector;
    static subZ(v: Vector, a: number): Vector;
    static div(v: Vector, a: number | Vector): Vector;
    static divX(v: Vector, a: number): Vector;
    static divY(v: Vector, a: number): Vector;
    static divZ(v: Vector, a: number): Vector;
    static mult(v: Vector, a: number | Vector): Vector;
    static multX(v: Vector, a: number): Vector;
    static multY(v: Vector, a: number): Vector;
    static multZ(v: Vector, a: number): Vector;
    static neg(v: Vector): Vector;
    static cross(v0: Vector, v1: Vector): Vector;
    static dot(v0: Vector, v1: Vector): number;
    static qRotate(v: Vector, q: Quaternion): Vector;
    static quaternionRotate(v: Vector, q: Quaternion): Vector;
    static transform(v: Vector, M: Array<Array<number>>): Vector;
    static rotateAxis(v: Vector, axis: number | Vector, angle: number): Vector;
    static rotateX(v: Vector, xAngle: number): Vector;
    static rotateY(v: Vector, yAngle: number): Vector;
    static rotateZ(v: Vector, zAngle: number): Vector;
    static angleBetween(v0: Vector, v1: Vector): number;
    static project(v0: Vector, v1: Vector): Vector;
    static planarProject(v: Vector, origin: Vector, normal: Vector): Vector;
    static project2d(v: Vector, origin: Vector, normal: Vector, zAxis: Vector): Vector;
    static planarIntersection(p0: Vector, p1: Vector, planarPoint: Vector, planarNormal: Vector): Vector;
    static equals(v0: Vector, v1: Vector): boolean;
    static closest(v: Vector, V: Array<Vector>): Vector;
    static furthest(v: Vector, V: Array<Vector>): Vector;
    static axis(a: number): Vector;
    static xAxis(): Vector;
    static yAxis(): Vector;
    static zAxis(): Vector;
}
interface ListNode<T> {
    nxt: ListNode<T> | any;
    data: T | any;
    priority: number;
}
declare class List<T> {
    head: ListNode<T>;
    tail: ListNode<T>;
    count: number;
    minPriority: number;
    maxPriority: number;
    constructor();
    addLast(data: T | any, priority?: number): void;
    addFirst(data: T | any, priority?: number): void;
    private updatePriority;
    addByPriority(data: T | any, priority: number): void;
    addListByPriority(list: List<T>): void;
    linkLast(list: List<T>): void;
    linkFirst(list: List<T>): void;
    copy(): List<T>;
}
declare class Num {
    static getSign(a: number): number;
    static constrain(val: number, low: number, high: number): number;
    static byteToFloat(b3: number, b2: number, b1: number, b0: number): number;
    static avg(a: Array<number>): number;
    static rad(deg: number): number;
    static deg(rad: number): number;
}
declare class Color {
    static RGBA: number;
    static HSL: number;
    type: number;
    r: number;
    g: number;
    b: number;
    a: number;
    h: number;
    s: number;
    l: number;
    constructor();
    constructor(color: string);
    constructor(hex: string);
    constructor(grayscale: number);
    constructor(grayscale: number, alpha: number);
    constructor(hue: number, saturation: number, lightness: number);
    constructor(red: number, green: number, blue: number, alpha: number);
    toString(): string;
    copy(): Color;
    applyLight(color: Color, intensity: number): this;
    toRGB(): Color;
    add(color: Color): this;
    mult(intensity: number): this;
    static copy(c: Color): Color;
    static toString(c: Color): string;
    static toRGB(c: Color): Color;
    static add(c0: Color, c1: Color): Color;
    static applyLight(c: Color, l: Color, intensity: number): Color;
    static mult(c: Color, intensity: number): Color;
}
interface Light {
    color: Color;
    brightness: number;
    intensityOn(t: Trigon): number;
}
declare class Material {
    fill: Color;
    wire: Color;
    lit: boolean;
    constructor({ fill, wire, lit }?: {
        fill?: Color;
        wire?: Color;
        lit?: boolean;
    });
    setColor(c: Color): this;
    setFill(c: Color): this;
    setWire(c: Color): this;
    copy(): Material;
    static setColor(m: Material, c: Color): Material;
    static setFill(m: Material, c: Color): Material;
    static setWire(m: Material, c: Color): Material;
    static copy(m: Material): Material;
}
declare class Fragment {
    trigon: Trigon;
    material: Material;
    group: number;
    constructor(trigon: Trigon, material: Material, group: number);
    copy(): Fragment;
    static copy(f: Fragment): Fragment;
}
declare class Urbject {
    static PARENT: number;
    static MESH_URBJECT: number;
    static AMBIENT_LIGHT: number;
    static DIRECTIONAL_LIGHT: number;
    static POINT_LIGHT: number;
    static CAMERA: number;
    static DYNAMIC: number;
    static STATIC: number;
    static BILLBOARD: number;
    static Z_BILLBOARD: number;
    static X_BILLBOARD: number;
    static Y_BILLBOARD: number;
    static DEFAULT_GROUP: number;
    type: number;
    position: Vector;
    orientation: Quaternion;
    scaleVector: Vector;
    children: Array<Urbject>;
    parent: Urbject;
    state: number;
    group: number;
    protected instanceCache: FrameInstance;
    constructor({ type, position, orientation, scale, superCopy, state, group }?: {
        type?: number;
        position?: Vector;
        orientation?: Quaternion;
        scale?: number | Vector;
        superCopy?: Urbject;
        state?: number;
        group?: number;
    });
    translate(v: Vector): this;
    scale(a: number | Vector): this;
    setScale(a: number | Vector): this;
    addChild(c: Urbject): Urbject;
    removeChild(c: Urbject): Urbject;
    getInstance(camera: Camera): FrameInstance;
    applyTransform(transform: Urbject): this;
    getWorldTransform(): Urbject;
    copy(options?: {
        shallow: boolean;
    }): Urbject;
    static addChild(u: Urbject, c: Urbject): Urbject;
    static removeChild(u: Urbject, c: Urbject): Urbject;
    static applyTransform(target: Urbject, transform: Urbject): Urbject;
    static getWorldTransform(u: Urbject): Urbject;
    static getInstance(u: Urbject, camera: Camera): FrameInstance;
    static translate(u: Urbject, v: Vector): Urbject;
    static scale(u: Urbject, a: number | Vector): Urbject;
    static setScale(u: Urbject, a: number | Vector): Urbject;
    static copy(u: Urbject, options?: {
        typeCheck: boolean;
        shallow: boolean;
    }): Urbject;
}
declare class Trigon {
    v0: Vector;
    v1: Vector;
    v2: Vector;
    constructor(v0?: Vector, v1?: Vector, v2?: Vector);
    getNormal(): Vector;
    rotateAxis(axis: number | Vector, angle: number): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    qRotate(q: Quaternion): this;
    quaternionRotate(q: Quaternion): this;
    translate(v: Vector): this;
    transform(M: Array<Array<number>>): this;
    scale(s: number | Vector): this;
    getCenter(): Vector;
    applyTransform(transform: Urbject): this;
    inverseNormal(): this;
    copy(): Trigon;
    static applyTransform(target: Trigon, transform: Urbject): Trigon;
    static getNormal(t: Trigon): Vector;
    static rotateAxis(t: Trigon, axis: number, angle: number): Trigon;
    static rotateX(t: Trigon, angle: number): Trigon;
    static rotateY(t: Trigon, angle: number): Trigon;
    static rotateZ(t: Trigon, angle: number): Trigon;
    static qRotate(t: Trigon, q: Quaternion): Trigon;
    static quaternionRotate(t: Trigon, q: Quaternion): Trigon;
    static translate(t: Trigon, v: Vector): Trigon;
    static transform(t: Trigon, M: Array<Array<number>>): Trigon;
    static scale(t: Trigon, s: number | Vector): Trigon;
    static getCenter(t: Trigon): Vector;
    static inverseNormal(t: Trigon): Trigon;
    static copy(t: Trigon): Trigon;
}
declare class Quaternion {
    a: number;
    i: number;
    j: number;
    k: number;
    constructor(a?: number, i?: number, j?: number, k?: number);
    add(q: Quaternion): this;
    sub(q: Quaternion): this;
    conjugate(): this;
    mult(a: number): this;
    div(a: number): this;
    mag(): number;
    normalize(): this;
    qRotate(q: Quaternion): this;
    quaternionRotate(q: Quaternion): this;
    qMult(q: Quaternion): this;
    quaternionMult(q: Quaternion): this;
    rotateAxis(axis: number | Vector, angle: number): this;
    rotateX(a: number): this;
    rotateY(a: number): this;
    rotateZ(a: number): this;
    getRotationMatrix(): number[][];
    copy(): Quaternion;
    static sub(q0: Quaternion, q1: Quaternion): Quaternion;
    static add(q0: Quaternion, q1: Quaternion): Quaternion;
    static conjugate(q: Quaternion): Quaternion;
    static mult(q: Quaternion, a: number): Quaternion;
    static div(q: Quaternion, a: number): Quaternion;
    static mag(q: Quaternion): number;
    static normalize(q: Quaternion): Quaternion;
    static qMult(q0: Quaternion, q1: Quaternion): Quaternion;
    static quaternionMult(q0: Quaternion, q1: Quaternion): Quaternion;
    static qRotate(q0: Quaternion, q1: Quaternion): Quaternion;
    static quaternionRotate(q0: Quaternion, q1: Quaternion): Quaternion;
    static rotateAxis(q: Quaternion, axis: number | Vector, angle: number): Quaternion;
    static rotateX(q: Quaternion, a: number): Quaternion;
    static rotateY(q: Quaternion, a: number): Quaternion;
    static rotateZ(q: Quaternion, a: number): Quaternion;
    static getRotationMatrix(q: Quaternion): number[][];
    static copy(q: Quaternion | {
        a: number;
        i: number;
        j: number;
        k: number;
    }): Quaternion;
    static fromAxisRotation(axis: Vector | number, angle: number): Quaternion;
    static fromVector(v: Vector, reference?: Vector): Quaternion;
}
declare class Camera extends Urbject {
    fov: number;
    nearClip: number;
    constructor({ orientation, position, scale, fov, nearClip, superCopy, state, group }?: {
        orientation?: Quaternion;
        position?: Vector;
        scale?: number | Vector;
        fov?: number;
        nearClip?: number;
        superCopy?: Urbject;
        state?: number;
        group?: number;
    });
    copy(options?: {
        shallow: boolean;
    }): Camera;
    static copy(c: Camera, options?: {
        shallow: boolean;
    }): Camera;
}
declare abstract class Controller {
    type: number;
    static EMPTY: number;
    static DEFAULT_CAMERA: number;
    static FOCAL_POINT: number;
    constructor(type?: number);
    move(target: any): void;
}
declare class Interpolate {
    static EASE: number;
    static EASE_IN: number;
    static EASE_OUT: number;
    static LINEAR: number;
    static range(t: number, start: number, end: number, type?: number): number;
}
declare class DefaultCameraController extends Controller {
    minSpeed: number;
    maxSpeed: number;
    accelerationTime: number;
    accelerationType: number;
    controlFace: HTMLElement | Window;
    private u;
    private d;
    private l;
    private r;
    private f;
    private b;
    private x;
    private y;
    private dFov;
    private mousePressed;
    private speed;
    private startMove;
    private lastMove;
    constructor({ minSpeed, maxSpeed, accelerationTime, accelerationType, controlFace }?: {
        minSpeed?: number;
        maxSpeed?: number;
        accelerationTime?: number;
        accelerationType?: number;
        controlFace?: HTMLElement | Window;
    });
    move(camera: Camera): void;
    private getSpeed;
    mouseDown(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
    mouseMove(e: MouseEvent): void;
    wheel(e: WheelEvent): void;
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
}
declare class Stats {
    private statBox;
    private stats;
    private timer;
    private lastRead;
    private show;
    suspended: boolean;
    constructor({ show, suspendOnBlur }?: {
        show?: boolean;
        suspendOnBlur?: boolean;
    });
    private getStatBox;
    private addSleepListener;
    getStat(name: string): string | number;
    setStat(name: string, value: string | number, bias?: number, fractionDigits?: number): void;
    startTimer(): void;
    readTimer(): number;
    readCheckpoint(): number;
}
declare abstract class UrchinWorker {
    type: number;
    static SORTING: number;
    static LIGHTING: number;
    static PROJECTING: number;
    static RENDER: number;
    protected callback: any;
    protected working: boolean;
    protected worker: Worker;
    protected stats: Stats;
    private queue;
    constructor(type: number, showPerformance?: boolean);
    assign(assignment: any): void;
    protected getAssignment(): any;
    protected workOn(assignment: any): void;
    report(data: any): void;
}
declare class FrameInstance {
    fragments: List<Fragment>;
    lights: List<Light>;
    camera?: Camera;
    constructor(fragments: List<Fragment>, lights: List<Light>, camera?: Camera);
    copy(): FrameInstance;
    static copy(i: FrameInstance): FrameInstance;
}
declare class LightingWorker extends UrchinWorker {
    static DATA_SIZE: number;
    static FRAG_SIZE: number;
    constructor(callback?: (data: any) => void, showPerformance?: boolean);
    assign(assignment: FrameInstance): void;
    protected workOn(assignment: FrameInstance): void;
    report(data: {
        buffer: ArrayBuffer;
        msg?: string;
    }): void;
}
declare class Mesh {
    trigons: Array<Trigon>;
    constructor();
    rotateAxis(axis: number | Vector, angle: number): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    qRotate(q: Quaternion): this;
    quaternionRotate(q: Quaternion): this;
    translate(v: Vector): this;
    transform(M: Array<Array<number>>): this;
    scale(s: number | Vector): this;
    addTrigon(t: Trigon | Array<Trigon>): Trigon | Trigon[];
    generateFromArrayData(v: Array<number>): this;
    inverseNormals(): this;
    copy(): Mesh;
    static rotateAxis(m: Mesh, axis: number, angle: number): Mesh;
    static rotateX(m: Mesh, angle: number): Mesh;
    static rotateY(m: Mesh, angle: number): Mesh;
    static rotateZ(m: Mesh, angle: number): Mesh;
    static qRotate(m: Mesh, q: Quaternion): Mesh;
    static quaternionRotate(m: Mesh, q: Quaternion): Mesh;
    static translate(m: Mesh, v: Vector): Mesh;
    static transform(m: Mesh, M: Array<Array<number>>): Mesh;
    static scale(m: Mesh, s: number | Vector): Mesh;
    static addTrigon(m: Mesh, t: Trigon | Array<Trigon>): Mesh;
    static generateFromArrayData(v: Array<number>): Mesh;
    static inverseNormals(m: Mesh): Mesh;
    static copy(m: Mesh): Mesh;
    static plane(): Mesh;
    static cube(): Mesh;
    static circle(options?: {
        resolution?: number;
        radius?: number;
    }): Mesh;
    static cylinder(options?: {
        resolution?: number;
        outerRadius?: number;
        innerRadius?: number;
        height?: number;
    }): Mesh;
    static sphere(options?: {
        subdivisions?: number;
        radius?: number;
    }): Mesh;
    static uvSphere(options?: {
        resolution?: number;
        radius?: number;
    }): Mesh;
}
declare class DirectionalLight extends Urbject implements Light {
    brightness: number;
    color: Color;
    constructor({ direction, brightness, color, superCopy, state, group }?: {
        direction?: Vector;
        brightness?: number;
        color?: Color;
        superCopy?: Urbject;
        state?: number;
        group?: number;
    });
    getInstance(camera: Camera): FrameInstance;
    intensityOn(t: Trigon): number;
    copy(options?: {
        shallow: boolean;
    }): DirectionalLight;
    static getInstance(l: DirectionalLight, camera: Camera): FrameInstance;
    static intensityOn(l: DirectionalLight, t: Trigon): number;
    static copy(l: DirectionalLight, options?: {
        shallow: boolean;
    }): DirectionalLight;
}
declare class AmbientLight extends Urbject implements Light {
    brightness: number;
    color: Color;
    constructor({ brightness, color, superCopy, state, group }?: {
        brightness?: number;
        color?: Color;
        superCopy?: Urbject;
        state?: number;
        group?: number;
    });
    getInstance(camera: Camera): FrameInstance;
    intensityOn(t: Trigon): number;
    copy(options?: {
        shallow: boolean;
    }): AmbientLight;
    static getInstance(l: AmbientLight, camera: Camera): FrameInstance;
    static intensityOn(l: AmbientLight, t: Trigon): number;
    static copy(l: AmbientLight, options?: {
        shallow: boolean;
    }): AmbientLight;
}
declare class MeshUrbject extends Urbject {
    mesh: Mesh;
    material: Material;
    constructor({ position, orientation, scale, state, group, mesh, material, superCopy }?: {
        position?: Vector;
        orientation?: Quaternion;
        scale?: number | Vector;
        state?: number;
        group?: number;
        mesh?: Mesh;
        material?: Material;
        superCopy?: Urbject;
    });
    copy(options?: {
        shallow: boolean;
    }): MeshUrbject;
    getInstance(camera: Camera): FrameInstance;
    static getInstance(u: MeshUrbject, camera: Camera): FrameInstance;
    static copy(u: MeshUrbject, options?: {
        shallow: boolean;
    }): MeshUrbject;
}
declare class Scene {
    root: Urbject;
    constructor({ root }?: {
        root?: Urbject;
    });
    add(urbject: Urbject): Urbject;
    remove(urbject: Urbject): Urbject;
    copy(): Scene;
    static add(s: Scene, urbject: Urbject): Scene;
    static remove(s: Scene, urbject: Urbject): Scene;
    static copy(u: Scene): Scene;
}
declare class Renderer {
    static DRAW_HEADER_SIZE: number;
    static DRAW_FRAG_SIZE: number;
    backgroundColor: Color;
    protected canvas: HTMLCanvasElement;
    protected lastDraw: ArrayBuffer;
    protected ctx: CanvasRenderingContext2D;
    protected stats: Stats;
    protected superSampling: number;
    constructor({ canvas, fullscreen, superSampling, backgroundColor, showPerformance, suspendOnBlur }?: {
        canvas?: HTMLCanvasElement;
        fullscreen?: boolean;
        superSampling?: number;
        backgroundColor?: Color;
        showPerformance?: boolean;
        suspendOnBlur?: boolean;
    });
    render(scene: Scene, camera: Camera): void;
    resize(width?: number, height?: number): void;
    project(v: Vector, camera: Camera, superSamplePosition?: boolean): Vector;
    static draw(data: ArrayBuffer, ctx: CanvasRenderingContext2D | OffscreenRenderingContext2D): void;
    static light(frag: Fragment, lights: List<Light>): Material;
    static project(v: Vector, fov: number, w: number, h: number): Vector;
    static getCameraInstance(scene: Scene, camera: Camera): FrameInstance;
    static sortFragments(fragments: List<Fragment>): List<Fragment>;
}
declare class SortingWorker extends UrchinWorker {
    static DATA_SIZE: number;
    static FRAG_SIZE: number;
    constructor(callback?: (data: any) => void, showPerformance?: boolean);
    assign(assignment: List<Fragment>): void;
    protected workOn(assignment: List<Fragment>): void;
    report(data: {
        buffer: ArrayBuffer;
        msg?: string;
    }): void;
}
declare class ProjectingWorker extends UrchinWorker {
    static DATA_SIZE: number;
    static FRAG_SIZE: number;
    constructor(callback?: (data: any) => void, showPerformance?: boolean);
    assign(assignment: {
        instance: FrameInstance;
        width: number;
        height: number;
    }): void;
    protected workOn(assignment: {
        instance: FrameInstance;
        width: number;
        height: number;
    }): void;
    report(data: {
        buffer: ArrayBuffer;
        msg?: string;
    }): void;
}
declare class RenderWorker extends UrchinWorker {
    sync: () => void;
    constructor(canvas: HTMLCanvasElement, callback?: () => void, sync?: () => void, showPerformance?: boolean);
    resize(width: number, height: number): void;
    assign(assignment: ArrayBuffer): void;
    protected workOn(assignment: ArrayBuffer): void;
    report(data?: {
        msg?: string;
    }): void;
}
declare class PerformanceRenderer extends Renderer {
    private sortingWorker;
    private lightingWorker;
    private projectingWorker;
    private renderWorker;
    private instanceQueue;
    private preRendering;
    private drawing;
    private sortCache;
    private lightCache;
    private projectCache;
    private callbackCount;
    private width;
    private height;
    private lastFrameTime;
    private scene;
    private camera;
    private frameCallback;
    constructor({ canvas, fullscreen, superSampling, backgroundColor, showPerformance, offscreenDraw, frameCallback, suspendOnBlur }?: {
        canvas?: HTMLCanvasElement;
        fullscreen?: boolean;
        superSampling?: number;
        backgroundColor?: Color;
        showPerformance?: boolean;
        offscreenDraw?: boolean;
        frameCallback?: Function;
        suspendOnBlur?: boolean;
    });
    sortCallback(data: Float32Array): void;
    lightCallback(data: Float32Array): void;
    projectCallback(data: Float32Array): void;
    private renderSync;
    renderCallback(): void;
    private callbackCheck;
    render(scene: Scene, camera: Camera): void;
    start(scene: Scene, camera: Camera): void;
    stop(): void;
    private requestPreRender;
    resize(width?: number, height?: number): void;
    project(v: Vector, camera: Camera, superSamplePosition?: boolean): Vector;
    private draw;
    private buildDrawData;
}
declare class PointLight extends Urbject implements Light {
    radius: number;
    brightness: number;
    color: Color;
    constructor({ radius, position, brightness, color, superCopy, state, group }?: {
        radius?: number;
        position?: Vector;
        brightness?: number;
        color?: Color;
        superCopy?: Urbject;
        state?: number;
        group?: number;
    });
    getInstance(camera: Camera): FrameInstance;
    intensityOn(t: Trigon): number;
    copy(options?: {
        shallow: boolean;
    }): PointLight;
    static getInstance(l: PointLight, camera: Camera): FrameInstance;
    static intensityOn(l: PointLight, t: Trigon): number;
    static copy(l: PointLight, options?: {
        shallow: boolean;
    }): PointLight;
}
declare class FocalPointController extends Controller {
    controlFace: HTMLElement | Window;
    sensitivity: number;
    friction: number;
    zoomMultiplier: number;
    focalPoint: Vector;
    minDist: number;
    maxDist: number;
    private velocity;
    private dist;
    private dMouse;
    private mousePressed;
    private timer;
    constructor({ sensitivity, friction, zoomMultiplier, focalPoint, minDist, maxDist, controlFace }?: {
        sensitivity?: number;
        friction?: number;
        zoomMultiplier?: number;
        focalPoint?: Vector;
        minDist?: number;
        maxDist?: number;
        controlFace?: HTMLElement | Window;
    });
    move(camera: Camera): void;
    mouseDown(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
    mouseMove(e: MouseEvent): void;
    wheel(e: WheelEvent): void;
}
