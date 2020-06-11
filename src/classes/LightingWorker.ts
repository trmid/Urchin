/// <reference path="./UrchinWorker.ts" />
/// <reference path="./FrameInstance.ts" />
/// <reference path="./Color.ts" />

class LightingWorker extends UrchinWorker {

    static DATA_SIZE = 8;
    /**
     * DATA SIZE = 8
     * r, g, b, a
     * r, g, b, a
     */
    static FRAG_SIZE = 18;
    /**
     * FRAG SIZE = 18;
     * x, y, z
     * x, y, z
     * x, y, z
     * r, g, b, a
     * r, g, b, a
     * lit?
     */

    constructor(callback = function (data: any) { }, showPerformance = false) {
        super(UrchinWorker.LIGHTING, showPerformance);
        let w = this;
        this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        this.callback = callback;
    }

    assign(assignment: FrameInstance) {
        super.assign(assignment);
        if (!this.working) {
            let assignment = this.getAssignment();
            assignment && this.workOn(assignment);
        }
    }

    protected workOn(assignment: FrameInstance) {
        this.stats.startTimer();
        let frags = assignment.fragments;
        var buffer = new ArrayBuffer(4 * frags.count * LightingWorker.FRAG_SIZE);
        let current = frags.head;
        for (let i = 0; i < frags.count && current; i++) {
            let fragView = new Float32Array(buffer, 4 * LightingWorker.FRAG_SIZE * i, LightingWorker.FRAG_SIZE);
            let t = current.data.trigon;
            let f = Color.toRGB(current.data.material.fill);
            let w = Color.toRGB(current.data.material.wire);
            let fragData = [
                t.v0.x, t.v0.y, t.v0.z,
                t.v1.x, t.v1.y, t.v1.z,
                t.v2.x, t.v2.y, t.v2.z,
                f.r, f.g, f.b, f.a,
                w.r, w.g, w.b, w.a,
                current.data.material.lit ? 1 : 0
            ];
            for (let n = 0; n < fragData.length; n++) {
                fragView[n] = fragData[n];
            }
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, lights: assignment.lights }, [buffer]);
        this.stats.setStat("Lighting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    }

    report(data: { buffer: ArrayBuffer, msg?: string }) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Lighting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    }
}