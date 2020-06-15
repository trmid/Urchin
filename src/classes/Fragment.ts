/// <reference path="./Trigon.ts" />
/// <reference path="./Material.ts" />

class Fragment {

    constructor(public trigon: Trigon, public material: Material, public group: number) { }

    copy() {
        return new Fragment(this.trigon.copy(), this.material.copy(), this.group);
    }

    static copy(f: Fragment) {
        return new Fragment(Trigon.copy(f.trigon), Material.copy(f.material), f.group);
    }

}