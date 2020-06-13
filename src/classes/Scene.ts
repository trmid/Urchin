/// <reference path="./Urbject.ts" />

class Scene {

    public root: Urbject;

    constructor({
        urbject = new Urbject()
    }: {
        urbject?: Urbject
    } = {}) {
        this.root = urbject;
    }

    add(urbject: Urbject) {
        return this.root.addChild(urbject);
    }

    remove(urbject: Urbject) {
        return this.root.removeChild(urbject);
    }

    copy() {
        return new Scene({ urbject: this.root.copy() });
    }

    static copy(u: Scene) {
        return new Scene({
            urbject: Urbject.copy(u.root)
        });
    }
}