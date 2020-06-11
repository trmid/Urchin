/// <reference path="./Color.ts" />

class Material {
    public fill: Color;
    public wire: Color;
    public lit: boolean;

    constructor({
        fill = new Color(200, 200, 200, 1.0),
        wire = null,
        lit = true
    }: {
        fill?: Color,
        wire?: Color,
        lit?: boolean
    } = {}) {
        this.fill = fill;
        if (wire !== null) this.wire = wire;
        else this.wire = this.fill.copy();
        this.lit = lit;
    }

    setColor(c: Color) {
        this.fill = c;
        this.wire = c;
        return this;
    }

    setFill(c: Color) {
        this.fill = c;
        return this;
    }

    setWire(c: Color) {
        this.wire = c;
        return this;
    }

    copy() {
        let fill = this.fill.copy();
        let wire = this.wire.copy();
        return new Material({
            fill: fill,
            wire: wire,
            lit: this.lit
        });
    }

    static setColor(m: Material, c: Color) {
        return m.copy().setColor(c);
    }

    static setFill(m: Material, c: Color) {
        return m.copy().setFill(c);
    }

    static setWire(m: Material, c: Color) {
        return m.copy().setWire(c);
    }

    static copy(m: Material) {
        return new Material({
            fill: Color.copy(m.fill),
            wire: Color.copy(m.wire),
            lit: m.lit
        });
    }
}