/// <reference path="./Trigon.ts" />
/// <reference path="./Material.ts" />

class Fragment {

    /**
     * A render-level object used to store each triangle to be rendered from an Urbject with the reference to it's material
     * @param trigon The triangle that will be rendered
     * @param material The material that will be used to render the trigon
     */

    constructor(public trigon: Trigon, public material: Material, public group: number) { }

    copy() {
        return new Fragment(this.trigon.copy(), this.material.copy(), this.group);
    }

    static copy(f: Fragment) {
        return new Fragment(Trigon.copy(f.trigon), Material.copy(f.material), f.group);
    }

}