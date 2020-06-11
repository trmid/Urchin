/// <reference path="./UrchinWorker.ts" />

class RenderWorker extends UrchinWorker {

    sync = function () { };

    constructor(canvas: HTMLCanvasElement, callback = function () { }, sync = function () { }, showPerformance = false) {
        super(UrchinWorker.RENDER, showPerformance);
        let w = this;
        this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        this.callback = callback;
        this.sync = sync;
        let offscreen = canvas.transferControlToOffscreen();
        this.worker.postMessage({ canvas: offscreen }, [offscreen]);
    }

    resize(width: number, height: number) {
        this.worker.postMessage({ dimensions: { width: width, height: height } });
    }

    assign(assignment: ArrayBuffer) {
        super.assign(assignment);
        if (!this.working) {
            let assignment = this.getAssignment();
            assignment && this.workOn(assignment);
        }
    }

    protected workOn(assignment: ArrayBuffer) {
        this.stats.startTimer();
        this.worker.postMessage({ buffer: assignment }, [assignment]);
        this.stats.setStat("Render Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
        this.sync();
    }

    report(data?: { msg?: string }) {
        this.working = false;
        this.stats.setStat("Render Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback();
        // Check for new assignment
        let assignment = this.getAssignment();
        assignment && this.workOn(assignment);
    }
}