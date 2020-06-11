class Interpolate {
    static EASE_OUT = 0;
    static EASE_IN = 1;
    static EASE = 2;
    static LINEAR = 3;

    static range(t: number, startValue: number, endValue: number, type = Interpolate.LINEAR) {
        if (t <= 0) return startValue;
        if (t >= 1) return endValue;
        let diff = endValue - startValue;
        switch (type) {
            case Interpolate.EASE_IN:
                return (startValue + diff * t * t);
            case Interpolate.EASE_OUT:
                return (startValue + diff * (1 - (1 - t) * (1 - t)));
            case Interpolate.EASE:
                return (startValue + diff * (t < 0.5 ? 2 * t * t : 1 - 2 * Math.pow((1 - t), 2)));
            case Interpolate.LINEAR:
                return (startValue + diff * t);
        }
    }
}