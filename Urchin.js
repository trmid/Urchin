/*! Description: Urchin is a light-weight 3D renderer for realtime rendering in browser applications with the use of Canvas 2D.
 * Author: Trevor Richard
 * Version: 0.1
 * License: MIT
 */
var URCHIN_PATH = "/Urchin/Urchin.js";
var Vector = (function () {
    function Vector(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector.prototype.copy = function () {
        return new Vector(this.x, this.y, this.z);
    };
    Vector.prototype.mag = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector.prototype.add = function (a) {
        switch (typeof a) {
            case "number":
                this.x += a;
                this.y += a;
                this.z += a;
                return this;
            case "object":
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    };
    Vector.prototype.addX = function (a) {
        this.x += a;
        return this;
    };
    Vector.prototype.addY = function (a) {
        this.y += a;
        return this;
    };
    Vector.prototype.addZ = function (a) {
        this.z += a;
        return this;
    };
    Vector.prototype.sub = function (a) {
        switch (typeof a) {
            case "number":
                this.x -= a;
                this.y -= a;
                this.z -= a;
                return this;
            case "object":
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    };
    Vector.prototype.subX = function (a) {
        this.x -= a;
        return this;
    };
    Vector.prototype.subY = function (a) {
        this.y -= a;
        return this;
    };
    Vector.prototype.subZ = function (a) {
        this.z -= a;
        return this;
    };
    Vector.prototype.div = function (a) {
        switch (typeof a) {
            case "number":
                if (a == 0) {
                    console.error("Can't divide by zero.");
                    return this;
                }
                this.x /= a;
                this.y /= a;
                this.z /= a;
                return this;
            case "object":
                if (a.x == 0 || a.y == 0 || a.z == 0) {
                    console.error("Can't divide by zero.");
                    return this;
                }
                this.x /= a.x;
                this.y /= a.y;
                this.z /= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return this;
        }
    };
    Vector.prototype.divX = function (a) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.x /= a;
        return this;
    };
    Vector.prototype.divY = function (a) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.y /= a;
        return this;
    };
    Vector.prototype.divZ = function (a) {
        if (a == 0) {
            console.error("Can't divide by zero.");
            return;
        }
        this.z /= a;
        return this;
    };
    Vector.prototype.normalize = function () {
        var mag = this.mag();
        if (mag == 0) {
            return this;
        }
        return this.div(mag);
    };
    Vector.prototype.mult = function (a) {
        switch (typeof a) {
            case "number":
                this.x *= a;
                this.y *= a;
                this.z *= a;
                return this;
            case "object":
                this.x *= a.x;
                this.y *= a.y;
                this.z *= a.z;
                return this;
            default:
                console.error("Expected number or Vector, got " + (typeof a) + ".");
                return;
        }
    };
    Vector.prototype.multX = function (a) {
        this.x *= a;
        return this;
    };
    Vector.prototype.multY = function (a) {
        this.y *= a;
        return this;
    };
    Vector.prototype.multZ = function (a) {
        this.z *= a;
        return this;
    };
    Vector.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    Vector.prototype.cross = function (v) {
        var c = new Vector(this.y * v.z - this.z * v.y, -(this.x * v.z - this.z * v.x), this.x * v.y - this.y * v.x);
        this.x = c.x;
        this.y = c.y;
        this.z = c.z;
        return this;
    };
    Vector.prototype.dot = function (v) {
        return (this.x * v.x + this.y * v.y + this.z * v.z);
    };
    Vector.prototype.qRotate = function (q) {
        return this.quaternionRotate(q);
    };
    Vector.prototype.quaternionRotate = function (q) {
        q = q.normalize();
        var p = new Quaternion(0, this.x, this.y, this.z);
        var c = Quaternion.conjugate(q);
        p = Quaternion.qMult(q, p).qMult(c);
        this.x = p.i;
        this.y = p.j;
        this.z = p.k;
        return this;
    };
    Vector.prototype.transform = function (M) {
        var x = this.x * M[0][0] + this.y * M[0][1] + this.z * M[0][2] + (M[0][3] || 0);
        var y = this.x * M[1][0] + this.y * M[1][1] + this.z * M[1][2] + (M[1][3] || 0);
        var z = this.x * M[2][0] + this.y * M[2][1] + this.z * M[2][2] + (M[2][3] || 0);
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    Vector.prototype.rotateAxis = function (axis, angle) {
        return this.quaternionRotate(Quaternion.fromAxisRotation(axis, angle));
    };
    Vector.prototype.rotateX = function (xAngle) {
        return this.rotateAxis(Vector.X_AXIS, xAngle);
    };
    Vector.prototype.rotateY = function (yAngle) {
        return this.rotateAxis(Vector.Y_AXIS, yAngle);
    };
    Vector.prototype.rotateZ = function (zAngle) {
        return this.rotateAxis(Vector.Z_AXIS, zAngle);
    };
    Vector.prototype.angleBetween = function (v) {
        var denominator = (this.mag() * v.mag());
        if (denominator == 0) {
            return 0;
        }
        return Math.acos(Num.constrain(this.dot(v) / denominator, -1, 1));
    };
    Vector.prototype.equals = function (v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    };
    Vector.prototype.closest = function (V) {
        if (V.length == 1)
            return V[0];
        var minIndex = 0, min;
        for (var i = 0; i < V.length; i++) {
            var dist = Vector.sub(V[i], this).mag();
            if (!min || dist < min) {
                min = dist;
                minIndex = i;
            }
        }
        return V[minIndex];
    };
    Vector.prototype.furthest = function (V) {
        if (V.length == 1)
            return V[0];
        var maxIndex = 0, max;
        for (var i = 0; i < V.length; i++) {
            var dist = Vector.sub(V[i], this).mag();
            if (!max || dist > max) {
                max = dist;
                maxIndex = i;
            }
        }
        return V[maxIndex];
    };
    Vector.copy = function (v) {
        return new Vector(v.x, v.y, v.z);
    };
    Vector.mag = function (v) {
        return v.mag();
    };
    Vector.normalize = function (v) {
        return v.copy().normalize();
    };
    Vector.add = function (v, a) {
        return v.copy().add(a);
    };
    Vector.addX = function (v, a) {
        return v.copy().addX(a);
    };
    Vector.addY = function (v, a) {
        return v.copy().addY(a);
    };
    Vector.addZ = function (v, a) {
        return v.copy().addZ(a);
    };
    Vector.sub = function (v, a) {
        return v.copy().sub(a);
    };
    Vector.subX = function (v, a) {
        return v.copy().subX(a);
    };
    Vector.subY = function (v, a) {
        return v.copy().subY(a);
    };
    Vector.subZ = function (v, a) {
        return v.copy().subZ(a);
    };
    Vector.div = function (v, a) {
        return v.copy().div(a);
    };
    Vector.divX = function (v, a) {
        return v.copy().divX(a);
    };
    Vector.divY = function (v, a) {
        return v.copy().divY(a);
    };
    Vector.divZ = function (v, a) {
        return v.copy().divZ(a);
    };
    Vector.mult = function (v, a) {
        return v.copy().mult(a);
    };
    Vector.multX = function (v, a) {
        return v.copy().multX(a);
    };
    Vector.multY = function (v, a) {
        return v.copy().multY(a);
    };
    Vector.multZ = function (v, a) {
        return v.copy().multZ(a);
    };
    Vector.neg = function (v) {
        return v.copy().neg();
    };
    Vector.cross = function (v0, v1) {
        return v0.copy().cross(v1);
    };
    Vector.dot = function (v0, v1) {
        return v0.dot(v1);
    };
    Vector.qRotate = function (v, q) {
        return Vector.quaternionRotate(v, q);
    };
    Vector.quaternionRotate = function (v, q) {
        return v.copy().quaternionRotate(q);
    };
    Vector.transform = function (v, M) {
        return v.copy().transform(M);
    };
    Vector.rotateAxis = function (v, axis, angle) {
        return v.copy().rotateAxis(axis, angle);
    };
    Vector.rotateX = function (v, xAngle) {
        return v.copy().rotateX(xAngle);
    };
    Vector.rotateY = function (v, yAngle) {
        return v.copy().rotateY(yAngle);
    };
    Vector.rotateZ = function (v, zAngle) {
        return v.copy().rotateZ(zAngle);
    };
    Vector.angleBetween = function (v0, v1) {
        return v0.angleBetween(v1);
    };
    Vector.equals = function (v0, v1) {
        return v0.equals(v1);
    };
    Vector.closest = function (v, V) {
        return v.closest(V);
    };
    Vector.furthest = function (v, V) {
        return v.furthest(V);
    };
    Vector.axis = function (a) {
        switch (a) {
            case Vector.X_AXIS: return new Vector(1, 0, 0);
            case Vector.Y_AXIS: return new Vector(0, 1, 0);
            case Vector.Z_AXIS: return new Vector(0, 0, 1);
        }
        console.error("Axis [" + a + "] is not a valid axis number.");
        return new Vector();
    };
    Vector.xAxis = function () {
        return Vector.axis(Vector.X_AXIS);
    };
    Vector.yAxis = function () {
        return Vector.axis(Vector.Y_AXIS);
    };
    Vector.zAxis = function () {
        return Vector.axis(Vector.Z_AXIS);
    };
    Vector.X_AXIS = 0;
    Vector.Y_AXIS = 1;
    Vector.Z_AXIS = 2;
    return Vector;
}());
var List = (function () {
    function List() {
        this.count = 0;
    }
    List.prototype.addLast = function (data, priority) {
        if (priority === void 0) { priority = 0; }
        this.updatePriority(priority);
        var node = { nxt: undefined, data: data, priority: priority };
        if (this.tail === undefined || this.head === undefined) {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.nxt = node;
            this.tail = node;
        }
        this.count++;
    };
    List.prototype.addFirst = function (data, priority) {
        if (priority === void 0) { priority = 0; }
        this.updatePriority(priority);
        var node = { nxt: undefined, data: data, priority: priority };
        if (this.tail === undefined || this.head === undefined) {
            this.head = node;
            this.tail = node;
        }
        else {
            node.nxt = this.head;
            this.head = node;
        }
        this.count++;
    };
    List.prototype.updatePriority = function (priority) {
        if (!this.maxPriority && !this.minPriority) {
            this.maxPriority = priority;
            this.minPriority = priority;
        }
        else {
            if (priority < this.minPriority)
                this.minPriority = priority;
            if (priority > this.maxPriority)
                this.maxPriority = priority;
        }
    };
    List.prototype.addByPriority = function (data, priority) {
        var node = { nxt: undefined, data: data, priority: priority };
        if (this.head === undefined || this.tail === undefined) {
            this.head = node;
            this.tail = node;
        }
        else if (node.priority > this.head.priority) {
            node.nxt = this.head;
            this.head = node;
        }
        else {
            var current = this.head;
            while (current.nxt !== undefined) {
                if (node.priority >= current.nxt.priority) {
                    node.nxt = current.nxt;
                    current.nxt = node;
                    break;
                }
                current = current.nxt;
            }
            if (current.nxt === undefined) {
                this.tail.nxt = node;
                this.tail = node;
            }
        }
        this.count++;
    };
    List.prototype.addListByPriority = function (list) {
        var current = list.head;
        while (current) {
            this.addByPriority(current.data, current.priority);
            current = current.nxt;
        }
    };
    List.prototype.linkLast = function (list) {
        if (list.tail !== undefined) {
            if (this.tail !== undefined) {
                this.tail.nxt = list.head;
                this.tail = list.tail;
                this.count += list.count;
            }
            else {
                this.head = list.head;
                this.tail = list.tail;
                this.count = list.count;
            }
            if (list.maxPriority > this.maxPriority)
                this.maxPriority = list.maxPriority;
            if (list.minPriority > this.minPriority)
                this.minPriority = list.minPriority;
        }
    };
    List.prototype.linkFirst = function (list) {
        if (list.tail !== undefined) {
            if (this.head !== undefined) {
                list.tail.nxt = this.head;
                this.head = list.head;
                this.count += list.count;
            }
            else {
                this.head = list.head;
                this.tail = list.tail;
                this.count = list.count;
            }
            if (list.maxPriority > this.maxPriority)
                this.maxPriority = list.maxPriority;
            if (list.minPriority > this.minPriority)
                this.minPriority = list.minPriority;
        }
    };
    List.prototype.copy = function () {
        var copy = new List();
        var current = this.head;
        while (current) {
            var data = (typeof current.data.copy !== 'undefined' ? current.data.copy() : current.data);
            copy.addLast(data, current.priority);
            current = current.nxt;
        }
        return copy;
    };
    return List;
}());
var Num = (function () {
    function Num() {
    }
    Num.getSign = function (a) {
        if (a == 0)
            return 1;
        return (a / Math.abs(a));
    };
    Num.constrain = function (val, low, high) {
        if (val < low)
            return low;
        if (val > high)
            return high;
        return val;
    };
    Num.byteToFloat = function (b3, b2, b1, b0) {
        var data = [b0, b1, b2, b3];
        var buf = new ArrayBuffer(4);
        var view = new DataView(buf);
        data.forEach(function (b, idx) {
            view.setUint8(idx, b);
        });
        return view.getFloat32(0);
    };
    Num.avg = function (a) {
        var total = 0;
        for (var i = 0; i < a.length; i++) {
            total += a[i];
        }
        return total / a.length;
    };
    Num.rad = function (deg) {
        return deg * Math.PI / 180.0;
    };
    Num.deg = function (rad) {
        return rad * 180.0 / Math.PI;
    };
    return Num;
}());
var Color = (function () {
    function Color(rhng, gsa, bl, a) {
        if (rhng === undefined) {
            return new Color(0, 0, 0, 0);
        }
        if (typeof rhng === "string") {
            rhng = rhng.toUpperCase();
            if (rhng.charAt(0) == '#' && (rhng.length == 9 || rhng.length == 7 || rhng.length == 5 || rhng.length == 4)) {
                var isShort = (rhng.length == 4 || rhng.length == 5);
                var hasAlpha = (rhng.length == 9 || rhng.length == 5);
                var length = 2;
                var max = 255.0;
                if (isShort) {
                    length = 1;
                    max = 15.0;
                }
                var r = parseInt("0x" + rhng.substr(1, length)) / max * 255;
                var g = parseInt("0x" + rhng.substr(1 + length, length)) / max * 255;
                var b = parseInt("0x" + rhng.substr(1 + length * 2, length)) / max * 255;
                var a_1 = (hasAlpha ? parseInt("0x" + rhng.substr(1 + length * 3, length)) / max : 1.0);
                return new Color(r, g, b, a_1);
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
        }
        else if (bl !== undefined) {
            this.type = Color.HSL;
            this.h = Num.constrain(Math.floor(rhng), 0, 360);
            this.s = Num.constrain(Math.floor(gsa), 0, 100);
            this.l = Num.constrain(Math.floor(bl), 0, 100);
        }
        else {
            if (gsa === undefined)
                gsa = 1.0;
            this.type = Color.RGBA;
            this.r = rhng;
            this.g = rhng;
            this.b = rhng;
            this.a = gsa;
        }
    }
    Color.prototype.toString = function () {
        if (this.type == Color.RGBA) {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        }
        else if (this.type == Color.HSL) {
            return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
        }
        else {
            return "Color is not a valid type.";
        }
    };
    Color.prototype.copy = function () {
        if (this.type == Color.RGBA) {
            return new Color(this.r, this.g, this.b, this.a);
        }
        else {
            return new Color(this.h, this.s, this.l);
        }
    };
    Color.prototype.applyLight = function (color, intensity) {
        this.toRGB();
        if (color.type != Color.RGBA) {
            color = Color.toRGB(color);
        }
        intensity = (intensity < 0 ? 0 : intensity);
        this.r = Num.constrain(Math.floor(this.r * (color.r / 255.0) * intensity), 0, 255);
        this.g = Num.constrain(Math.floor(this.g * (color.g / 255.0) * intensity), 0, 255);
        this.b = Num.constrain(Math.floor(this.b * (color.b / 255.0) * intensity), 0, 255);
        return this;
    };
    Color.prototype.toRGB = function () {
        if (this.type == Color.RGBA)
            return this;
        if (this.s == 0)
            return new Color(this.l * 255 / 100.0);
        var hue = Num.constrain(this.h / 360.0, 0, 1);
        var l = Num.constrain(this.l / 100.0, 0, 1);
        var s = Num.constrain(this.s / 100.0, 0, 1);
        var temp1 = (l < 0.5 ? l * (1 + s) : l + s - (l * s));
        var temp2 = 2 * l - temp1;
        var hueSplit = function (h) {
            h = (h < 0 ? h + 1 : (h > 1 ? h - 1 : h));
            var val = h;
            if (6 * val < 1)
                return temp2 + (temp1 - temp2) * 6 * val;
            else if (2 * val <= 1)
                return temp1;
            else if (3 * val < 2)
                return temp2 + (temp1 - temp2) * ((2.0 / 3.0) - val) * 6;
            else
                return temp2;
        };
        var r = hueSplit(hue + (1.0 / 3.0)) * 255.0;
        var g = hueSplit(hue) * 255.0;
        var b = hueSplit(hue - (1.0 / 3.0)) * 255.0;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 1.0;
        this.type = Color.RGBA;
        return this;
    };
    Color.prototype.add = function (color) {
        this.toRGB();
        if (color.type != Color.RGBA) {
            color = Color.toRGB(color);
        }
        this.r = Num.constrain(this.r + color.r, 0, 255);
        this.g = Num.constrain(this.g + color.g, 0, 255);
        this.b = Num.constrain(this.b + color.b, 0, 255);
        this.a = Num.constrain(this.a + color.a, 0, 1);
        return this;
    };
    Color.prototype.mult = function (intensity) {
        this.toRGB();
        this.r = Num.constrain(Math.floor(this.r * intensity), 0, 255);
        this.g = Num.constrain(Math.floor(this.g * intensity), 0, 255);
        this.b = Num.constrain(Math.floor(this.b * intensity), 0, 255);
        return this;
    };
    Color.copy = function (c) {
        switch (c.type) {
            case Color.RGBA: return new Color(c.r, c.g, c.b, c.a);
            case Color.HSL: return new Color(c.h, c.s, c.l);
        }
        return c;
    };
    Color.toString = function (c) {
        return c.toString();
    };
    Color.toRGB = function (c) {
        return c.copy().toRGB();
    };
    Color.add = function (c0, c1) {
        return c0.copy().add(c1);
    };
    Color.applyLight = function (c, l, intensity) {
        return c.copy().applyLight(l, intensity);
    };
    Color.mult = function (c, intensity) {
        return c.copy().mult(intensity);
    };
    Color.RGBA = 0;
    Color.HSL = 1;
    return Color;
}());
var Material = (function () {
    function Material(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.fill, fill = _c === void 0 ? new Color(200, 200, 200, 1.0) : _c, _d = _b.wire, wire = _d === void 0 ? null : _d, _e = _b.lit, lit = _e === void 0 ? true : _e;
        this.fill = fill;
        if (wire !== null)
            this.wire = wire;
        else
            this.wire = this.fill;
        this.lit = lit;
    }
    Material.prototype.setColor = function (c) {
        this.fill = c;
        this.wire = c;
        return this;
    };
    Material.prototype.setFill = function (c) {
        this.fill = c;
        return this;
    };
    Material.prototype.setWire = function (c) {
        this.wire = c;
        return this;
    };
    Material.prototype.copy = function () {
        var fill = this.fill.copy();
        var wire = this.wire.copy();
        return new Material({
            fill: fill,
            wire: wire,
            lit: this.lit
        });
    };
    Material.setColor = function (m, c) {
        return m.copy().setColor(c);
    };
    Material.setFill = function (m, c) {
        return m.copy().setFill(c);
    };
    Material.setWire = function (m, c) {
        return m.copy().setWire(c);
    };
    Material.copy = function (m) {
        return new Material({
            fill: Color.copy(m.fill),
            wire: Color.copy(m.wire),
            lit: m.lit
        });
    };
    return Material;
}());
var Fragment = (function () {
    function Fragment(trigon, material, group) {
        this.trigon = trigon;
        this.material = material;
        this.group = group;
    }
    Fragment.prototype.copy = function () {
        return new Fragment(this.trigon.copy(), this.material.copy(), this.group);
    };
    Fragment.copy = function (f) {
        return new Fragment(Trigon.copy(f.trigon), Material.copy(f.material), f.group);
    };
    return Fragment;
}());
var Urbject = (function () {
    function Urbject(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? Urbject.PARENT : _c, _d = _b.position, position = _d === void 0 ? new Vector() : _d, _e = _b.orientation, orientation = _e === void 0 ? new Quaternion() : _e, _f = _b.scale, scale = _f === void 0 ? 1.0 : _f, superCopy = _b.superCopy, _g = _b.state, state = _g === void 0 ? Urbject.DYNAMIC : _g, _h = _b.group, group = _h === void 0 ? 0 : _h;
        if (superCopy) {
            this.type = superCopy.type;
            this.position = superCopy.position;
            this.orientation = superCopy.orientation;
            this.scaleVector = superCopy.scaleVector;
            this.children = superCopy.children;
            this.parent = superCopy.parent;
            this.state = superCopy.state;
            this.group = superCopy.group;
        }
        else {
            this.type = type;
            this.position = position;
            this.orientation = orientation.normalize();
            this.scaleVector = (typeof scale === "number" ? new Vector(scale, scale, scale) : scale);
            this.children = new Array();
            this.parent = undefined;
            this.state = state;
            this.group = group;
        }
    }
    Urbject.prototype.translate = function (v) {
        this.position.add(v);
        return this;
    };
    Urbject.prototype.scale = function (a) {
        this.scaleVector.mult(a);
        return this;
    };
    Urbject.prototype.setScale = function (a) {
        this.scaleVector = (typeof a === "number" ? new Vector(a, a, a) : a);
        return this;
    };
    Urbject.prototype.addChild = function (c) {
        if (c.parent) {
            c.parent.removeChild(c);
        }
        c.parent = this;
        this.children.push(c);
        return c;
    };
    Urbject.prototype.removeChild = function (c) {
        var removed = null;
        this.children = this.children.filter(function (urb) {
            var found = (urb === c);
            if (found) {
                urb.parent = undefined;
                removed = urb;
            }
            return removed;
        });
        return removed;
    };
    Urbject.prototype.getInstance = function (camera) {
        if (this.state == Urbject.STATIC && this.instanceCache) {
            return this.instanceCache;
        }
        var lights = new List();
        var frags = new List();
        for (var i = 0; i < this.children.length; i++) {
            var childInstance;
            switch (this.children[i].type) {
                case Urbject.MESH_URBJECT:
                    childInstance = this.children[i].getInstance(camera);
                    break;
                case Urbject.PARENT:
                    childInstance = this.children[i].getInstance(camera);
                    break;
                case Urbject.DIRECTIONAL_LIGHT:
                    childInstance = this.children[i].getInstance(camera);
                    break;
                case Urbject.AMBIENT_LIGHT:
                    childInstance = this.children[i].getInstance(camera);
                    break;
                case Urbject.POINT_LIGHT:
                    childInstance = this.children[i].getInstance(camera);
                    break;
                case Urbject.CAMERA:
                    childInstance = this.children[i].getInstance(camera);
            }
            var current = childInstance.lights.head;
            while (current) {
                var light = current.data.copy();
                light.applyTransform(this);
                lights.addLast(light);
                current = current.nxt;
            }
            var current = childInstance.fragments.head;
            while (current) {
                var frag = current.data;
                var t = Trigon.applyTransform(frag.trigon, this);
                frags.addLast(new Fragment(t, frag.material, frag.group));
                current = current.nxt;
            }
        }
        var instance = new FrameInstance(frags, lights);
        if (this.state == Urbject.STATIC) {
            this.instanceCache = instance;
        }
        return instance;
    };
    Urbject.prototype.applyTransform = function (transform) {
        this.scale(transform.scaleVector);
        this.position.mult(transform.scaleVector).quaternionRotate(transform.orientation).add(transform.position);
        this.orientation.quaternionRotate(transform.orientation);
        return this;
    };
    Urbject.prototype.getWorldTransform = function () {
        var parent = this.parent;
        var transform = this.copy({ shallow: true });
        while (parent) {
            transform.scale(parent.scaleVector);
            transform.position.mult(parent.scaleVector).quaternionRotate(parent.orientation).add(parent.position);
            transform.orientation.quaternionRotate(parent.orientation);
            parent = parent.parent;
        }
        return transform;
    };
    Urbject.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        var copy = new Urbject({
            type: this.type,
            position: this.position.copy(),
            orientation: this.orientation.copy(),
            scale: this.scaleVector.copy(),
            state: this.state,
            group: this.group
        });
        if (!options.shallow) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                switch (child.type) {
                    case Urbject.PARENT:
                        copy.addChild(child.copy());
                        break;
                    case Urbject.MESH_URBJECT:
                        copy.addChild(child.copy());
                        break;
                    case Urbject.DIRECTIONAL_LIGHT:
                        copy.addChild(child.copy());
                        break;
                    case Urbject.AMBIENT_LIGHT:
                        copy.addChild(child.copy());
                        break;
                    case Urbject.POINT_LIGHT:
                        copy.addChild(child.copy());
                        break;
                    case Urbject.CAMERA:
                        copy.addChild(child.copy());
                        break;
                }
            }
        }
        return copy;
    };
    Urbject.addChild = function (u, c) {
        return u.copy().addChild(c);
    };
    Urbject.removeChild = function (u, c) {
        return u.copy().removeChild(c);
    };
    Urbject.applyTransform = function (target, transform) {
        return target.copy().applyTransform(transform);
    };
    Urbject.getWorldTransform = function (u) {
        return u.getWorldTransform();
    };
    Urbject.getInstance = function (u, camera) {
        return u.getInstance(camera);
    };
    Urbject.translate = function (u, v) {
        return u.translate(v);
    };
    Urbject.scale = function (u, a) {
        return u.copy().scale(a);
    };
    Urbject.setScale = function (u, a) {
        return u.setScale(a);
    };
    Urbject.copy = function (u, options) {
        if (options === void 0) { options = { typeCheck: true, shallow: false }; }
        if (options.typeCheck) {
            switch (u.type) {
                case Urbject.PARENT: break;
                case Urbject.MESH_URBJECT: return MeshUrbject.copy(u, options);
                case Urbject.DIRECTIONAL_LIGHT: return DirectionalLight.copy(u, options);
                case Urbject.AMBIENT_LIGHT: return AmbientLight.copy(u, options);
                case Urbject.POINT_LIGHT: return PointLight.copy(u, options);
                case Urbject.CAMERA: return Camera.copy(u, options);
            }
        }
        var copy = new Urbject({
            type: u.type,
            position: Vector.copy(u.position),
            orientation: Quaternion.copy(u.orientation),
            scale: Vector.copy(u.scaleVector),
            state: u.state,
            group: u.group
        });
        if (!options.shallow) {
            for (var i = 0; i < u.children.length; i++) {
                var child = u.children[i];
                switch (child.type) {
                    case Urbject.PARENT:
                        copy.addChild(Urbject.copy(child, options));
                        break;
                    case Urbject.MESH_URBJECT:
                        copy.addChild(MeshUrbject.copy(child, options));
                        break;
                    case Urbject.DIRECTIONAL_LIGHT:
                        copy.addChild(DirectionalLight.copy(child, options));
                        break;
                    case Urbject.AMBIENT_LIGHT:
                        copy.addChild(AmbientLight.copy(child, options));
                        break;
                    case Urbject.POINT_LIGHT:
                        copy.addChild(PointLight.copy(child, options));
                        break;
                    case Urbject.CAMERA:
                        copy.addChild(Camera.copy(child, options));
                        break;
                }
            }
        }
        return copy;
    };
    Urbject.PARENT = 0;
    Urbject.MESH_URBJECT = 1;
    Urbject.AMBIENT_LIGHT = 2;
    Urbject.DIRECTIONAL_LIGHT = 3;
    Urbject.POINT_LIGHT = 4;
    Urbject.CAMERA = 5;
    Urbject.DYNAMIC = 100;
    Urbject.STATIC = 101;
    Urbject.BILLBOARD = 102;
    Urbject.Z_BILLBOARD = 103;
    Urbject.X_BILLBOARD = 104;
    Urbject.Y_BILLBOARD = 105;
    Urbject.DEFAULT_GROUP = 100;
    return Urbject;
}());
var Trigon = (function () {
    function Trigon(v0, v1, v2) {
        if (v0 === void 0) { v0 = new Vector(); }
        if (v1 === void 0) { v1 = new Vector(); }
        if (v2 === void 0) { v2 = new Vector(); }
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
    }
    Trigon.prototype.getNormal = function () {
        var u = Vector.sub(this.v1, this.v0);
        var v = Vector.sub(this.v2, this.v0);
        var dir = Vector.cross(u, v);
        return dir.normalize();
    };
    Trigon.prototype.rotateAxis = function (axis, angle) {
        this.v0.rotateAxis(axis, angle);
        this.v1.rotateAxis(axis, angle);
        this.v2.rotateAxis(axis, angle);
        return this;
    };
    Trigon.prototype.rotateX = function (angle) {
        return this.rotateAxis(Vector.X_AXIS, angle);
    };
    Trigon.prototype.rotateY = function (angle) {
        return this.rotateAxis(Vector.Y_AXIS, angle);
    };
    Trigon.prototype.rotateZ = function (angle) {
        return this.rotateAxis(Vector.Z_AXIS, angle);
    };
    Trigon.prototype.qRotate = function (q) {
        return this.quaternionRotate(q);
    };
    Trigon.prototype.quaternionRotate = function (q) {
        this.v0.quaternionRotate(q);
        this.v1.quaternionRotate(q);
        this.v2.quaternionRotate(q);
        return this;
    };
    Trigon.prototype.translate = function (v) {
        this.v0.add(v);
        this.v1.add(v);
        this.v2.add(v);
        return this;
    };
    Trigon.prototype.transform = function (M) {
        this.v0.transform(M);
        this.v1.transform(M);
        this.v2.transform(M);
        return this;
    };
    Trigon.prototype.scale = function (s) {
        this.v0.mult(s);
        this.v1.mult(s);
        this.v2.mult(s);
        return this;
    };
    Trigon.prototype.getCenter = function () {
        return new Vector(Num.avg([this.v0.x, this.v1.x, this.v2.x]), Num.avg([this.v0.y, this.v1.y, this.v2.y]), Num.avg([this.v0.z, this.v1.z, this.v2.z]));
    };
    Trigon.prototype.applyTransform = function (transform) {
        return this.quaternionRotate(transform.orientation).scale(transform.scaleVector).translate(transform.position);
    };
    Trigon.prototype.inverseNormal = function () {
        var temp = this.v0;
        this.v0 = this.v1;
        this.v1 = temp;
        return this;
    };
    Trigon.prototype.copy = function () {
        return new Trigon(this.v0.copy(), this.v1.copy(), this.v2.copy());
    };
    Trigon.applyTransform = function (target, transform) {
        return target.copy().applyTransform(transform);
    };
    Trigon.getNormal = function (t) {
        return t.getNormal();
    };
    Trigon.rotateAxis = function (t, axis, angle) {
        return t.copy().rotateAxis(axis, angle);
    };
    Trigon.rotateX = function (t, angle) {
        return t.copy().rotateX(angle);
    };
    Trigon.rotateY = function (t, angle) {
        return t.copy().rotateY(angle);
    };
    Trigon.rotateZ = function (t, angle) {
        return t.copy().rotateZ(angle);
    };
    Trigon.qRotate = function (t, q) {
        return Trigon.quaternionRotate(t, q);
    };
    Trigon.quaternionRotate = function (t, q) {
        return t.copy().quaternionRotate(q);
    };
    Trigon.translate = function (t, v) {
        return t.copy().translate(v);
    };
    Trigon.transform = function (t, M) {
        return t.copy().transform(M);
    };
    Trigon.scale = function (t, s) {
        return t.copy().scale(s);
    };
    Trigon.getCenter = function (t) {
        return t.getCenter();
    };
    Trigon.inverseNormal = function (t) {
        return t.copy().inverseNormal();
    };
    Trigon.copy = function (t) {
        return new Trigon(Vector.copy(t.v0), Vector.copy(t.v1), Vector.copy(t.v2));
    };
    return Trigon;
}());
var Quaternion = (function () {
    function Quaternion(a, i, j, k) {
        if (a === void 0) { a = 1; }
        if (i === void 0) { i = 0; }
        if (j === void 0) { j = 0; }
        if (k === void 0) { k = 0; }
        this.a = a;
        this.i = i;
        this.j = j;
        this.k = k;
    }
    Quaternion.prototype.add = function (q) {
        this.a = this.a + q.a;
        this.i = this.i + q.i;
        this.j = this.j + q.j;
        this.k = this.k + q.k;
        return this;
    };
    Quaternion.prototype.sub = function (q) {
        this.a = this.a - q.a;
        this.i = this.i - q.i;
        this.j = this.j - q.j;
        this.k = this.k - q.k;
        return this;
    };
    Quaternion.prototype.conjugate = function () {
        this.i = -this.i;
        this.j = -this.j;
        this.k = -this.k;
        return this;
    };
    Quaternion.prototype.mult = function (a) {
        this.a = this.a * a;
        this.i = this.i * a;
        this.j = this.j * a;
        this.k = this.k * a;
        return this;
    };
    Quaternion.prototype.div = function (a) {
        if (a == 0) {
            console.error("Cannot divide by 0.");
            return;
        }
        this.a = this.a / a;
        this.i = this.i / a;
        this.j = this.j / a;
        this.k = this.k / a;
        return this;
    };
    Quaternion.prototype.mag = function () {
        return Math.sqrt(this.a * this.a + this.i * this.i + this.j * this.j + this.k * this.k);
    };
    Quaternion.prototype.normalize = function () {
        return this.div(this.mag());
    };
    Quaternion.prototype.qRotate = function (q) {
        return this.quaternionRotate(q);
    };
    Quaternion.prototype.quaternionRotate = function (q) {
        var r = Quaternion.normalize(q).quaternionMult(this.normalize());
        this.a = r.a;
        this.i = r.i;
        this.j = r.j;
        this.k = r.k;
        return this;
    };
    Quaternion.prototype.qMult = function (q) {
        return this.quaternionMult(q);
    };
    Quaternion.prototype.quaternionMult = function (q) {
        var r = new Quaternion(this.a * q.a - this.i * q.i - this.j * q.j - this.k * q.k, this.a * q.i + this.i * q.a + this.j * q.k - this.k * q.j, this.a * q.j - this.i * q.k + this.j * q.a + this.k * q.i, this.a * q.k + this.i * q.j - this.j * q.i + this.k * q.a);
        this.a = r.a;
        this.i = r.i;
        this.j = r.j;
        this.k = r.k;
        return this;
    };
    Quaternion.prototype.rotateAxis = function (axis, angle) {
        var q = Quaternion.fromAxisRotation(axis, angle);
        return this.quaternionRotate(q);
    };
    Quaternion.prototype.rotateX = function (a) {
        return this.rotateAxis(Vector.X_AXIS, a);
    };
    Quaternion.prototype.rotateY = function (a) {
        return this.rotateAxis(Vector.Y_AXIS, a);
    };
    Quaternion.prototype.rotateZ = function (a) {
        return this.rotateAxis(Vector.Z_AXIS, a);
    };
    Quaternion.prototype.getRotationMatrix = function () {
        var a = this.a;
        var i = this.i;
        var j = this.j;
        var k = this.k;
        var M = [
            [
                (a * a + i * i - j * j - k * k),
                (2 * (i * j - a * k)),
                (2 * (a * j + i * k))
            ],
            [
                (2 * (i * j + a * k)),
                (a * a - i * i + j * j - k * k),
                (2 * (-a * i + j * k))
            ],
            [
                (2 * (-a * j + i * k)),
                (2 * (a * i + j * k)),
                (a * a - i * i - j * j + k * k)
            ]
        ];
        return M;
    };
    Quaternion.prototype.copy = function () {
        return new Quaternion(this.a, this.i, this.j, this.k);
    };
    Quaternion.sub = function (q0, q1) {
        return q0.copy().sub(q1);
    };
    Quaternion.add = function (q0, q1) {
        return q0.copy().add(q1);
    };
    Quaternion.conjugate = function (q) {
        return q.copy().conjugate();
    };
    Quaternion.mult = function (q, a) {
        return q.copy().mult(a);
    };
    Quaternion.div = function (q, a) {
        return q.copy().div(a);
    };
    Quaternion.mag = function (q) {
        return q.mag();
    };
    Quaternion.normalize = function (q) {
        return q.copy().normalize();
    };
    Quaternion.qMult = function (q0, q1) {
        return Quaternion.quaternionMult(q0, q1);
    };
    Quaternion.quaternionMult = function (q0, q1) {
        return q0.copy().quaternionMult(q1);
    };
    Quaternion.qRotate = function (q0, q1) {
        return this.quaternionRotate(q0, q1);
    };
    Quaternion.quaternionRotate = function (q0, q1) {
        return q0.copy().quaternionRotate(q1);
    };
    Quaternion.rotateAxis = function (q, axis, angle) {
        return q.copy().rotateAxis(axis, angle);
    };
    Quaternion.rotateX = function (q, a) {
        return q.copy().rotateX(a);
    };
    Quaternion.rotateY = function (q, a) {
        return q.copy().rotateY(a);
    };
    Quaternion.rotateZ = function (q, a) {
        return q.copy().rotateZ(a);
    };
    Quaternion.getRotationMatrix = function (q) {
        return q.getRotationMatrix();
    };
    Quaternion.copy = function (q) {
        return new Quaternion(q.a, q.i, q.j, q.k);
    };
    Quaternion.fromAxisRotation = function (axis, angle) {
        var a = Math.cos(angle / 2.0);
        var s = Math.sin(angle / 2.0);
        if (typeof axis === "number") {
            var i = (axis == Vector.X_AXIS ? s : 0);
            var j = (axis == Vector.Y_AXIS ? s : 0);
            var k = (axis == Vector.Z_AXIS ? s : 0);
        }
        else {
            axis = Vector.normalize(axis);
            var i = axis.x * s;
            var j = axis.y * s;
            var k = axis.z * s;
        }
        return (new Quaternion(a, i, j, k)).normalize();
    };
    Quaternion.fromVector = function (v, reference) {
        if (reference === void 0) { reference = Vector.xAxis(); }
        if (v.equals(reference)) {
            return new Quaternion(1, 0, 0, 0);
        }
        var origin = new Vector();
        if (Vector.neg(v).equals(reference)) {
            var randomLine = Vector.add(reference, new Vector(1, 1, 1)).normalize();
            if (randomLine.equals(reference)) {
                randomLine = Vector.add(reference, new Vector(1, 1, 0)).normalize();
            }
            var trigon_1 = new Trigon(origin, reference, randomLine);
            return Quaternion.fromAxisRotation(trigon_1.getNormal(), Math.PI);
        }
        var x_axis = Vector.axis(Vector.X_AXIS);
        var y_axis = Vector.axis(Vector.Y_AXIS);
        var z_axis = Vector.axis(Vector.Z_AXIS);
        var trigon = new Trigon(origin, reference, v);
        var normal = trigon.getNormal();
        var angle = reference.angleBetween(v);
        var angle_x = normal.angleBetween(x_axis);
        var angle_y = normal.angleBetween(y_axis);
        var angle_z = normal.angleBetween(z_axis);
        var sinHalfAngle = Math.sin(angle / 2);
        var quaternion = new Quaternion(Math.cos(angle / 2), Math.cos(angle_x) * sinHalfAngle, Math.cos(angle_y) * sinHalfAngle, Math.cos(angle_z) * sinHalfAngle);
        return quaternion.normalize();
    };
    return Quaternion;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.orientation, orientation = _c === void 0 ? Quaternion.fromAxisRotation(Vector.X_AXIS, 0) : _c, _d = _b.position, position = _d === void 0 ? new Vector(-10, 0, 0) : _d, scale = _b.scale, _e = _b.fov, fov = _e === void 0 ? 60 : _e, superCopy = _b.superCopy, state = _b.state, group = _b.group;
        var _this = _super.call(this, { type: Urbject.CAMERA, position: position, orientation: orientation, scale: scale, superCopy: superCopy, state: state, group: group }) || this;
        _this.fov = Num.constrain(fov, 1, 360);
        return _this;
    }
    Camera.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        return new Camera({
            superCopy: _super.prototype.copy.call(this, options),
            fov: this.fov
        });
    };
    Camera.copy = function (c, options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = Urbject.copy(c, { typeCheck: false, shallow: options.shallow });
        var copy = new Camera({
            superCopy: superCopy,
            fov: c.fov
        });
        return copy;
    };
    return Camera;
}(Urbject));
var Controller = (function () {
    function Controller(type) {
        if (type === void 0) { type = Controller.EMPTY; }
        this.type = type;
    }
    Controller.prototype.move = function (target) { };
    Controller.EMPTY = 0;
    Controller.DEFAULT_CAMERA = 1;
    Controller.FOCAL_POINT = 2;
    return Controller;
}());
var Interpolate = (function () {
    function Interpolate() {
    }
    Interpolate.range = function (t, start, end, type) {
        if (type === void 0) { type = Interpolate.LINEAR; }
        if (t <= 0)
            return start;
        if (t >= 1)
            return end;
        var diff = end - start;
        switch (type) {
            case Interpolate.EASE_IN:
                return (start + diff * t * t);
            case Interpolate.EASE_OUT:
                return (start + diff * (1 - (1 - t) * (1 - t)));
            case Interpolate.EASE:
                return (start + diff * (t < 0.5 ? 2 * t * t : 1 - 2 * Math.pow((1 - t), 2)));
            default:
            case Interpolate.LINEAR:
                return (start + diff * t);
        }
    };
    Interpolate.EASE = 0;
    Interpolate.EASE_IN = 1;
    Interpolate.EASE_OUT = 2;
    Interpolate.LINEAR = 3;
    return Interpolate;
}());
var DefaultCameraController = (function (_super) {
    __extends(DefaultCameraController, _super);
    function DefaultCameraController(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.minSpeed, minSpeed = _c === void 0 ? 0.5 : _c, _d = _b.maxSpeed, maxSpeed = _d === void 0 ? 2 : _d, _e = _b.accelerationTime, accelerationTime = _e === void 0 ? 1.0 : _e, _f = _b.accelerationType, accelerationType = _f === void 0 ? Interpolate.EASE_OUT : _f, _g = _b.controlFace, controlFace = _g === void 0 ? window : _g;
        var _this = _super.call(this, Controller.DEFAULT_CAMERA) || this;
        _this.x = 0;
        _this.y = 0;
        _this.dFov = 0;
        _this.minSpeed = minSpeed;
        _this.maxSpeed = maxSpeed;
        _this.accelerationTime = accelerationTime;
        _this.accelerationType = accelerationType;
        _this.controlFace = controlFace;
        var controller = _this;
        controlFace.addEventListener("mousedown", function (e) { controller.mouseDown(e); });
        controlFace.addEventListener("mouseup", function (e) { controller.mouseUp(e); });
        controlFace.addEventListener("mousemove", function (e) { controller.mouseMove(e); });
        controlFace.addEventListener("wheel", function (e) { controller.wheel(e); });
        controlFace.addEventListener("keydown", function (e) { controller.keyDown(e); });
        controlFace.addEventListener("keyup", function (e) { controller.keyUp(e); });
        _this.lastMove = performance.now();
        return _this;
    }
    DefaultCameraController.prototype.move = function (camera) {
        var now = performance.now();
        var elapsedTime = now - this.lastMove;
        this.lastMove = now;
        camera.fov = Num.constrain(camera.fov + this.dFov, 1, 180);
        this.dFov = 0;
        var fov = camera.fov || 60;
        var delta = new Vector(-this.x, this.y, 0);
        var dir = Vector.qRotate(new Vector(1, 0, 0), camera.orientation);
        var dirXY = new Vector(dir.x, dir.y, 0);
        var xyMag = dirXY.mag();
        var xDelta = (xyMag * delta.x * Math.PI / 1000.0) * fov / 120.0;
        var xAngle = xDelta + dirXY.angleBetween(new Vector(1, 0, 0)) * (dir.y < 0 ? -1 : 1);
        var yDelta = (delta.y * Math.PI / 1000.0) * fov / 120.0;
        ;
        var yAngle = yDelta + dir.angleBetween(dirXY) * (dir.z < 0 ? 1 : -1);
        yAngle = Num.constrain(yAngle, -Math.PI / 2.01, Math.PI / 2.01);
        dirXY.rotateZ(Math.PI / 2);
        var newOrientation = (new Quaternion(1, 0, 0, 0))
            .rotateZ(xAngle)
            .rotateAxis(dirXY, yAngle);
        camera.orientation = newOrientation;
        this.x = 0;
        this.y = 0;
        var moving = (this.u || this.d || this.l || this.r || this.f || this.b);
        if (moving) {
            if (!this.startMove) {
                this.startMove = now;
            }
            var timeSinceStart = now - this.startMove;
            this.speed = timeSinceStart == 0 ?
                this.minSpeed :
                this.getSpeed(timeSinceStart);
            var movement = (new Vector((this.f ? 1 : 0) + (this.b ? -1 : 0), (this.l ? 1 : 0) + (this.r ? -1 : 0), (this.u ? 1 : 0) + (this.d ? -1 : 0))).normalize().mult(this.speed * elapsedTime / 100.0);
            movement.qRotate(camera.orientation);
            camera.position.add(movement);
        }
        else {
            this.startMove = undefined;
        }
    };
    DefaultCameraController.prototype.getSpeed = function (t) {
        t = (t / 1000.0) / this.accelerationTime;
        return Interpolate.range(t, this.minSpeed, this.maxSpeed, this.accelerationType);
    };
    DefaultCameraController.prototype.mouseDown = function (e) {
        this.mousePressed = true;
    };
    DefaultCameraController.prototype.mouseUp = function (e) {
        this.mousePressed = false;
    };
    DefaultCameraController.prototype.mouseMove = function (e) {
        if (this.mousePressed) {
            this.x += e.movementX;
            this.y += e.movementY;
        }
    };
    DefaultCameraController.prototype.wheel = function (e) {
        var zoomDir = e.deltaY / Math.abs(e.deltaY);
        this.dFov = zoomDir * 5.0;
    };
    DefaultCameraController.prototype.keyDown = function (e) {
        switch (e.key.toUpperCase()) {
            case 'W':
                this.f = true;
                break;
            case 'A':
                this.l = true;
                break;
            case 'S':
                this.b = true;
                break;
            case 'D':
                this.r = true;
                break;
            case 'Q':
                this.d = true;
                break;
            case 'E':
                this.u = true;
                break;
        }
    };
    DefaultCameraController.prototype.keyUp = function (e) {
        switch (e.key.toUpperCase()) {
            case 'W':
                this.f = false;
                break;
            case 'A':
                this.l = false;
                break;
            case 'S':
                this.b = false;
                break;
            case 'D':
                this.r = false;
                break;
            case 'Q':
                this.d = false;
                break;
            case 'E':
                this.u = false;
                break;
        }
    };
    return DefaultCameraController;
}(Controller));
var Stats = (function () {
    function Stats(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.show, show = _c === void 0 ? false : _c, _d = _b.suspendOnBlur, suspendOnBlur = _d === void 0 ? true : _d;
        this.suspended = false;
        this.show = show;
        this.stats = {};
        this.getStatBox();
        if (suspendOnBlur) {
            this.addSleepListener();
        }
    }
    Stats.prototype.getStatBox = function () {
        this.statBox = document.getElementById("statBox");
        if (!this.statBox) {
            this.statBox = document.createElement("table");
            this.statBox.setAttribute("id", "statBox");
            this.statBox.setAttribute("style", "position: fixed; top: 0; left: 0; overflow-y: auto; max-height: 100vh; color: lime; background-color: #2226; text-align: left; font-family: monospace;");
            document.body.append(this.statBox);
        }
    };
    Stats.prototype.addSleepListener = function () {
        var _this = this;
        window.addEventListener('blur', function (evt) {
            _this.suspended = true;
        });
        window.addEventListener('focus', function (evt) {
            _this.suspended = false;
            var now = performance.now();
            _this.timer = now;
            _this.lastRead = now;
        });
    };
    Stats.prototype.getStat = function (name) {
        if (this.stats[name]) {
            return this.stats[name].value;
        }
        else {
            return undefined;
        }
    };
    Stats.prototype.setStat = function (name, value, bias, fractionDigits) {
        if (bias === void 0) { bias = 1; }
        if (fractionDigits === void 0) { fractionDigits = 3; }
        if (this.stats[name]) {
            var stat_1 = this.stats[name];
            setTimeout(function () {
                if (typeof value === 'number' && typeof stat_1.value === 'number') {
                    bias = Num.constrain(bias, 0.0, 1.0);
                    stat_1.value = value * bias + stat_1.value * (1 - bias);
                    stat_1.elem.innerHTML = stat_1.value.toFixed(fractionDigits);
                }
                else {
                    stat_1.value = value;
                    stat_1.elem.innerHTML = "" + value;
                }
            }, 0);
        }
        else {
            this.stats[name] = { elem: document.createElement("td"), value: value };
            this.stats[name].elem.setAttribute("id", name);
            this.stats[name].elem.innerHTML = (typeof value === 'number' ? value.toFixed(fractionDigits) : value);
            var row = document.createElement("tr");
            if (!this.show) {
                row.setAttribute("style", "display: none;");
            }
            var head = document.createElement("td");
            head.innerHTML = name;
            row.append(head);
            row.append(this.stats[name].elem);
            this.statBox.append(row);
        }
    };
    Stats.prototype.startTimer = function () {
        this.timer = performance.now();
        this.lastRead = this.timer;
    };
    Stats.prototype.readTimer = function () {
        var now = performance.now();
        if (!this.timer)
            this.timer = now;
        this.lastRead = now;
        return this.lastRead - this.timer;
    };
    Stats.prototype.readCheckpoint = function () {
        var now = performance.now();
        if (!this.lastRead)
            this.lastRead = now;
        var time = now - this.lastRead;
        this.lastRead = now;
        return time;
    };
    return Stats;
}());
var UrchinWorker = (function () {
    function UrchinWorker(type, showPerformance) {
        if (showPerformance === void 0) { showPerformance = false; }
        this.type = type;
        this.working = false;
        this.worker = new Worker(URCHIN_PATH, { name: "" + type });
        this.stats = new Stats({ show: showPerformance });
    }
    UrchinWorker.prototype.assign = function (assignment) {
        this.queue = assignment;
    };
    UrchinWorker.prototype.getAssignment = function () {
        if (this.queue) {
            var assignment = this.queue;
            this.queue = undefined;
            this.working = true;
            return assignment;
        }
        this.working = false;
        return null;
    };
    UrchinWorker.prototype.workOn = function (assignment) { };
    UrchinWorker.prototype.report = function (data) { };
    UrchinWorker.SORTING = 0;
    UrchinWorker.LIGHTING = 1;
    UrchinWorker.PROJECTING = 2;
    UrchinWorker.RENDER = 3;
    return UrchinWorker;
}());
var FrameInstance = (function () {
    function FrameInstance(fragments, lights, camera) {
        this.fragments = fragments;
        this.lights = lights;
        this.camera = camera;
    }
    FrameInstance.prototype.copy = function () {
        return new FrameInstance(this.fragments.copy(), this.lights.copy(), this.camera ? this.camera.copy({ shallow: true }) : undefined);
    };
    FrameInstance.copy = function (i) {
        return i.copy();
    };
    return FrameInstance;
}());
var LightingWorker = (function (_super) {
    __extends(LightingWorker, _super);
    function LightingWorker(callback, showPerformance) {
        if (callback === void 0) { callback = function (data) { }; }
        if (showPerformance === void 0) { showPerformance = false; }
        var _this = _super.call(this, UrchinWorker.LIGHTING, showPerformance) || this;
        var w = _this;
        _this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        _this.callback = callback;
        return _this;
    }
    LightingWorker.prototype.assign = function (assignment) {
        _super.prototype.assign.call(this, assignment);
        if (!this.working) {
            var assignment_1 = this.getAssignment();
            assignment_1 && this.workOn(assignment_1);
        }
    };
    LightingWorker.prototype.workOn = function (assignment) {
        this.stats.startTimer();
        var frags = assignment.fragments;
        var buffer = new ArrayBuffer(4 * frags.count * LightingWorker.FRAG_SIZE);
        var current = frags.head;
        for (var i = 0; i < frags.count && current; i++) {
            var fragView = new Float32Array(buffer, 4 * LightingWorker.FRAG_SIZE * i, LightingWorker.FRAG_SIZE);
            var t = current.data.trigon;
            var f = Color.toRGB(current.data.material.fill);
            var w = Color.toRGB(current.data.material.wire);
            var fragData = [
                t.v0.x, t.v0.y, t.v0.z,
                t.v1.x, t.v1.y, t.v1.z,
                t.v2.x, t.v2.y, t.v2.z,
                f.r, f.g, f.b, f.a,
                w.r, w.g, w.b, w.a,
                current.data.material.lit ? 1 : 0
            ];
            for (var n = 0; n < fragData.length; n++) {
                fragView[n] = fragData[n];
            }
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, lights: assignment.lights }, [buffer]);
        this.stats.setStat("Lighting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    };
    LightingWorker.prototype.report = function (data) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Lighting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    };
    LightingWorker.DATA_SIZE = 8;
    LightingWorker.FRAG_SIZE = 18;
    return LightingWorker;
}(UrchinWorker));
var Mesh = (function () {
    function Mesh() {
        this.trigons = new Array();
    }
    Mesh.prototype.rotateAxis = function (axis, angle) {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].rotateAxis(axis, angle);
        }
        return this;
    };
    Mesh.prototype.rotateX = function (angle) {
        return this.rotateAxis(Vector.X_AXIS, angle);
    };
    Mesh.prototype.rotateY = function (angle) {
        return this.rotateAxis(Vector.Y_AXIS, angle);
    };
    Mesh.prototype.rotateZ = function (angle) {
        return this.rotateAxis(Vector.Z_AXIS, angle);
    };
    Mesh.prototype.qRotate = function (q) {
        return this.quaternionRotate(q);
    };
    Mesh.prototype.quaternionRotate = function (q) {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].quaternionRotate(q);
        }
        return this;
    };
    Mesh.prototype.translate = function (v) {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].translate(v);
        }
        return this;
    };
    Mesh.prototype.transform = function (M) {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].transform(M);
        }
        return this;
    };
    Mesh.prototype.scale = function (s) {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].scale(s);
        }
        return this;
    };
    Mesh.prototype.addTrigon = function (t) {
        if (Array.isArray(t)) {
            for (var i = 0; i < t.length; i++) {
                this.trigons.push(t[i].copy());
            }
        }
        else {
            this.trigons.push(t.copy());
        }
        return t;
    };
    Mesh.prototype.generateFromArrayData = function (v) {
        for (var i = 0; i < v.length; i += 9) {
            var t = new Trigon(new Vector(v[i + 0], v[i + 1], v[i + 2]), new Vector(v[i + 3], v[i + 4], v[i + 5]), new Vector(v[i + 6], v[i + 7], v[i + 8]));
            this.addTrigon(t);
        }
        return this;
    };
    Mesh.prototype.inverseNormals = function () {
        for (var i = 0; i < this.trigons.length; i++) {
            this.trigons[i].inverseNormal();
        }
        return this;
    };
    Mesh.prototype.copy = function () {
        var copy = new Mesh();
        for (var i = 0; i < this.trigons.length; i++) {
            copy.addTrigon(this.trigons[i].copy());
        }
        return copy;
    };
    Mesh.rotateAxis = function (m, axis, angle) {
        return m.copy().rotateAxis(axis, angle);
    };
    Mesh.rotateX = function (m, angle) {
        return m.copy().rotateX(angle);
    };
    Mesh.rotateY = function (m, angle) {
        return m.copy().rotateY(angle);
    };
    Mesh.rotateZ = function (m, angle) {
        return m.copy().rotateZ(angle);
    };
    Mesh.qRotate = function (m, q) {
        return m.copy().qRotate(q);
    };
    Mesh.quaternionRotate = function (m, q) {
        return m.copy().quaternionRotate(q);
    };
    Mesh.translate = function (m, v) {
        return m.copy().translate(v);
    };
    Mesh.transform = function (m, M) {
        return m.copy().transform(M);
    };
    Mesh.scale = function (m, s) {
        return m.copy().scale(s);
    };
    Mesh.addTrigon = function (m, t) {
        var mesh = m.copy();
        mesh.addTrigon(t);
        return mesh;
    };
    Mesh.generateFromArrayData = function (v) {
        var m = new Mesh();
        return m.generateFromArrayData(v);
    };
    Mesh.inverseNormals = function (m) {
        return m.copy().inverseNormals();
    };
    Mesh.copy = function (m) {
        var copy = new Mesh();
        for (var i = 0; i < m.trigons.length; i++) {
            copy.addTrigon(Trigon.copy(m.trigons[i]));
        }
        return copy;
    };
    Mesh.plane = function () {
        var plane = new Mesh();
        plane.generateFromArrayData([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            1, 1, 0,
            0, 1, 0,
            1, 0, 0
        ]);
        plane.translate(new Vector(-0.5, -0.5, 0));
        return plane;
    };
    Mesh.cube = function () {
        var cube = new Mesh();
        var p = [
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 1, 1]
        ];
        var vectorPoints = [
            0, 4, 1,
            5, 1, 4,
            6, 2, 7,
            3, 7, 2,
            0, 1, 2,
            3, 2, 1,
            5, 4, 7,
            6, 7, 4,
            5, 7, 1,
            3, 1, 7,
            0, 2, 4,
            2, 6, 4
        ];
        var vectorArray = new Array();
        for (var i = 0; i < vectorPoints.length; i++) {
            var point = p[vectorPoints[i]];
            vectorArray.push(point[0]);
            vectorArray.push(point[1]);
            vectorArray.push(point[2]);
        }
        cube.generateFromArrayData(vectorArray);
        cube.translate(new Vector(-0.5, -0.5, -0.5));
        return cube;
    };
    Mesh.circle = function (options) {
        if (options === void 0) { options = {}; }
        if (options.resolution === undefined)
            options.resolution = 16;
        if (options.radius === undefined)
            options.radius = 0.5;
        if (options.resolution < 3)
            options.resolution = 3;
        var circle = new Mesh();
        var angle = 0;
        var step = (Math.PI * 2) / options.resolution;
        for (var i = 0; i < options.resolution; i++) {
            var t = new Trigon(new Vector(), (new Vector(Math.cos(angle), Math.sin(angle), 0)).mult(options.radius), (new Vector(Math.cos(angle + step), Math.sin(angle + step), 0)).mult(options.radius));
            circle.addTrigon(t);
            angle += step;
        }
        return circle;
    };
    Mesh.cylinder = function (options) {
        if (options === void 0) { options = {}; }
        if (options.resolution === undefined)
            options.resolution = 16;
        if (options.innerRadius === undefined)
            options.innerRadius = 0;
        if (options.outerRadius === undefined)
            options.outerRadius = 0.5;
        if (options.height === undefined)
            options.height = 1;
        var res = options.resolution < 3 ? 3 : options.resolution;
        var outR = options.outerRadius;
        var inR = options.innerRadius;
        var hasCenter = inR != 0;
        var hasEnds = outR != inR;
        var h = options.height;
        var hasSides = h != 0;
        var cylinder = new Mesh();
        var angle = 0;
        var step = (Math.PI * 2) / res;
        for (var i = 0; i < res; i++) {
            var c0 = new Vector(Math.cos(angle), Math.sin(angle), 1), c1 = new Vector(Math.cos(angle + step), Math.sin(angle + step), 1);
            var p = [
                Vector.mult(c0, new Vector(outR, outR, h / 2.0)),
                Vector.mult(c1, new Vector(outR, outR, h / 2.0)),
                Vector.mult(c0, new Vector(inR, inR, h / 2.0)),
                Vector.mult(c1, new Vector(inR, inR, h / 2.0)),
                Vector.mult(c0, new Vector(outR, outR, -h / 2.0)),
                Vector.mult(c1, new Vector(outR, outR, -h / 2.0)),
                Vector.mult(c0, new Vector(inR, inR, -h / 2.0)),
                Vector.mult(c1, new Vector(inR, inR, -h / 2.0))
            ];
            var outerEnds = [
                new Trigon(p[0], p[1], p[2]),
                new Trigon(p[5], p[4], p[6])
            ];
            var innerEnds = [
                new Trigon(p[2], p[1], p[3]),
                new Trigon(p[5], p[6], p[7])
            ];
            var outer = [
                new Trigon(p[0], p[4], p[5]),
                new Trigon(p[5], p[1], p[0])
            ];
            var inner = [
                new Trigon(p[2], p[3], p[7]),
                new Trigon(p[7], p[6], p[2])
            ];
            if (hasEnds) {
                cylinder.addTrigon(outerEnds);
                if (hasCenter) {
                    cylinder.addTrigon(innerEnds);
                }
            }
            if (hasSides) {
                cylinder.addTrigon(outer);
                if (hasCenter) {
                    cylinder.addTrigon(inner);
                }
            }
            angle += step;
        }
        return cylinder;
    };
    Mesh.sphere = function (options) {
        if (options === void 0) { options = {}; }
        if (options.subdivisions === undefined)
            options.subdivisions = 3;
        if (options.radius === undefined)
            options.radius = 0.5;
        if (options.subdivisions < 1)
            options.subdivisions = 1;
        var sphere = new Mesh();
        var t = (1 + Math.sqrt(5)) / 2;
        var p = [
            [-1, 0, t],
            [1, 0, t],
            [-1, 0, -t],
            [1, 0, -t],
            [0, -t, -1],
            [0, -t, 1],
            [0, t, -1],
            [0, t, 1],
            [t, 1, 0],
            [t, -1, 0],
            [-t, 1, 0],
            [-t, -1, 0]
        ];
        var vectorPoints = [
            0, 11, 5,
            0, 5, 1,
            0, 1, 7,
            0, 7, 10,
            0, 10, 11,
            1, 5, 9,
            5, 11, 4,
            11, 10, 2,
            10, 7, 6,
            7, 1, 8,
            3, 9, 4,
            3, 4, 2,
            3, 2, 6,
            3, 6, 8,
            3, 8, 9,
            4, 9, 5,
            2, 4, 11,
            6, 2, 10,
            8, 6, 7,
            9, 8, 1
        ];
        var vectorArray = new Array();
        for (var i = 0; i < vectorPoints.length; i++) {
            var point = p[vectorPoints[i]];
            var v = (new Vector(point[0], point[1], point[2])).normalize();
            vectorArray.push(v.x);
            vectorArray.push(v.y);
            vectorArray.push(v.z);
        }
        sphere.generateFromArrayData(vectorArray);
        if (options.subdivisions > 1) {
            for (var i = 1; i < options.subdivisions; i++) {
                var trigons = sphere.trigons;
                sphere.trigons = new Array();
                for (var n = 0; n < trigons.length; n++) {
                    var t_1 = trigons[n];
                    var m01 = ((Vector.add(t_1.v0, t_1.v1)).div(2)).normalize();
                    var m12 = ((Vector.add(t_1.v1, t_1.v2)).div(2)).normalize();
                    var m20 = ((Vector.add(t_1.v0, t_1.v2)).div(2)).normalize();
                    var t0 = new Trigon(t_1.v0, m01, m20);
                    var t1 = new Trigon(m01.copy(), t_1.v1, m12);
                    var t2 = new Trigon(m20.copy(), m12.copy(), t_1.v2);
                    var t3 = new Trigon(m01.copy(), m12.copy(), m20.copy());
                    sphere.addTrigon([t0, t1, t2, t3]);
                }
            }
        }
        sphere.scale(options.radius);
        return sphere;
    };
    Mesh.uvSphere = function (options) {
        if (options === void 0) { options = {}; }
        if (options.resolution === undefined)
            options.resolution = 16;
        if (options.radius === undefined)
            options.radius = 0.5;
        if (options.resolution < 3)
            options.resolution = 3;
        var sphere = new Mesh();
        var circle = Mesh.circle({ resolution: options.resolution, radius: 1 });
        var lastCircle = circle.copy();
        var numLayers = Math.ceil(options.resolution / 4);
        for (var a = 0; a < numLayers; a++) {
            var angle = Math.PI / 2 * (a + 1) * 1.0 / numLayers;
            var height = Math.sin(angle);
            var layerCircle = circle
                .copy()
                .scale(Math.cos(angle))
                .translate(new Vector(0, 0, height));
            for (var i = 0; i < circle.trigons.length; i++) {
                var t0_t = lastCircle.trigons[i];
                var t1_t = layerCircle.trigons[i];
                var t0_b = Trigon.scale(t0_t, new Vector(1, 1, -1));
                var t1_b = Trigon.scale(t1_t, new Vector(1, 1, -1));
                sphere.addTrigon(new Trigon(t0_t.v1, t0_t.v2, t1_t.v2));
                sphere.addTrigon(new Trigon(t0_b.v2, t0_b.v1, t1_b.v1));
                if (a + 1 != numLayers) {
                    sphere.addTrigon(new Trigon(t1_t.v2, t1_t.v1, t0_t.v1));
                    sphere.addTrigon(new Trigon(t1_b.v1, t1_b.v2, t0_b.v2));
                }
            }
            lastCircle = layerCircle;
        }
        return sphere.scale(options.radius);
    };
    return Mesh;
}());
var DirectionalLight = (function (_super) {
    __extends(DirectionalLight, _super);
    function DirectionalLight(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.direction, direction = _c === void 0 ? new Vector(1, 1, -4) : _c, _d = _b.brightness, brightness = _d === void 0 ? 1.1 : _d, _e = _b.color, color = _e === void 0 ? new Color("WHITE") : _e, superCopy = _b.superCopy, state = _b.state, group = _b.group;
        var _this = _super.call(this, { type: Urbject.DIRECTIONAL_LIGHT, superCopy: superCopy, orientation: Quaternion.fromVector(direction), state: state, group: group }) || this;
        _this.brightness = brightness;
        _this.color = color;
        return _this;
    }
    DirectionalLight.prototype.getInstance = function (camera) {
        if (!this.instanceCache) {
            var instance = _super.prototype.getInstance.call(this, camera);
            instance.lights.addFirst(this.copy({ shallow: true }));
            return instance;
        }
        return _super.prototype.getInstance.call(this, camera);
    };
    DirectionalLight.prototype.intensityOn = function (t) {
        var norm = t.getNormal();
        return Num.constrain((Vector.quaternionRotate(Vector.axis(Vector.X_AXIS), this.orientation).angleBetween(norm) - Math.PI / 2) / (Math.PI / 2), 0, 1) * this.brightness;
    };
    DirectionalLight.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = _super.prototype.copy.call(this, options);
        var copy = new DirectionalLight({
            superCopy: superCopy,
            color: this.color.copy(),
            brightness: this.brightness
        });
        return copy;
    };
    DirectionalLight.getInstance = function (l, camera) {
        return l.getInstance(camera);
    };
    DirectionalLight.intensityOn = function (l, t) {
        return l.intensityOn(t);
    };
    DirectionalLight.copy = function (l, options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = Urbject.copy(l, { typeCheck: false, shallow: options.shallow });
        var copy = new DirectionalLight({
            superCopy: superCopy,
            color: Color.copy(l.color),
            brightness: l.brightness
        });
        return copy;
    };
    return DirectionalLight;
}(Urbject));
var AmbientLight = (function (_super) {
    __extends(AmbientLight, _super);
    function AmbientLight(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.brightness, brightness = _c === void 0 ? 0.6 : _c, _d = _b.color, color = _d === void 0 ? new Color("WHITE") : _d, superCopy = _b.superCopy, state = _b.state, group = _b.group;
        var _this = _super.call(this, { type: Urbject.AMBIENT_LIGHT, superCopy: superCopy, state: state, group: group }) || this;
        _this.brightness = brightness;
        _this.color = color;
        return _this;
    }
    AmbientLight.prototype.getInstance = function (camera) {
        if (!this.instanceCache) {
            var instance = _super.prototype.getInstance.call(this, camera);
            instance.lights.addFirst(this.copy({ shallow: true }));
            return instance;
        }
        return _super.prototype.getInstance.call(this, camera);
    };
    AmbientLight.prototype.intensityOn = function (t) {
        return this.brightness;
    };
    AmbientLight.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = _super.prototype.copy.call(this, options);
        var copy = new AmbientLight({
            brightness: this.brightness,
            color: this.color.copy(),
            superCopy: superCopy
        });
        return copy;
    };
    AmbientLight.getInstance = function (l, camera) {
        return l.getInstance(camera);
    };
    AmbientLight.intensityOn = function (l, t) {
        return l.intensityOn(t);
    };
    AmbientLight.copy = function (l, options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = Urbject.copy(l, { typeCheck: false, shallow: options.shallow });
        var copy = new AmbientLight({
            brightness: l.brightness,
            color: Color.copy(l.color),
            superCopy: superCopy
        });
        return copy;
    };
    return AmbientLight;
}(Urbject));
var MeshUrbject = (function (_super) {
    __extends(MeshUrbject, _super);
    function MeshUrbject(_a) {
        var _b = _a === void 0 ? {} : _a, position = _b.position, orientation = _b.orientation, scale = _b.scale, state = _b.state, group = _b.group, _c = _b.mesh, mesh = _c === void 0 ? new Mesh() : _c, _d = _b.material, material = _d === void 0 ? new Material() : _d, superCopy = _b.superCopy;
        var _this = _super.call(this, { type: Urbject.MESH_URBJECT, superCopy: superCopy, position: position, orientation: orientation, scale: scale, state: state, group: group }) || this;
        _this.mesh = mesh;
        _this.material = material;
        return _this;
    }
    MeshUrbject.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = _super.prototype.copy.call(this, options);
        var copy = new MeshUrbject({
            superCopy: superCopy,
            mesh: this.mesh.copy(),
            material: this.material.copy()
        });
        return copy;
    };
    MeshUrbject.prototype.getInstance = function (camera) {
        if (this.state == Urbject.STATIC && this.instanceCache) {
            return this.instanceCache;
        }
        var frags = new List();
        var trigons = this.mesh.trigons;
        var trigonRotation = this.orientation;
        switch (this.state) {
            default:
            case Urbject.DYNAMIC:
                break;
            case Urbject.BILLBOARD:
            case Urbject.X_BILLBOARD:
            case Urbject.Y_BILLBOARD:
            case Urbject.Z_BILLBOARD:
                var norm = Vector.axis(Vector.X_AXIS);
                var center = this.position;
                var diff = Vector.sub(camera.position, center);
                if (this.state == Urbject.X_BILLBOARD)
                    diff.x = 0;
                if (this.state == Urbject.Y_BILLBOARD)
                    diff.y = 0;
                if (this.state == Urbject.Z_BILLBOARD)
                    diff.z = 0;
                var axis = (new Trigon(new Vector(), norm, diff)).getNormal();
                trigonRotation.quaternionRotate(Quaternion.fromAxisRotation(axis, diff.angleBetween(norm)));
                break;
        }
        for (var n = 0; n < trigons.length; n++) {
            var t = Trigon.scale(trigons[n], this.scaleVector).quaternionRotate(trigonRotation).translate(this.position);
            frags.addFirst(new Fragment(t, this.material, this.group + Urbject.DEFAULT_GROUP));
        }
        var childrenInstance = _super.prototype.getInstance.call(this, camera);
        frags.linkLast(childrenInstance.fragments);
        var instance = new FrameInstance(frags, childrenInstance.lights);
        if (this.state == Urbject.STATIC) {
            this.instanceCache = instance;
        }
        return instance;
    };
    MeshUrbject.getInstance = function (u, camera) {
        return u.getInstance(camera);
    };
    MeshUrbject.copy = function (u, options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = Urbject.copy(u, { typeCheck: false, shallow: options.shallow });
        var copy = new MeshUrbject({
            superCopy: superCopy,
            mesh: Mesh.copy(u.mesh),
            material: Material.copy(u.material)
        });
        return copy;
    };
    return MeshUrbject;
}(Urbject));
var Scene = (function () {
    function Scene(_a) {
        var _b = (_a === void 0 ? {} : _a).root, root = _b === void 0 ? new Urbject() : _b;
        this.root = root;
    }
    Scene.prototype.add = function (urbject) {
        return this.root.addChild(urbject);
    };
    Scene.prototype.remove = function (urbject) {
        return this.root.removeChild(urbject);
    };
    Scene.prototype.copy = function () {
        return new Scene({ root: this.root.copy() });
    };
    Scene.add = function (s, urbject) {
        var scene = s.copy();
        scene.add(urbject);
        return scene;
    };
    Scene.remove = function (s, urbject) {
        var scene = s.copy();
        scene.remove(urbject);
        return scene;
    };
    Scene.copy = function (u) {
        return new Scene({
            root: Urbject.copy(u.root)
        });
    };
    return Scene;
}());
var Renderer = (function () {
    function Renderer(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.canvas, canvas = _c === void 0 ? document.querySelector("canvas") || (function a() {
            var canvas = document.createElement("canvas");
            canvas.width = 720;
            canvas.height = 480;
            document.body.append(canvas);
            return canvas;
        })() : _c, _d = _b.fullscreen, fullscreen = _d === void 0 ? false : _d, _e = _b.superSampling, superSampling = _e === void 0 ? 1 : _e, _f = _b.backgroundColor, backgroundColor = _f === void 0 ? new Color("silver") : _f, _g = _b.showPerformance, showPerformance = _g === void 0 ? false : _g;
        this.backgroundColor = backgroundColor;
        this.canvas = canvas;
        this.superSampling = superSampling;
        this.stats = new Stats({ show: showPerformance });
        if (fullscreen) {
            this.canvas.setAttribute("style", this.canvas.getAttribute("style") + ";position: fixed; width: 100%; height: 100%;");
            var renderer_1 = this;
            window.addEventListener("resize", function () { renderer_1.resize(); });
            this.resize();
        }
        else if (this.superSampling != 1) {
            this.canvas.setAttribute("style", this.canvas.getAttribute("style") + (";width: " + this.canvas.width + "px; height: " + this.canvas.height + "px;"));
            this.canvas.width = this.canvas.width * this.superSampling;
            this.canvas.height = this.canvas.height * this.superSampling;
        }
    }
    Renderer.prototype.render = function (scene, camera) {
        if (this.lastDraw) {
            var frameTime = this.stats.readTimer();
            var fps = 1000.0 / frameTime;
            this.stats.setStat("FPS", fps, 1.0 / 10, 0);
        }
        this.stats.startTimer();
        var instance = Renderer.getCameraInstance(scene, camera);
        var lights = instance.lights;
        var frags = instance.fragments;
        camera = instance.camera;
        this.stats.setStat("Gathering Instance Data", this.stats.readCheckpoint(), 1.0 / 10, 3);
        frags = Renderer.sortFragments(frags);
        this.stats.setStat("Sorting Fragments", this.stats.readCheckpoint(), 1.0 / 10, 3);
        var data = new ArrayBuffer(4 * (Renderer.DRAW_HEADER_SIZE + Renderer.DRAW_FRAG_SIZE * frags.count));
        var color = Color.toRGB(this.backgroundColor);
        var headerView = new Float32Array(data, 0, Renderer.DRAW_HEADER_SIZE);
        headerView[0] = color.r;
        headerView[1] = color.g;
        headerView[2] = color.b;
        headerView[3] = color.a;
        headerView[4] = this.canvas.width;
        headerView[5] = this.canvas.height;
        var node = frags.head, num = 0;
        while (node) {
            var frag = node.data;
            var t = Trigon.translate(frag.trigon, Vector.neg(camera.position));
            t.quaternionRotate(Quaternion.conjugate(camera.orientation));
            var p0 = Renderer.project(t.v0, camera.fov, this.canvas.width, this.canvas.height);
            var p1 = Renderer.project(t.v1, camera.fov, this.canvas.width, this.canvas.height);
            var p2 = Renderer.project(t.v2, camera.fov, this.canvas.width, this.canvas.height);
            if (frag.material.lit) {
                var mat = Renderer.light(frag, lights);
                var fill = mat.fill;
                var wire = mat.wire;
            }
            else {
                var fill = Color.toRGB(frag.material.fill);
                var wire = Color.toRGB(frag.material.wire);
            }
            var fragView = new Float32Array(data, 4 * (Renderer.DRAW_HEADER_SIZE + num * Renderer.DRAW_FRAG_SIZE), Renderer.DRAW_FRAG_SIZE);
            var fragData = [
                p0.x, p0.y,
                p1.x, p1.y,
                p2.x, p2.y,
                fill.r, fill.g, fill.b, fill.a,
                wire.r, wire.g, wire.b, wire.a
            ];
            for (var i = 0; i < fragView.length; i++) {
                fragView[i] = fragData[i];
            }
            num++;
            node = node.nxt;
        }
        this.stats.setStat("Building Draw Data", this.stats.readCheckpoint(), 1.0 / 10, 3);
        if (!this.ctx)
            this.ctx = this.canvas.getContext('2d');
        Renderer.draw(data, this.ctx);
        this.lastDraw = data;
        this.stats.setStat("Draw Time", this.stats.readCheckpoint(), 1.0 / 10, 3);
    };
    Renderer.prototype.resize = function (width, height) {
        if (width === void 0) { width = window.innerWidth; }
        if (height === void 0) { height = window.innerHeight; }
        this.canvas.width = width * this.superSampling;
        this.canvas.height = height * this.superSampling;
        if (this.lastDraw && this.ctx) {
            Renderer.draw(this.lastDraw, this.ctx);
        }
    };
    Renderer.prototype.project = function (v, camera, superSampling) {
        if (superSampling === void 0) { superSampling = false; }
        var w = this.canvas.width / (superSampling ? 1 : this.superSampling);
        var h = this.canvas.height / (superSampling ? 1 : this.superSampling);
        var worldPos = camera.getWorldTransform();
        return Renderer.project(v.sub(worldPos.position).quaternionRotate(worldPos.orientation.conjugate()), camera.fov, w, h);
    };
    Renderer.draw = function (data, ctx) {
        var headerData = new Float32Array(data, 0, Renderer.DRAW_HEADER_SIZE);
        ctx.save();
        if (headerData[3] > 0) {
            var fill_1 = (new Color(headerData[0], headerData[1], headerData[2], headerData[3])).toString();
            ctx.fillStyle = fill_1;
            ctx.beginPath();
            ctx.rect(0, 0, headerData[4], headerData[5]);
            ctx.fill();
        }
        else {
            ctx.clearRect(0, 0, headerData[4], headerData[5]);
        }
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        for (var i = Renderer.DRAW_HEADER_SIZE * 4; i < data.byteLength; i += Renderer.DRAW_FRAG_SIZE * 4) {
            var drawData = new Float32Array(data, i, Renderer.DRAW_FRAG_SIZE);
            var x0 = drawData[0], y0 = drawData[1];
            var x1 = drawData[2], y1 = drawData[3];
            var x2 = drawData[4], y2 = drawData[5];
            var fill = "rgba(" + drawData[6] + ", " + drawData[7] + ", " + drawData[8] + ", " + drawData[9] + ")";
            var stroke = "rgba(" + drawData[10] + ", " + drawData[11] + ", " + drawData[12] + ", " + drawData[13] + ")";
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    };
    Renderer.light = function (frag, lights) {
        var fill = Color.toRGB(frag.material.fill);
        var wire = Color.toRGB(frag.material.wire);
        var totalLight = new Color();
        var light = lights.head;
        while (light) {
            var intensity = light.data.intensityOn(frag.trigon);
            totalLight.add(Color.mult(light.data.color, intensity));
            light = light.nxt;
        }
        fill.applyLight(totalLight, 1);
        wire.applyLight(totalLight, 1);
        return new Material({ fill: fill, wire: wire });
    };
    Renderer.project = function (v, fov, w, h) {
        fov *= Math.PI * 2.0 / 360.0;
        var d = Math.sqrt(w * w + h * h);
        var wFov = fov * w / d;
        var hFov = fov * h / d;
        var diffXZ = new Vector(v.x, 0, v.z);
        var diffXY = new Vector(v.x, -v.y, 0);
        var angleY = diffXZ.angleBetween(Vector.axis(Vector.X_AXIS));
        var angleX = diffXY.angleBetween(Vector.axis(Vector.X_AXIS));
        var screenPos = new Vector((v.y < 0 ? 1 : -1) * angleX / (wFov / 2), (v.z < 0 ? 1 : -1) * angleY / (hFov / 2), 0);
        screenPos.mult(new Vector(w / 2, h / 2, 0));
        screenPos.add(new Vector(w / 2, h / 2, 0));
        return screenPos;
    };
    Renderer.getCameraInstance = function (scene, camera) {
        var worldCamera = (camera.getWorldTransform());
        worldCamera.fov = camera.fov;
        camera = worldCamera;
        var instance = scene.root.getInstance(camera);
        var frags = new List();
        var cameraDir = Vector.axis(Vector.X_AXIS);
        var current = instance.fragments.head;
        while (current) {
            var t = Trigon.translate(current.data.trigon, Vector.neg(camera.position));
            var m0 = t.v0.mag(), m1 = t.v1.mag(), m2 = t.v2.mag();
            var far = m0 > m1 ? (m0 > m2 ? t.v0 : t.v2) : (m1 > m2 ? t.v1 : t.v2);
            var near = m0 < m1 ? (m0 < m2 ? t.v0 : t.v2) : (m1 < m2 ? t.v1 : t.v2);
            var center = t.getCenter();
            var diff = Vector.add(near, far).mult(0.5 * 0.95).add(Vector.mult(center, 0.05));
            var dist = diff.mag();
            var normal = t.getNormal();
            var facingAngle = Vector.angleBetween(center, normal);
            if (facingAngle > Math.PI / 2) {
                t.quaternionRotate(Quaternion.conjugate(camera.orientation));
                var viewAngle = Math.min(Math.min(Vector.angleBetween(cameraDir, t.v0), Vector.angleBetween(cameraDir, t.v1)), Vector.angleBetween(cameraDir, t.v2));
                if (viewAngle <= (180 * Math.PI / 360)) {
                    frags.addLast(current.data, dist);
                }
            }
            current = current.nxt;
        }
        return new FrameInstance(frags, instance.lights, camera);
    };
    Renderer.sortFragments = function (fragments) {
        var groups = new Array();
        var minGroup = Urbject.DEFAULT_GROUP, maxGroup = Urbject.DEFAULT_GROUP;
        var min = fragments.minPriority;
        var max = fragments.maxPriority;
        var diff = max - min;
        var current = fragments.head;
        while (current) {
            var group = current.data.group;
            if (group < minGroup)
                minGroup = group;
            if (group > maxGroup)
                maxGroup = group;
            var bucketNum = diff ? Math.floor(fragments.count * (current.priority - min) / diff) : 0;
            if (!groups[group])
                groups[group] = new Array(fragments.count);
            var fragBuckets = groups[group];
            if (!fragBuckets[bucketNum])
                fragBuckets[bucketNum] = new List();
            fragBuckets[bucketNum].addByPriority(current.data, current.priority);
            current = current.nxt;
        }
        var sortedFrags = new List();
        for (var g = maxGroup; g >= minGroup; g--) {
            var fragBuckets = groups[g];
            if (fragBuckets) {
                for (var i = 0; i < fragBuckets.length; i++) {
                    if (fragBuckets[i]) {
                        sortedFrags.linkFirst(fragBuckets[i]);
                    }
                }
            }
        }
        return sortedFrags;
    };
    Renderer.DRAW_HEADER_SIZE = 6;
    Renderer.DRAW_FRAG_SIZE = 14;
    return Renderer;
}());
var SortingWorker = (function (_super) {
    __extends(SortingWorker, _super);
    function SortingWorker(callback, showPerformance) {
        if (callback === void 0) { callback = function (data) { }; }
        if (showPerformance === void 0) { showPerformance = false; }
        var _this = _super.call(this, UrchinWorker.SORTING, showPerformance) || this;
        var w = _this;
        _this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        _this.callback = callback;
        return _this;
    }
    SortingWorker.prototype.assign = function (assignment) {
        _super.prototype.assign.call(this, assignment);
        if (!this.working) {
            var assignment_2 = this.getAssignment();
            assignment_2 && this.workOn(assignment_2);
        }
    };
    SortingWorker.prototype.workOn = function (assignment) {
        this.stats.startTimer();
        var buffer = new ArrayBuffer(assignment.count * SortingWorker.FRAG_SIZE * 4);
        var bufferView = new Float32Array(buffer);
        var extremes = new Array();
        var minGroup = Urbject.DEFAULT_GROUP, maxGroup = Urbject.DEFAULT_GROUP;
        var current = assignment.head;
        for (var i = 0; i < assignment.count && current; i++) {
            var dist = current.priority;
            var group = current.data.group;
            if (group < minGroup)
                minGroup = group;
            if (group > maxGroup)
                maxGroup = group;
            if (!extremes[group])
                extremes[group] = { min: dist, max: dist };
            if (group < extremes[group].min)
                extremes[group].min = group;
            if (group > extremes[group].max)
                extremes[group].max = group;
            bufferView[i * SortingWorker.FRAG_SIZE] = i;
            bufferView[i * SortingWorker.FRAG_SIZE + 1] = dist;
            bufferView[i * SortingWorker.FRAG_SIZE + 2] = group;
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, extremes: extremes, minGroup: minGroup, maxGroup: maxGroup }, [buffer]);
        this.stats.setStat("Sorting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    };
    SortingWorker.prototype.report = function (data) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Sorting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    };
    SortingWorker.DATA_SIZE = 1;
    SortingWorker.FRAG_SIZE = 3;
    return SortingWorker;
}(UrchinWorker));
var ProjectingWorker = (function (_super) {
    __extends(ProjectingWorker, _super);
    function ProjectingWorker(callback, showPerformance) {
        if (callback === void 0) { callback = function (data) { }; }
        if (showPerformance === void 0) { showPerformance = false; }
        var _this = _super.call(this, UrchinWorker.PROJECTING, showPerformance) || this;
        var w = _this;
        _this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        _this.callback = callback;
        return _this;
    }
    ProjectingWorker.prototype.assign = function (assignment) {
        _super.prototype.assign.call(this, assignment);
        if (!this.working) {
            var assignment_3 = this.getAssignment();
            assignment_3 && this.workOn(assignment_3);
        }
    };
    ProjectingWorker.prototype.workOn = function (assignment) {
        this.stats.startTimer();
        var frags = assignment.instance.fragments;
        var buffer = new ArrayBuffer(4 * frags.count * ProjectingWorker.FRAG_SIZE);
        var current = frags.head;
        for (var i = 0; i < frags.count && current; i++) {
            var fragView = new Float32Array(buffer, 4 * ProjectingWorker.FRAG_SIZE * i, ProjectingWorker.FRAG_SIZE);
            var t = current.data.trigon;
            var fragData = [
                t.v0.x, t.v0.y, t.v0.z,
                t.v1.x, t.v1.y, t.v1.z,
                t.v2.x, t.v2.y, t.v2.z
            ];
            for (var n = 0; n < fragData.length; n++) {
                fragView[n] = fragData[n];
            }
            current = current.nxt;
        }
        this.worker.postMessage({ buffer: buffer, camera: assignment.instance.camera, width: assignment.width, height: assignment.height }, [buffer]);
        this.stats.setStat("Projecting Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
    };
    ProjectingWorker.prototype.report = function (data) {
        var dataView = new Float32Array(data.buffer);
        this.working = false;
        this.stats.setStat("Projecting Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback(dataView);
    };
    ProjectingWorker.DATA_SIZE = 6;
    ProjectingWorker.FRAG_SIZE = 9;
    return ProjectingWorker;
}(UrchinWorker));
var RenderWorker = (function (_super) {
    __extends(RenderWorker, _super);
    function RenderWorker(canvas, callback, sync, showPerformance) {
        if (callback === void 0) { callback = function () { }; }
        if (sync === void 0) { sync = function () { }; }
        if (showPerformance === void 0) { showPerformance = false; }
        var _this = _super.call(this, UrchinWorker.RENDER, showPerformance) || this;
        _this.sync = function () { };
        var w = _this;
        _this.worker.addEventListener('message', function (evt) {
            w.report(evt.data);
        });
        _this.callback = callback;
        _this.sync = sync;
        var offscreen = canvas.transferControlToOffscreen();
        _this.worker.postMessage({ canvas: offscreen }, [offscreen]);
        return _this;
    }
    RenderWorker.prototype.resize = function (width, height) {
        this.worker.postMessage({ dimensions: { width: width, height: height } });
    };
    RenderWorker.prototype.assign = function (assignment) {
        _super.prototype.assign.call(this, assignment);
        if (!this.working) {
            var assignment_4 = this.getAssignment();
            assignment_4 && this.workOn(assignment_4);
        }
    };
    RenderWorker.prototype.workOn = function (assignment) {
        this.stats.startTimer();
        this.worker.postMessage({ buffer: assignment }, [assignment]);
        this.stats.setStat("Render Worker Send", this.stats.readTimer(), 1.0 / 10, 3);
        this.stats.startTimer();
        this.sync();
    };
    RenderWorker.prototype.report = function (data) {
        this.working = false;
        this.stats.setStat("Render Worker Process", this.stats.readTimer(), 1.0 / 10, 3);
        this.callback();
        var assignment = this.getAssignment();
        assignment && this.workOn(assignment);
    };
    return RenderWorker;
}(UrchinWorker));
var PerformanceRenderer = (function (_super) {
    __extends(PerformanceRenderer, _super);
    function PerformanceRenderer(_a) {
        var _b = _a === void 0 ? {} : _a, canvas = _b.canvas, fullscreen = _b.fullscreen, superSampling = _b.superSampling, backgroundColor = _b.backgroundColor, showPerformance = _b.showPerformance, _c = _b.offscreenDraw, offscreenDraw = _c === void 0 ? true : _c, frameCallback = _b.frameCallback;
        var _this = _super.call(this, { canvas: canvas, fullscreen: false, backgroundColor: backgroundColor, showPerformance: showPerformance, superSampling: superSampling }) || this;
        _this.preRendering = false;
        _this.drawing = false;
        _this.callbackCount = 0;
        _this.width = _this.canvas.width;
        _this.height = _this.canvas.height;
        if (fullscreen) {
            _this.canvas.setAttribute("style", _this.canvas.getAttribute("style") + ";position: fixed; width: 100%; height: 100%;");
            var renderer_2 = _this;
            window.addEventListener("resize", function () { renderer_2.resize(); });
            _this.resize();
        }
        var p = _this;
        if (offscreenDraw && _this.canvas.transferControlToOffscreen) {
            _this.renderWorker = new RenderWorker(_this.canvas, function () { p.renderCallback(); }, function () { p.renderSync(); }, showPerformance);
        }
        else {
            _this.ctx = _this.canvas.getContext('2d');
        }
        _this.sortingWorker = new SortingWorker(function (data) { p.sortCallback(data); }, showPerformance);
        _this.lightingWorker = new LightingWorker(function (data) { p.lightCallback(data); }, showPerformance);
        _this.projectingWorker = new ProjectingWorker(function (data) { p.projectCallback(data); }, showPerformance);
        _this.frameCallback = frameCallback;
        return _this;
    }
    PerformanceRenderer.prototype.sortCallback = function (data) {
        this.sortCache = data;
        this.callbackCheck();
    };
    PerformanceRenderer.prototype.lightCallback = function (data) {
        this.lightCache = data;
        this.callbackCheck();
    };
    PerformanceRenderer.prototype.projectCallback = function (data) {
        this.projectCache = data;
        this.callbackCheck();
    };
    PerformanceRenderer.prototype.renderSync = function () {
        if (!this.preRendering) {
            setTimeout(function (renderer) {
                if (renderer.scene && renderer.camera) {
                    var instance = Renderer.getCameraInstance(renderer.scene, renderer.camera);
                    renderer.requestPreRender(instance);
                }
            }, 0, this);
        }
    };
    PerformanceRenderer.prototype.renderCallback = function () {
        this.drawing = false;
        if (this.lastFrameTime) {
            var frameTime = performance.now() - this.lastFrameTime;
            var fps = 1000.0 / frameTime;
            this.stats.setStat("FPS", fps, 1.0 / 10, 0);
        }
        this.lastFrameTime = performance.now();
        if (this.frameCallback) {
            setTimeout(this.frameCallback, 0);
        }
    };
    PerformanceRenderer.prototype.callbackCheck = function () {
        this.callbackCount++;
        if (this.callbackCount == 3) {
            this.preRendering = false;
            this.callbackCount = 0;
            setTimeout(function (renderer, s, p, l) {
                var data = renderer.buildDrawData(s, p, l);
                setTimeout(function () {
                    renderer.draw(data);
                }, 0);
            }, 0, this, this.sortCache, this.projectCache, this.lightCache);
        }
    };
    PerformanceRenderer.prototype.render = function (scene, camera) {
        var instance = Renderer.getCameraInstance(scene, camera);
        this.requestPreRender(instance);
    };
    PerformanceRenderer.prototype.start = function (scene, camera) {
        this.scene = scene;
        this.camera = camera;
        var instance = Renderer.getCameraInstance(scene, camera);
        this.requestPreRender(instance);
    };
    PerformanceRenderer.prototype.stop = function () {
        this.scene = undefined;
        this.camera = undefined;
    };
    PerformanceRenderer.prototype.requestPreRender = function (instance) {
        if (instance === void 0) { instance = this.instanceQueue; }
        if (!this.preRendering && instance) {
            this.preRendering = true;
            this.sortingWorker.assign(instance.fragments);
            this.lightingWorker.assign(instance);
            this.projectingWorker.assign({ instance: instance, width: this.width, height: this.height });
        }
        else {
            this.instanceQueue = instance;
        }
    };
    PerformanceRenderer.prototype.resize = function (width, height) {
        if (width === void 0) { width = window.innerWidth; }
        if (height === void 0) { height = window.innerHeight; }
        this.width = width * this.superSampling;
        this.height = height * this.superSampling;
        if (this.renderWorker) {
            this.renderWorker.resize(this.width, this.height);
        }
        else {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        if (this.lastDraw && !this.drawing) {
            this.draw(this.lastDraw);
        }
    };
    PerformanceRenderer.prototype.project = function (v, camera, superSampling) {
        if (superSampling === void 0) { superSampling = false; }
        var w = this.width / (superSampling ? 1 : this.superSampling);
        var h = this.height / (superSampling ? 1 : this.superSampling);
        var worldPos = camera.getWorldTransform();
        return Renderer.project(v.sub(worldPos.position).quaternionRotate(worldPos.orientation.conjugate()), camera.fov, w, h);
    };
    PerformanceRenderer.prototype.draw = function (data) {
        this.drawing = true;
        if (this.renderWorker) {
            this.renderWorker.assign(data);
        }
        else {
            this.renderSync();
            this.stats.startTimer();
            Renderer.draw(data, this.ctx);
            this.stats.setStat("Draw Time", this.stats.readTimer(), 1.0 / 10, 3);
            this.renderCallback();
        }
    };
    PerformanceRenderer.prototype.buildDrawData = function (s, p, l) {
        this.stats.startTimer();
        var buffer = new ArrayBuffer(4 * (Renderer.DRAW_HEADER_SIZE + Renderer.DRAW_FRAG_SIZE * s.length));
        var headerView = new Float32Array(buffer, 0, Renderer.DRAW_HEADER_SIZE);
        var color = Color.toRGB(this.backgroundColor);
        headerView[0] = color.r;
        headerView[1] = color.g;
        headerView[2] = color.b;
        headerView[3] = color.a;
        headerView[4] = this.width;
        headerView[5] = this.height;
        for (var i = 0; i < s.length; i++) {
            var fragView = new Float32Array(buffer, 4 * (Renderer.DRAW_HEADER_SIZE + i * Renderer.DRAW_FRAG_SIZE), Renderer.DRAW_FRAG_SIZE);
            var p_i = s[i] * ProjectingWorker.DATA_SIZE;
            var l_i = s[i] * LightingWorker.DATA_SIZE;
            var fragData = [
                p[p_i + 0], p[p_i + 1],
                p[p_i + 2], p[p_i + 3],
                p[p_i + 4], p[p_i + 5],
                l[l_i + 0], l[l_i + 1], l[l_i + 2], l[l_i + 3],
                l[l_i + 4], l[l_i + 5], l[l_i + 6], l[l_i + 7]
            ];
            for (var n = 0; n < fragView.length; n++) {
                fragView[n] = fragData[n];
            }
        }
        this.stats.setStat("Building Draw Data", this.stats.readTimer(), 1.0 / 10, 3);
        return buffer;
    };
    return PerformanceRenderer;
}(Renderer));
var PointLight = (function (_super) {
    __extends(PointLight, _super);
    function PointLight(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.radius, radius = _c === void 0 ? 10.0 : _c, _d = _b.position, position = _d === void 0 ? new Vector() : _d, _e = _b.brightness, brightness = _e === void 0 ? 1.0 : _e, _f = _b.color, color = _f === void 0 ? new Color("WHITE") : _f, superCopy = _b.superCopy, state = _b.state, group = _b.group;
        var _this = _super.call(this, { position: position, type: Urbject.POINT_LIGHT, superCopy: superCopy, state: state, group: group }) || this;
        _this.radius = radius;
        _this.brightness = brightness;
        _this.color = color;
        return _this;
    }
    PointLight.prototype.getInstance = function (camera) {
        if (!this.instanceCache) {
            var instance = _super.prototype.getInstance.call(this, camera);
            instance.lights.addFirst(this.copy({ shallow: true }));
            return instance;
        }
        return _super.prototype.getInstance.call(this, camera);
    };
    PointLight.prototype.intensityOn = function (t) {
        var diff = Vector.sub(t.getCenter(), this.position);
        var diffMag = Vector.quaternionRotate(diff, Quaternion.conjugate(this.orientation)).div(this.scaleVector).mag();
        var falloff = (this.radius == 0) ? 0 : Num.constrain((this.radius - diffMag) / this.radius, 0, 1);
        var norm = t.getNormal();
        return (falloff *
            Num.constrain((diff.angleBetween(norm) - Math.PI / 2) / (Math.PI / 2), 0, 1) *
            this.brightness);
    };
    PointLight.prototype.copy = function (options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = _super.prototype.copy.call(this, options);
        var copy = new PointLight({
            superCopy: superCopy,
            color: this.color.copy(),
            brightness: this.brightness,
            radius: this.radius
        });
        return copy;
    };
    PointLight.getInstance = function (l, camera) {
        return l.getInstance(camera);
    };
    PointLight.intensityOn = function (l, t) {
        return l.intensityOn(t);
    };
    PointLight.copy = function (l, options) {
        if (options === void 0) { options = { shallow: false }; }
        var superCopy = Urbject.copy(l, { typeCheck: false, shallow: options.shallow });
        var copy = new PointLight({
            superCopy: superCopy,
            color: Color.copy(l.color),
            brightness: l.brightness,
            radius: l.radius
        });
        return copy;
    };
    return PointLight;
}(Urbject));
var FocalPointController = (function (_super) {
    __extends(FocalPointController, _super);
    function FocalPointController(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.sensitivity, sensitivity = _c === void 0 ? 1 : _c, _d = _b.friction, friction = _d === void 0 ? 0.1 : _d, _e = _b.zoomMultiplier, zoomMultiplier = _e === void 0 ? 1 : _e, _f = _b.focalPoint, focalPoint = _f === void 0 ? new Vector() : _f, _g = _b.minDist, minDist = _g === void 0 ? 1 : _g, _h = _b.maxDist, maxDist = _h === void 0 ? 20 : _h, _j = _b.controlFace, controlFace = _j === void 0 ? window : _j;
        var _this = _super.call(this, Controller.FOCAL_POINT) || this;
        _this.velocity = new Vector();
        _this.dMouse = new Vector();
        _this.sensitivity = sensitivity;
        _this.friction = Num.constrain(friction, 0, 1);
        _this.zoomMultiplier = zoomMultiplier;
        _this.focalPoint = focalPoint;
        _this.minDist = minDist;
        _this.maxDist = maxDist;
        _this.controlFace = controlFace;
        _this.timer = new Stats();
        var controller = _this;
        controlFace.addEventListener("mousedown", function (e) { controller.mouseDown(e); });
        controlFace.addEventListener("mouseup", function (e) { controller.mouseUp(e); });
        controlFace.addEventListener("mousemove", function (e) { controller.mouseMove(e); });
        controlFace.addEventListener("wheel", function (e) { controller.wheel(e); });
        return _this;
    }
    FocalPointController.prototype.move = function (camera) {
        var t = this.timer.readTimer() / 1000.0;
        if (this.dMouse.mag()) {
            this.velocity = this.dMouse.div(t * 100).mult(this.sensitivity);
            this.dMouse = new Vector();
        }
        var pos = Vector.sub(camera.position, this.focalPoint);
        if (this.dist === undefined) {
            this.dist = pos.mag();
        }
        var XYAxis = new Vector(pos.x, pos.y, 0).normalize().rotateZ(Math.PI / 2);
        camera.position.rotateAxis(XYAxis, -this.velocity.y / 360.0);
        if (Num.getSign(camera.position.x * pos.x) != 1)
            camera.position.x = pos.x;
        if (Num.getSign(camera.position.y * pos.y) != 1)
            camera.position.y = pos.y;
        camera.position.rotateZ(-this.velocity.x / 360.0);
        camera.position
            .normalize()
            .mult(this.dist)
            .add(this.focalPoint);
        var diff = Vector.sub(this.focalPoint, camera.position), diffXY = new Vector(diff.x, diff.y, 0), diffZ = new Vector(diffXY.mag(), 0, diff.z);
        camera.orientation = Quaternion.fromVector(diffZ).rotateZ(diffXY.angleBetween(Vector.axis(Vector.X_AXIS)) * (diffXY.y > 0 ? 1 : -1));
        this.velocity.mult(1 - this.friction);
        this.timer.startTimer();
    };
    FocalPointController.prototype.mouseDown = function (e) {
        this.mousePressed = true;
    };
    FocalPointController.prototype.mouseUp = function (e) {
        this.mousePressed = false;
    };
    FocalPointController.prototype.mouseMove = function (e) {
        if (this.mousePressed) {
            this.dMouse.x += e.movementX;
            this.dMouse.y += e.movementY;
        }
    };
    FocalPointController.prototype.wheel = function (e) {
        var zoomDir = e.deltaY / Math.abs(e.deltaY);
        this.dist = Num.constrain(this.dist + zoomDir * this.zoomMultiplier, this.minDist || 0.001, this.maxDist);
    };
    return FocalPointController;
}(Controller));
if (typeof window === 'undefined') {
    switch (self.name) {
        case "" + UrchinWorker.RENDER:
            var workerCanvas_1, workerCtx_1, buffer = void 0;
            self.addEventListener('message', function (evt) {
                if (typeof evt.data.canvas !== "undefined") {
                    console.log("Initializing Urchin Render Worker...");
                    workerCanvas_1 = evt.data.canvas;
                    workerCtx_1 = workerCanvas_1.getContext('2d');
                    return;
                }
                if (typeof evt.data.dimensions !== 'undefined') {
                    workerCanvas_1.width = evt.data.dimensions.width;
                    workerCanvas_1.height = evt.data.dimensions.height;
                    return;
                }
                if (typeof evt.data.buffer !== "undefined") {
                    Renderer.draw(evt.data.buffer, workerCtx_1);
                    self.postMessage({}, undefined);
                    return;
                }
            });
            break;
        case "" + UrchinWorker.SORTING:
            self.addEventListener('message', function (evt) {
                var buffer = evt.data.buffer, extremes = evt.data.extremes, minGroup = evt.data.minGroup, maxGroup = evt.data.maxGroup;
                var view = new Float32Array(buffer);
                var count = view.length / SortingWorker.FRAG_SIZE;
                var groups = new Array();
                for (var i = 0; i < count; i++) {
                    var frag_i = i * SortingWorker.FRAG_SIZE;
                    var group = view[frag_i + 2];
                    var diff = extremes[group].max - extremes[group].min;
                    var bucketNum = diff ? Math.floor((count - 1) * Num.constrain(1 - ((view[frag_i + 1] - extremes[group].min) / diff), 0, 1)) : 0;
                    if (!groups[group]) {
                        groups[group] = new Array();
                    }
                    var fragBuckets = groups[group];
                    if (!fragBuckets[bucketNum]) {
                        fragBuckets[bucketNum] = new List();
                    }
                    fragBuckets[bucketNum].addByPriority(view[frag_i], view[frag_i + 1]);
                }
                var sortedBuffer = new ArrayBuffer(count * 4);
                var sortedView = new Float32Array(sortedBuffer);
                var num = 0;
                for (var i = minGroup; i <= maxGroup; i++) {
                    if (groups[i]) {
                        var fragBuckets = groups[i];
                        for (var b = 0; b < fragBuckets.length; b++) {
                            if (fragBuckets[b]) {
                                var current = fragBuckets[b].head;
                                while (current) {
                                    sortedView[num] = current.data;
                                    num++;
                                    current = current.nxt;
                                }
                            }
                        }
                    }
                }
                self.postMessage({ buffer: sortedBuffer }, undefined, [sortedBuffer]);
                return;
            });
            break;
        case "" + UrchinWorker.LIGHTING:
            self.addEventListener('message', function (evt) {
                var buffer = evt.data.buffer, lightObj = evt.data.lights;
                var lights = new List();
                var current = lightObj.head;
                while (current) {
                    var light = Urbject.copy(current.data, { shallow: true, typeCheck: true });
                    lights.addFirst(light);
                    current = current.nxt;
                }
                var view = new Float32Array(buffer);
                var litBuffer = new ArrayBuffer(4 * view.length * LightingWorker.DATA_SIZE / LightingWorker.FRAG_SIZE);
                var litView = new Float32Array(litBuffer);
                for (var i = 0; i < view.length / LightingWorker.FRAG_SIZE; i++) {
                    var frag_i = i * LightingWorker.FRAG_SIZE, data_i = i * LightingWorker.DATA_SIZE;
                    var f_r = view[frag_i + 9], f_g = view[frag_i + 10], f_b = view[frag_i + 11], f_a = view[frag_i + 12], w_r = view[frag_i + 13], w_g = view[frag_i + 14], w_b = view[frag_i + 15], w_a = view[frag_i + 16], lit = view[frag_i + 17] > 0 ? true : false;
                    if (lit) {
                        var v0 = new Vector(view[frag_i + 0], view[frag_i + 1], view[frag_i + 2]), v1 = new Vector(view[frag_i + 3], view[frag_i + 4], view[frag_i + 5]), v2 = new Vector(view[frag_i + 6], view[frag_i + 7], view[frag_i + 8]);
                        var t = new Trigon(v0, v1, v2);
                        var mat = new Material({
                            fill: new Color(f_r, f_g, f_b, f_a),
                            wire: new Color(w_r, w_g, w_b, w_a),
                            lit: lit
                        });
                        var frag = new Fragment(t, mat, 0);
                        var litMat = Renderer.light(frag, lights);
                        var fragData = [
                            litMat.fill.r, litMat.fill.g, litMat.fill.b, litMat.fill.a,
                            litMat.wire.r, litMat.wire.g, litMat.wire.b, litMat.wire.a
                        ];
                        for (var n = 0; n < LightingWorker.DATA_SIZE; n++) {
                            litView[data_i + n] = fragData[n];
                        }
                    }
                    else {
                        for (var n = 0; n < LightingWorker.DATA_SIZE; n++) {
                            litView[data_i + n] = view[frag_i + 9 + n];
                        }
                    }
                }
                self.postMessage({ buffer: litBuffer }, undefined, [litBuffer]);
                return;
            });
            break;
        case "" + UrchinWorker.PROJECTING:
            self.addEventListener('message', function (evt) {
                var buffer = evt.data.buffer, camera = Camera.copy(evt.data.camera), width = evt.data.width, height = evt.data.height;
                var view = new Float32Array(buffer);
                var projected = new ArrayBuffer(4 * view.length * 2 / 3);
                var projectedView = new Float32Array(projected);
                for (var i = 0; i < view.length / 3; i++) {
                    var v = (new Vector(view[i * 3], view[i * 3 + 1], view[i * 3 + 2])).add(Vector.neg(camera.position));
                    v.quaternionRotate(Quaternion.conjugate(camera.orientation));
                    var screenPos = Renderer.project(v, camera.fov, width, height);
                    projectedView[i * 2] = screenPos.x;
                    projectedView[i * 2 + 1] = screenPos.y;
                }
                self.postMessage({ buffer: projected }, undefined, [projected]);
                return;
            });
            break;
        default:
            console.error("Worker type, \"" + self.name + "\", is not a valid type.");
            break;
    }
}
