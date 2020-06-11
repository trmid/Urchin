/// <reference path="./UrchinWorker.ts" />
/// <reference path="./FrameInstance.ts" />

class ProjectingWorker extends UrchinWorker {

    static DATA_SIZE = 6;
    /**
     * DATA SIZE = 6
     * x, y
     * x, y
     * x, y
     */
    static FRAG_SIZE = 9;
    /**
     * FRAG SIZE = 9
     * x, y, z
     * x, y, z
     * x, y, z
     */

    constructor(callback = function (data: any) { }, showPerformance = false) {
        super(UrchinWorker.PROJECTING, showPerformance);
        let w = this;
        this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        this.callback = callback;
    }

    assign(assignment: { instance: FrameInstance, width: number, height: number }) {
        super.assign(assignment);
        if (!this.working) {
            let assignment = this.getAssignment();
            assignment && this.workOn(assignment);
        }
    }

    protected workOn(assignment: { instance: FrameInstance, width: number, height: number }) {
        this.stats.startTimer();
        let frags = assignment.instance.fragments;
        var buffer = new ArrayBuffer(4 * frags.count * ProjectingWorker.FRAG_SIZE);
        let current = frags.head;
        for (let i = 0; i < frags.count && current; i++) {
            let fragView = new Float32Array(buffer, 4 * ProjectingWorker.FRAG_SIZE * i, ProjectingWorker.FRAG_SIZE);
            let t = current.data.trigon;
            let fragData = [
                t.v0.x, t.v0.y, t.v0.z,
                t.v1.x, t.v1.y, t.v1.z,
                t.v2.x, t.v2.y, t.v2.z
            ];
            for (let n = 0; n < fragData.length; n++) {
                fragView[n] = fragData[n];
            }
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, camera: assignment.instance.camera, width: assignment.width, height: assignment.height }, [buffer]);
        this.stats.setStat("Projecting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    }

    report(data: { buffer: ArrayBuffer, msg?: string }) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Projecting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    }
}