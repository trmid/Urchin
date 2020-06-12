/// <reference path="./Num.ts" />

class Stats {
    private statBox: HTMLElement;
    private stats: { [key: string]: { elem: HTMLElement, value: string | number } };
    private timer: number;
    private lastRead: number;
    private show: boolean;
    suspended = false;

    constructor({
        show = false,
        suspendOnBlur = true
    }: {
        show?: boolean,
        suspendOnBlur?: boolean
    } = {}) {
        this.show = show;
        this.stats = {};
        this.getStatBox();
        if (suspendOnBlur) {
            this.addSleepListener();
        }
    }

    private getStatBox() {
        this.statBox = document.getElementById("statBox");
        if (!this.statBox) {
            this.statBox = document.createElement("table");
            this.statBox.setAttribute("id", "statBox");
            this.statBox.setAttribute("style", "position: fixed; top: 0; left: 0; overflow-y: auto; max-height: 100vh; color: lime; background-color: #2226; text-align: left; font-family: monospace;");
            document.body.append(this.statBox);
        }
    }

    private addSleepListener() {
        window.addEventListener('blur', (evt: Event) => {
            this.suspended = true;
        });
        window.addEventListener('focus', (evt: Event) => {
            this.suspended = false;
            let now = performance.now();
            this.timer = now;
            this.lastRead = now;
        });
    }

    getStat(name: string) {
        if (this.stats[name]) {
            return this.stats[name].value;
        } else {
            return undefined;
        }
    }

    setStat(name: string, value: string | number, bias = 1, fractionDigits = 3) {
        if (this.stats[name]) {
            let stat = this.stats[name];
            setTimeout(function () {
                if (typeof value === 'number' && typeof stat.value === 'number') {
                    bias = Num.constrain(bias, 0.0, 1.0);
                    stat.value = value * bias + stat.value * (1 - bias);
                    stat.elem.innerHTML = stat.value.toFixed(fractionDigits);
                } else {
                    stat.value = value;
                    stat.elem.innerHTML = "" + value;
                }
            }, 0);
        } else {
            this.stats[name] = { elem: document.createElement("td"), value: value };
            this.stats[name].elem.setAttribute("id", name);
            this.stats[name].elem.innerHTML = (typeof value === 'number' ? value.toFixed(fractionDigits) : value);
            let row = document.createElement("tr");
            if (!this.show) {
                row.setAttribute("style", "display: none;");
            }
            let head = document.createElement("td");
            head.innerHTML = name;
            row.append(head);
            row.append(this.stats[name].elem);
            this.statBox.append(row);
        }
    }

    startTimer() {
        this.timer = performance.now();
        this.lastRead = this.timer;
    }

    readTimer() {
        let now = performance.now();
        if (!this.timer) this.timer = now;
        this.lastRead = now;
        return this.lastRead - this.timer;
    }

    readCheckpoint() {
        let now = performance.now();
        if (!this.lastRead) this.lastRead = now;
        let time = now - this.lastRead;
        this.lastRead = now;
        return time;
    }

}