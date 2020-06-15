/// <reference path="./Renderer.ts" />
/// <reference path="./SortingWorker.ts" />
/// <reference path="./LightingWorker.ts" />
/// <reference path="./ProjectingWorker.ts" />
/// <reference path="./RenderWorker.ts" />

class PerformanceRenderer extends Renderer {

    private sortingWorker: SortingWorker;
    private lightingWorker: LightingWorker;
    private projectingWorker: ProjectingWorker;
    private renderWorker: RenderWorker;
    private instanceQueue: FrameInstance;
    private preRendering = false;
    private drawing = false;
    private sortCache: Float32Array;
    private lightCache: Float32Array;
    private projectCache: Float32Array;
    private callbackCount = 0;
    private width: number;
    private height: number;
    private lastFrameTime: number;
    private scene: Scene;
    private camera: Camera;
    private frameCallback: Function;

    constructor({
        canvas,
        fullscreen = false,
        superSampling,
        backgroundColor,
        showPerformance,
        offscreenDraw = true,
        frameCallback
    }: {
        canvas?: HTMLCanvasElement,
        fullscreen?: boolean,
        superSampling?: number,
        backgroundColor?: Color,
        showPerformance?: boolean,
        offscreenDraw?: boolean,
        frameCallback?: Function
    } = {}) {
        super({ canvas: canvas, fullscreen: false, backgroundColor: backgroundColor, showPerformance: showPerformance, superSampling: superSampling });
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        if (fullscreen) {
            this.canvas.setAttribute("style", this.canvas.getAttribute("style") + ";position: fixed; width: 100%; height: 100%;");
            let renderer = this;
            window.addEventListener("resize", function () { renderer.resize(); });
            this.resize();
        }
        var p = this;
        if (offscreenDraw && this.canvas.transferControlToOffscreen) {
            this.renderWorker = new RenderWorker(this.canvas, function () { p.renderCallback() }, function () { p.renderSync() }, showPerformance);
        } else {
            this.ctx = this.canvas.getContext('2d');
        }
        this.sortingWorker = new SortingWorker(function (data) { p.sortCallback(data) }, showPerformance);
        this.lightingWorker = new LightingWorker(function (data) { p.lightCallback(data) }, showPerformance);
        this.projectingWorker = new ProjectingWorker(function (data) { p.projectCallback(data) }, showPerformance);
        this.frameCallback = frameCallback;
    }

    sortCallback(data: Float32Array) {
        this.sortCache = data;
        this.callbackCheck();
    }

    lightCallback(data: Float32Array) {
        this.lightCache = data;
        this.callbackCheck();
    }

    projectCallback(data: Float32Array) {
        this.projectCache = data;
        this.callbackCheck();
    }

    private renderSync() {
        if (!this.preRendering) {
            setTimeout(function (renderer: PerformanceRenderer) {
                if (renderer.scene && renderer.camera) {
                    let instance = Renderer.getCameraInstance(renderer.scene, renderer.camera);
                    renderer.requestPreRender(instance);
                }
            }, 0, this);
        }
    }

    renderCallback() {
        this.drawing = false;
        if (this.lastFrameTime) {
            let frameTime = performance.now() - this.lastFrameTime;
            let fps = 1000.0 / frameTime;
            this.stats.setStat("FPS", fps, 1.0 / 10, 0);
        }
        this.lastFrameTime = performance.now();
        if (this.frameCallback) {
            setTimeout(this.frameCallback, 0);
        }
    }

    private callbackCheck() {
        this.callbackCount++;
        if (this.callbackCount == 3) {
            this.preRendering = false;
            this.callbackCount = 0;
            setTimeout(function (renderer: PerformanceRenderer, s: Float32Array, p: Float32Array, l: Float32Array) {
                let data = renderer.buildDrawData(s, p, l);
                setTimeout(function () {
                    renderer.draw(data);
                }, 0);
            }, 0, this, this.sortCache, this.projectCache, this.lightCache);
        }
    }

