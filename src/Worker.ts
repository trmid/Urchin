if (typeof window === 'undefined') {
    switch (self.name) {
        case "" + UrchinWorker.RENDER:
            let workerCanvas: OffscreenCanvas, workerCtx: OffscreenCanvasRenderingContext2D, buffer: ArrayBuffer;
            self.addEventListener('message', (evt) => {
                if (typeof evt.data.canvas !== "undefined") {
                    console.log("Initializing Urchin Render Worker...");
                    workerCanvas = evt.data.canvas;
                    workerCtx = workerCanvas.getContext('2d');
                    return;
                }
                if (typeof evt.data.dimensions !== 'undefined') {
                    workerCanvas.width = evt.data.dimensions.width;
                    workerCanvas.height = evt.data.dimensions.height;
                    return;
                }
                if (typeof evt.data.buffer !== "undefined") {
                    Renderer.draw(evt.data.buffer, workerCtx);
                    self.postMessage({}, undefined);
                    return;
                }
            });
            break;
        case "" + UrchinWorker.SORTING:
            self.addEventListener('message', (evt) => {
                let buffer = evt.data.buffer,
                    extremes = evt.data.extremes,
                    minGroup = evt.data.minGroup,
                    maxGroup = evt.data.maxGroup;
                let view = new Float32Array(buffer);
                let count = view.length / SortingWorker.FRAG_SIZE;
                let groups = new Array<Array<List<number>>>();
                for (let i = 0; i < count; i++) {
                    let frag_i = i * SortingWorker.FRAG_SIZE;
                    let group = view[frag_i + 2];
                    let diff = extremes[group].max - extremes[group].min;
                    let bucketNum = diff ? Math.floor((count - 1) * Num.constrain(1 - ((view[frag_i + 1] - extremes[group].min) / diff), 0, 1)) : 0;
                    if (!groups[group]) {
                        groups[group] = new Array<List<number>>();
                    }
                    let fragBuckets = groups[group];
                    if (!fragBuckets[bucketNum]) {
                        fragBuckets[bucketNum] = new List<number>();
                    }
                    fragBuckets[bucketNum].addByPriority(view[frag_i], view[frag_i + 1]);
                }

                let sortedBuffer = new ArrayBuffer(count * 4);
                let sortedView = new Float32Array(sortedBuffer);
                let num = 0;
                for (let i = minGroup; i <= maxGroup; i++) {
                    if (groups[i]) {
                        let fragBuckets = groups[i];
                        for (let b = 0; b < fragBuckets.length; b++) {
                            if (fragBuckets[b]) {
                                let current = fragBuckets[b].head;
                                while (current) {
                                    sortedView[num] = current.data;
                                    num++;
                                    current = current.nxt;
                                }
                            }
                        }
                    }
                }

                self.postMessage({ buffer: sortedBuffer }, undefined, [sortedBuffer]);
                return;
            });
            break;
        case "" + UrchinWorker.LIGHTING:
            self.addEventListener('message', (evt) => {
                let buffer = evt.data.buffer,
                    lightObj = evt.data.lights;
                let lights = new List<Light>();
                let current = lightObj.head;
                while (current) {
                    let light = Urbject.copy(current.data, { shallow: true, typeCheck: true });
                    lights.addFirst(light);
                    current = current.nxt;
                }
                let view = new Float32Array(buffer);
                let litBuffer = new ArrayBuffer(4 * view.length * LightingWorker.DATA_SIZE / LightingWorker.FRAG_SIZE);
                let litView = new Float32Array(litBuffer);
                for (let i = 0; i < view.length / LightingWorker.FRAG_SIZE; i++) {

                    let frag_i = i * LightingWorker.FRAG_SIZE,
                        data_i = i * LightingWorker.DATA_SIZE;
                    let f_r = view[frag_i + 9], f_g = view[frag_i + 10], f_b = view[frag_i + 11], f_a = view[frag_i + 12],
                        w_r = view[frag_i + 13], w_g = view[frag_i + 14], w_b = view[frag_i + 15], w_a = view[frag_i + 16],
                        lit = view[frag_i + 17] > 0 ? true : false;

                    if (lit) {
                        let v0 = new Vector(view[frag_i + 0], view[frag_i + 1], view[frag_i + 2]),
                            v1 = new Vector(view[frag_i + 3], view[frag_i + 4], view[frag_i + 5]),
                            v2 = new Vector(view[frag_i + 6], view[frag_i + 7], view[frag_i + 8]);
                        let t = new Trigon(v0, v1, v2);
                        let mat = new Material({
                            fill: new Color(f_r, f_g, f_b, f_a),
                            wire: new Color(w_r, w_g, w_b, w_a),
                            lit: lit
                        });
                        let frag = new Fragment(t, mat, 0);
                        let litMat = Renderer.light(frag, lights);
                        let fragData = [
                            litMat.fill.r, litMat.fill.g, litMat.fill.b, litMat.fill.a,
                            litMat.wire.r, litMat.wire.g, litMat.wire.b, litMat.wire.a
                        ];
                        // Return lit colors
                        for (let n = 0; n < LightingWorker.DATA_SIZE; n++) {
                            litView[data_i + n] = fragData[n];
                        }
                    } else {
                        // Return original colors
                        for (let n = 0; n < LightingWorker.DATA_SIZE; n++) {
                            litView[data_i + n] = view[frag_i + 9 + n];
                        }
                    }
                }
                self.postMessage({ buffer: litBuffer }, undefined, [litBuffer]);
                return;
            });
            break;
        case "" + UrchinWorker.PROJECTING:
            self.addEventListener('message', (evt) => {
                let buffer = evt.data.buffer,
                    camera = Camera.copy(evt.data.camera),
                    width = evt.data.width,
                    height = evt.data.height;
                let view = new Float32Array(buffer);
                let projected = new ArrayBuffer(4 * view.length * 2 / 3);
                let projectedView = new Float32Array(projected);
                for (let i = 0; i < view.length / 3; i++) {
                    let v = (new Vector(view[i * 3], view[i * 3 + 1], view[i * 3 + 2])).add(Vector.neg(camera.position));
                    v.quaternionRotate(Quaternion.conjugate(camera.orientation));
                    let screenPos = Renderer.project(v, camera.fov, width, height);
                    projectedView[i * 2] = screenPos.x;
                    projectedView[i * 2 + 1] = screenPos.y;
                }
                self.postMessage({ buffer: projected }, undefined, [projected]);
                return;
            });
            break;
        default:
            console.error(`Worker type, "${self.name}", is not a valid type.`);
            break;
    }
}