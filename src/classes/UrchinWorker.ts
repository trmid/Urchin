/// <reference path="./Stats.ts" />
/// <reference path="../Urchin.ts" />

abstract class UrchinWorker {

    static SORTING = 0;
    static LIGHTING = 1;
    static PROJECTING = 2;
    static RENDER = 3;

    protected callback: any;
    protected working = false;
    protected worker: Worker;
    protected stats: Stats;
    private queue: any;

    constructor(public type: number, showPerformance = false) {
        this.worker = new Worker(URCHIN_PATH, { name: "" + type });
        this.stats = new Stats({ show: showPerformance });
    }

    assign(assignment: any) {
        this.queue = assignment;
    }

    protected getAssignment() {
        if (this.queue) {
            let assignment = this.queue;
            this.queue = undefined;
            this.working = true;
            return assignment;
        }
        this.working = false;
        return null;
    }

    protected workOn(assignment: any) { }

    report(data: any) { }
}