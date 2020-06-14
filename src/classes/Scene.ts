/// <reference path="./Urbject.ts" />

class Scene {

    public root: Urbject;

    constructor({
        root = new Urbject()
    }: {
        root?: Urbject
    } = {}) {
        this.root = root;
    }

    add(urbject: Urbject) {
        return this.root.addChild(urbject);
    }

    remove(urbject: Urbject) {
        return this.root.removeChild(urbject);
    }

    copy() {
        return new Scene({ root: this.root.copy() });
    }

    static add(s: Scene, urbject: Urbject) {
        let scene = s.copy();
        scene.add(urbject);
        return scene;
    }

    static remove(s: Scene, urbject: Urbject) {
        let scene = s.copy();
        scene.remove(urbject);
        return scene;
    }

    static copy(u: Scene) {
        return new Scene({
            root: Urbject.copy(u.root)
        });
    }
}