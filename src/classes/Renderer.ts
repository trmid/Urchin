/// <reference path="./Stats.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./Camera.ts" />
/// <reference path="./Trigon.ts" />

class Renderer {

    static DRAW_HEADER_SIZE = 6;
    static DRAW_FRAG_SIZE = 14;

    public canvas: HTMLCanvasElement;
    public backgroundColor: Color;
    protected lastDraw: ArrayBuffer;
    protected ctx: CanvasRenderingContext2D;
    protected stats: Stats;
    protected superSampling: number;

    constructor({
        canvas = document.querySelector("canvas") || (function a() {
            let canvas = document.createElement("canvas");
            canvas.width = 720;
            canvas.height = 480;
            document.body.append(canvas);
            return canvas;
        })(),
        fullscreen = false,
        superSampling = 1,
        backgroundColor = new Color("silver"),
        showPerformance = false
    }: {
        canvas?: HTMLCanvasElement,
        fullscreen?: boolean,
        superSampling?: number,
        backgroundColor?: Color,
        showPerformance?: boolean
    } = {}) {
        this.backgroundColor = backgroundColor;
        this.canvas = canvas;
        this.superSampling = superSampling;
        this.stats = new Stats({ show: showPerformance });
        if (fullscreen) {
            this.canvas.setAttribute("style", this.canvas.getAttribute("style") + ";position: fixed; width: 100%; height: 100%;");
            let renderer = this;
            window.addEventListener("resize", function () { renderer.resize(); });
            this.resize();
        } else if (this.superSampling != 1) {
            this.canvas.setAttribute("style", this.canvas.getAttribute("style") + `;width: ${this.canvas.width}px; height: ${this.canvas.height}px;`);
            this.canvas.width = this.canvas.width * this.superSampling;
            this.canvas.height = this.canvas.height * this.superSampling;
        }
    }

    render(scene: Scene, camera: Camera) {
        if (this.lastDraw) {
            let frameTime = this.stats.readTimer();
            let fps = 1000.0 / frameTime;
            this.stats.setStat("FPS", fps, 1.0 / 10, 0);
        }
        this.stats.startTimer();

        // GET INSTANCE
        let instance = Renderer.getCameraInstance(scene, camera);
        let lights = instance.lights;
        let frags = instance.fragments;
        camera = instance.camera;
        this.stats.setStat("Gathering Instance Data", this.stats.readCheckpoint(), 1.0 / 10, 3);

        // SORT FRAGMENTS
        frags = Renderer.sortFragments(frags);
        this.stats.setStat("Sorting Fragments", this.stats.readCheckpoint(), 1.0 / 10, 3);

        // INITIALIZE DRAW DATA BUFFER
        let data = new ArrayBuffer(4 * (Renderer.DRAW_HEADER_SIZE + Renderer.DRAW_FRAG_SIZE * frags.count));

        // SERIALIZE DRAW HEADER DATA
        let color = Color.toRGB(this.backgroundColor);
        let headerView = new Float32Array(data, 0, Renderer.DRAW_HEADER_SIZE);
        headerView[0] = color.r;
        headerView[1] = color.g;
        headerView[2] = color.b;
        headerView[3] = color.a;
        headerView[4] = this.canvas.width;
        headerView[5] = this.canvas.height;

        let node = frags.head, num = 0;
        while (node) {
            let frag = node.data;
            let t = Trigon.translate(frag.trigon, Vector.neg(camera.position));
            t.quaternionRotate(Quaternion.conjugate(camera.orientation)); // Rotate the point opposite of the camera's rotation

            // PROJECT
            let p0 = Renderer.project(t.v0, camera.fov, this.canvas.width, this.canvas.height);
            let p1 = Renderer.project(t.v1, camera.fov, this.canvas.width, this.canvas.height);
            let p2 = Renderer.project(t.v2, camera.fov, this.canvas.width, this.canvas.height);

            // LIGHT
            if (frag.material.lit) {
                let mat = Renderer.light(frag, lights);
                var fill = mat.fill;
                var wire = mat.wire;
            } else {
                var fill = Color.toRGB(frag.material.fill);
                var wire = Color.toRGB(frag.material.wire);
            }

            // SERIALIZE DRAW DATA
            let fragView = new Float32Array(data, 4 * (Renderer.DRAW_HEADER_SIZE + num * Renderer.DRAW_FRAG_SIZE), Renderer.DRAW_FRAG_SIZE);
            let fragData = [
                p0.x, p0.y,
                p1.x, p1.y,
                p2.x, p2.y,
                fill.r, fill.g, fill.b, fill.a,
                wire.r, wire.g, wire.b, wire.a
            ];
            for (let i = 0; i < fragView.length; i++) {
                fragView[i] = fragData[i];
            }

            // INCREMENT
            num++;
            node = node.nxt;
        }
        this.stats.setStat("Building Draw Data", this.stats.readCheckpoint(), 1.0 / 10, 3);

        // DRAW
        if (!this.ctx) this.ctx = this.canvas.getContext('2d');
        Renderer.draw(data, this.ctx);
        this.lastDraw = data;
        this.stats.setStat("Draw Time", this.stats.readCheckpoint(), 1.0 / 10, 3);

    }

