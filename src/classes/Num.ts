class Num {
    static getSign(a: number) {
        if (a == 0) return 1;
        return (a / Math.abs(a));
    }

    static constrain(val: number, low: number, high: number) {
        if (val < low) return low;
        if (val > high) return high;
        return val;
    }

    static byteToFloat(b3: number, b2: number, b1: number, b0: number) {
        var data = [b0, b1, b2, b3];
        // Create a buffer
        var buf = new ArrayBuffer(4);
        // Create a data view of it
        var view = new DataView(buf);
        // set bytes
        data.forEach(function (b, idx) {
            view.setUint8(idx, b);
        });
        return view.getFloat32(0);
    }

    static avg(a: Array<number>) {
        let total = 0;
        for (let i = 0; i < a.length; i++) {
            total += a[i];
        }
        return total / a.length;
    }

    static rad(deg: number) {
        return deg * Math.PI / 180.0;
    }

    static deg(rad: number) {
        return rad * 180.0 / Math.PI;
    }
}