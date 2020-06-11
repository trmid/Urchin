/// <reference path="./Num.ts" />

class Color {

    static RGBA = 0;
    static HSL = 1;
    type: number;
    r: number;
    g: number;
    b: number;
    a: number;
    h: number;
    s: number;
    l: number;

    constructor();
    constructor(color: string);
    constructor(hex: string);
    constructor(grayscale: number);
    constructor(grayscale: number, alpha: number);
    constructor(hue: number, saturation: number, lightness: number);
    constructor(red: number, green: number, blue: number, alpha: number);
    constructor(rhng?: number | string, gsa?: number, bl?: number, a?: number) {
        if (rhng === undefined) {
            // Defaults to black
            return new Color(0, 0, 0, 0);
        }
        if (typeof rhng === "string") {
            rhng = rhng.toUpperCase();
            if (rhng.charAt(0) == '#' && (rhng.length == 9 || rhng.length == 7 || rhng.length == 5 || rhng.length == 4)) {
                let isShort = (rhng.length == 4 || rhng.length == 5);
                let hasAlpha = (rhng.length == 9 || rhng.length == 5);
                var length = 2;
                var max = 255.0;
                if (isShort) {
                    length = 1;
                    max = 15.0;
                }
                let r = parseInt("0x" + rhng.substr(1, length)) / max * 255;
                let g = parseInt("0x" + rhng.substr(1 + length, length)) / max * 255;
                let b = parseInt("0x" + rhng.substr(1 + length * 2, length)) / max * 255;
                let a = (hasAlpha ? parseInt("0x" + rhng.substr(1 + length * 3, length)) / max : 1.0);
                return new Color(r, g, b, a);
            }
            switch (rhng) {
                case "WHITE":
                    return new Color(255);
                case "SILVER":
                    return new Color(192);
                case "GRAY":
                    return new Color(128);
                case "BLACK":
                    return new Color(0);
                case "RED":
                    return new Color(255, 0, 0, 1.0);
                case "MAROON":
                    return new Color(128, 0, 0, 1.0);
                case "YELLOW":
                    return new Color(255, 255, 0, 1.0);
                case "OLIVE":
                    return new Color(128, 128, 0, 1.0);
                case "LIME":
                    return new Color(0, 255, 0, 1.0);
                case "GREEN":
                    return new Color(0, 128, 0, 1.0);
                case "AQUA":
                    return new Color(0, 255, 255, 1.0);
                case "TEAL":
                    return new Color(0, 128, 128, 1.0);
                case "BLUE":
                    return new Color(0, 0, 255, 1.0);
                case "NAVY":
                    return new Color(0, 0, 128, 1.0);
                case "FUCHSIA":
                    return new Color(255, 0, 255, 1.0);
                case "PURPLE":
                    return new Color(128, 0, 128, 1.0);
                default:
                    return new Color("LIME");
            }
        }
        if (a !== undefined) {
            this.type = Color.RGBA;
            this.r = Num.constrain(Math.floor(rhng), 0, 255);
            this.g = Num.constrain(Math.floor(gsa), 0, 255);
            this.b = Num.constrain(Math.floor(bl), 0, 255);
            this.a = Num.constrain(a, 0.0, 1.0);
        } else if (bl !== undefined) {
            this.type = Color.HSL;
            this.h = Num.constrain(Math.floor(rhng), 0, 360);
            this.s = Num.constrain(Math.floor(gsa), 0, 100);
            this.l = Num.constrain(Math.floor(bl), 0, 100);
        } else {
            if (gsa === undefined) gsa = 1.0;
            this.type = Color.RGBA;
            this.r = rhng;
            this.g = rhng;
            this.b = rhng;
            this.a = gsa;
        }
    }

    toString() {
        if (this.type == Color.RGBA) {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        } else if (this.type == Color.HSL) {
            return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
        } else {
            return "Color is not a valid type.";
        }
    }

    copy() {
        if (this.type == Color.RGBA) {
            return new Color(this.r, this.g, this.b, this.a);
        } else {
            return new Color(this.h, this.s, this.l);
        }
    }

    applyLight(color: Color, intensity: number) {
        if (this.type != Color.RGBA) {
            console.error("Could not apply light to non-rgb color.");
            return this;
        }
        intensity = (intensity < 0 ? 0 : intensity);
        this.r = Num.constrain(Math.floor(this.r * (color.r / 255.0) * intensity), 0, 255);
        this.g = Num.constrain(Math.floor(this.g * (color.g / 255.0) * intensity), 0, 255);
        this.b = Num.constrain(Math.floor(this.b * (color.b / 255.0) * intensity), 0, 255);
        return this;
    }

    toRGB() {
        if (this.type == Color.RGBA) return this;
        if (this.s == 0) return new Color(this.l * 255 / 100.0);
        let hue = Num.constrain(this.h / 360.0, 0, 1);
        let l = Num.constrain(this.l / 100.0, 0, 1);
        let s = Num.constrain(this.s / 100.0, 0, 1);
        var temp1 = (l < 0.5 ? l * (1 + s) : l + s - (l * s));
        var temp2 = 2 * l - temp1;
        let hueSplit = function (h: number) {
            h = (h < 0 ? h + 1 : (h > 1 ? h - 1 : h));
            let val = h;
            if (6 * val < 1) return temp2 + (temp1 - temp2) * 6 * val;
            else if (2 * val <= 1) return temp1;
            else if (3 * val < 2) return temp2 + (temp1 - temp2) * ((2.0 / 3.0) - val) * 6;
            else return temp2;
        }
        let r = hueSplit(hue + (1.0 / 3.0)) * 255.0;
        let g = hueSplit(hue) * 255.0;
        let b = hueSplit(hue - (1.0 / 3.0)) * 255.0;
        return new Color(r, g, b, 1.0);
    }

    add(color: Color) {
        if (this.type != Color.RGBA) {
            console.error("Could not add to non-RGB color.");
            return this;
        }
        if (color.type != Color.RGBA) {
            color = color.toRGB();
        }
        this.r = Num.constrain(this.r + color.r, 0, 255);
        this.g = Num.constrain(this.g + color.g, 0, 255);
        this.b = Num.constrain(this.b + color.b, 0, 255);
        this.a = Num.constrain(this.a + color.a, 0, 1);
        return this;
    }

    mult(intensity: number) {
        if (this.type != Color.RGBA) {
            console.log("Could not mult non-RGB color.");
        }
        this.r = Num.constrain(Math.floor(this.r * intensity), 0, 255);
        this.g = Num.constrain(Math.floor(this.g * intensity), 0, 255);
        this.b = Num.constrain(Math.floor(this.b * intensity), 0, 255);
        return this;
    }

    static copy(c: Color) {
        switch (c.type) {
            case Color.RGBA: return new Color(c.r, c.g, c.b, c.a);
            case Color.HSL: return new Color(c.h, c.s, c.l);
        }
        return c;
    }

    static toString(c: Color) {
        return c.toString();
    }

    static toRGB(c: Color) {
        return c.copy().toRGB();
    }

    static add(c0: Color, c1: Color) {
        return c0.copy().add(c1);
    }

    static applyLight(c: Color, l: Color, i: number) {
        return c.copy().applyLight(l, i);
    }

    static mult(c0: Color, i: number) {
        return c0.copy().mult(i);
    }
}