/// <reference path="./List.ts" />
/// <reference path="./Fragment.ts" />
/// <reference path="./Light.ts" />
/// <reference path="./Camera.ts" />

class FrameInstance {
    constructor(public fragments: List<Fragment>, public lights: List<Light>, public camera?: Camera) { }

    copy() {
        return new FrameInstance(this.fragments.copy(), this.lights.copy(), this.camera ? this.camera.copy({ shallow: true }) : undefined);
    }

    static copy(i: FrameInstance) {
        return i.copy();
    }
}