    resize() {
        this.canvas.width = window.innerWidth * this.superSampling;
        this.canvas.height = window.innerHeight * this.superSampling;
        if (this.lastDraw && this.ctx) {
            Renderer.draw(this.lastDraw, this.ctx);
        }
    }

    project(v: Vector, camera: Camera, superSampling = false) {
        let w = this.canvas.width / (superSampling ? 1 : this.superSampling);
        let h = this.canvas.height / (superSampling ? 1 : this.superSampling);
        let worldPos = camera.getWorldTransform();
        return Renderer.project(v.sub(worldPos.position).quaternionRotate(worldPos.orientation.conjugate()), camera.fov, w, h);
    }

    static draw(data: ArrayBuffer, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        /**
         * TOTAL HEADER: 6 floats
         * (background color) r, g, b, a
         * (dimensions) w, h
         * 
         * TOTAL PER FRAGMENT: 14 floats
         * x, y
         * x, y
         * x, y
         * r, b, g, a
         * r, b, g, a
         */

        var headerData = new Float32Array(data, 0, Renderer.DRAW_HEADER_SIZE);
        ctx.save();
        if (headerData[3] > 0) {
            let fill = (new Color(headerData[0], headerData[1], headerData[2], headerData[3])).toString();
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.rect(0, 0, headerData[4], headerData[5]);
            ctx.fill();
        } else {
            ctx.clearRect(0, 0, headerData[4], headerData[5]);
        }
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        for (let i = Renderer.DRAW_HEADER_SIZE * 4; i < data.byteLength; i += Renderer.DRAW_FRAG_SIZE * 4) {
            var drawData = new Float32Array(data, i, Renderer.DRAW_FRAG_SIZE);
            var x0 = drawData[0], y0 = drawData[1];
            var x1 = drawData[2], y1 = drawData[3];
            var x2 = drawData[4], y2 = drawData[5];
            var fill = `rgba(${drawData[6]}, ${drawData[7]}, ${drawData[8]}, ${drawData[9]})`;
            var stroke = `rgba(${drawData[10]}, ${drawData[11]}, ${drawData[12]}, ${drawData[13]})`;
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }

    static light(frag: Fragment, lights: List<Light>) {
        let fill = Color.toRGB(frag.material.fill);
        let wire = Color.toRGB(frag.material.wire);
        let totalLight = new Color();
        let light = lights.head;
        while (light) {
            let intensity = light.data.intensityOn(frag.trigon);
            totalLight.add(Color.mult(light.data.color, intensity));
            light = light.nxt;
        }

        fill.applyLight(totalLight, 1);
        wire.applyLight(totalLight, 1);
        return new Material({ fill: fill, wire: wire });
    }

    static project(v: Vector, fov: number, w: number, h: number) {
        fov *= Math.PI * 2.0 / 360.0;
        let d = Math.sqrt(w * w + h * h);
        let wFov = fov * w / d;
        let hFov = fov * h / d;
        let diffXZ = new Vector(v.x, 0, v.z);
        let diffXY = new Vector(v.x, -v.y, 0);
        let angleY = diffXZ.angleBetween(Vector.axis(Vector.X_AXIS));
        let angleX = diffXY.angleBetween(Vector.axis(Vector.X_AXIS));
        let screenPos = new Vector((v.y < 0 ? 1 : -1) * angleX / (wFov / 2), (v.z < 0 ? 1 : -1) * angleY / (hFov / 2), 0);
        screenPos.mult(new Vector(w / 2, h / 2, 0));
        screenPos.add(new Vector(w / 2, h / 2, 0));
        return screenPos;
    }

    static getCameraInstance(scene: Scene, camera: Camera) {
        let worldCamera = <Camera>(camera.getWorldTransform());
        worldCamera.fov = camera.fov;
        camera = worldCamera;
        let instance = scene.root.getInstance(camera);
        let frags = new List<Fragment>();
        let cameraDir = Vector.axis(Vector.X_AXIS); // Direction the camera is facing (does not account for roll)
        let current = instance.fragments.head;
        while (current) {
            let t = Trigon.translate(current.data.trigon, Vector.neg(camera.position));
            let m0 = t.v0.mag(), m1 = t.v1.mag(), m2 = t.v2.mag();
            let far = m0 > m1 ? (m0 > m2 ? t.v0 : t.v2) : (m1 > m2 ? t.v1 : t.v2);
            let near = m0 < m1 ? (m0 < m2 ? t.v0 : t.v2) : (m1 < m2 ? t.v1 : t.v2);
            let center = t.getCenter();
            let diff = Vector.add(near, far).mult(0.5 * 0.95).add(Vector.mult(center, 0.05));
            let dist = diff.mag();
            let normal = t.getNormal();
            let facingAngle = Vector.angleBetween(center, normal);
            if (facingAngle > Math.PI / 2) {
                t.quaternionRotate(Quaternion.conjugate(camera.orientation)); // Rotate the point opposite of the camera's rotation
                let viewAngle = Math.min(Math.min(Vector.angleBetween(cameraDir, t.v0), Vector.angleBetween(cameraDir, t.v1)), Vector.angleBetween(cameraDir, t.v2));
                if (viewAngle <= (180 * Math.PI / 360)) {
                    frags.addLast(current.data, dist); // Add dist as priority so we don't have to calulate it during fragment sorting
                }
            }
            current = current.nxt;
        }
        return new FrameInstance(frags, instance.lights, camera);
    }

    static sortFragments(fragments: List<Fragment>) {
        const groups = new Array<Array<List<Fragment>>>();
        var minGroup = Urbject.DEFAULT_GROUP, maxGroup = Urbject.DEFAULT_GROUP;
        const min = fragments.minPriority;
        const max = fragments.maxPriority;
        const diff = max - min;
        var current = fragments.head;
        while (current) {
            let group = current.data.group;
            if (group < minGroup) minGroup = group;
            if (group > maxGroup) maxGroup = group;
            let bucketNum = diff ? Math.floor(fragments.count * (current.priority - min) / diff) : 0;
            if (!groups[group]) groups[group] = new Array<List<Fragment>>(fragments.count);
            let fragBuckets = groups[group];
            if (!fragBuckets[bucketNum]) fragBuckets[bucketNum] = new List<Fragment>();
            fragBuckets[bucketNum].addByPriority(current.data, current.priority);
            current = current.nxt;
        }

        const sortedFrags = new List<Fragment>();
        for (let g = maxGroup; g >= minGroup; g--) {
            let fragBuckets = groups[g];
            if (fragBuckets) {
                for (let i = 0; i < fragBuckets.length; i++) {
                    if (fragBuckets[i]) {
                        sortedFrags.linkFirst(fragBuckets[i]);
                    }
                }
            }
        }

        return sortedFrags;
    }
}