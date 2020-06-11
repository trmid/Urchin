/// <reference path="./UrchinWorker.ts" />
/// <reference path="./Urbject.ts" />

class SortingWorker extends UrchinWorker {

    static DATA_SIZE = 1;
    /**
     * DATA SIZE = 1
     * index
     */
    static FRAG_SIZE = 3;
    /**
     * FRAGMENT SIZE = 3
     * index, dist, group
     */

    constructor(callback = function (data: any) { }, showPerformance = false) {
        super(UrchinWorker.SORTING, showPerformance);
        let w = this;
        this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        this.callback = callback;
    }

    assign(assignment: List<Fragment>) {
        super.assign(assignment);
        if (!this.working) {
            let assignment = this.getAssignment();
            assignment && this.workOn(assignment);
        }
    }

    protected workOn(assignment: List<Fragment>) {
        this.stats.startTimer();
        var buffer = new ArrayBuffer(assignment.count * SortingWorker.FRAG_SIZE * 4);
        var bufferView = new Float32Array(buffer);
        let extremes = new Array<{ min: number, max: number }>();
        let minGroup = Urbject.DEFAULT_GROUP, maxGroup = Urbject.DEFAULT_GROUP;
        let current = assignment.head;
        for (let i = 0; i < assignment.count && current; i++) {
            let dist = current.priority;
            let group = current.data.group;
            if (group < minGroup) minGroup = group;
            if (group > maxGroup) maxGroup = group;
            if (!extremes[group]) extremes[group] = { min: dist, max: dist };
            if (group < extremes[group].min) extremes[group].min = group;
            if (group > extremes[group].max) extremes[group].max = group;
            bufferView[i * SortingWorker.FRAG_SIZE] = i;
            bufferView[i * SortingWorker.FRAG_SIZE + 1] = dist;
            bufferView[i * SortingWorker.FRAG_SIZE + 2] = group;
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, extremes: extremes, minGroup: minGroup, maxGroup: maxGroup }, [buffer]);
        this.stats.setStat("Sorting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    }

    report(data: { buffer: ArrayBuffer, msg?: string }) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Sorting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    }
}