    render(scene: Scene, camera: Camera) {
        // GET INSTANCE
        let instance = Renderer.getCameraInstance(scene, camera);

        // SORT, LIGHT, and PROJECT SIMULTANEOUSLY
        this.requestPreRender(instance);
    }

    start(scene: Scene, camera: Camera) {
        // STORE RENDER REQUEST
        this.scene = scene;
        this.camera = camera;

        // GET INSTANCE
        let instance = Renderer.getCameraInstance(scene, camera);

        // SORT, LIGHT, and PROJECT SIMULTANEOUSLY
        this.requestPreRender(instance);
    }

    stop() {
        this.scene = undefined;
        this.camera = undefined;
    }

    private requestPreRender(instance = this.instanceQueue) {
        if (!this.preRendering && instance) {
            this.preRendering = true;
            this.sortingWorker.assign(instance.fragments);
            this.lightingWorker.assign(instance);
            this.projectingWorker.assign({ instance: instance, width: this.width, height: this.height });
        } else {
            this.instanceQueue = instance;
        }
    }

    resize(width = window.innerWidth, height = window.innerHeight) {
        this.width = width * this.superSampling;
        this.height = height * this.superSampling;
        if (this.renderWorker) {
            this.renderWorker.resize(this.width, this.height);
        } else {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        if (this.lastDraw && !this.drawing) {
            this.draw(this.lastDraw);
        }
    }

    project(v: Vector, camera: Camera, superSamplePosition = false) {
        let w = this.width / (superSamplePosition ? 1 : this.superSampling);
        let h = this.height / (superSamplePosition ? 1 : this.superSampling);
        let worldPos = camera.getWorldTransform();
        return Renderer.project(v.sub(worldPos.position).quaternionRotate(worldPos.orientation.conjugate()), camera.fov, w, h);
    }

    private draw(data: ArrayBuffer) {
        this.drawing = true;
        if (this.renderWorker) {
            this.renderWorker.assign(data);
        } else {
            this.renderSync();
            this.stats.startTimer();
            Renderer.draw(data, this.ctx);
            this.stats.setStat("Draw Time", this.stats.readTimer(), 1.0 / 10, 3);
            this.renderCallback();
        }
    }

    private buildDrawData(s: Float32Array, p: Float32Array, l: Float32Array) {
        this.stats.startTimer();
        let buffer = new ArrayBuffer(4 * (Renderer.DRAW_HEADER_SIZE + Renderer.DRAW_FRAG_SIZE * s.length));
        let headerView = new Float32Array(buffer, 0, Renderer.DRAW_HEADER_SIZE);
        let color = Color.toRGB(this.backgroundColor);
        headerView[0] = color.r;
        headerView[1] = color.g;
        headerView[2] = color.b;
        headerView[3] = color.a;
        headerView[4] = this.width;
        headerView[5] = this.height;

        for (let i = 0; i < s.length; i++) {
            let fragView = new Float32Array(buffer, 4 * (Renderer.DRAW_HEADER_SIZE + i * Renderer.DRAW_FRAG_SIZE), Renderer.DRAW_FRAG_SIZE);
            let p_i = s[i] * ProjectingWorker.DATA_SIZE;
            let l_i = s[i] * LightingWorker.DATA_SIZE;
            let fragData = [
                p[p_i + 0], p[p_i + 1],
                p[p_i + 2], p[p_i + 3],
                p[p_i + 4], p[p_i + 5],
                l[l_i + 0], l[l_i + 1], l[l_i + 2], l[l_i + 3],
                l[l_i + 4], l[l_i + 5], l[l_i + 6], l[l_i + 7]
            ];
            for (let n = 0; n < fragView.length; n++) {
                fragView[n] = fragData[n];
            }
        }
        this.stats.setStat("Building Draw Data", this.stats.readTimer(), 1.0 / 10, 3);
        return buffer;
    }

}