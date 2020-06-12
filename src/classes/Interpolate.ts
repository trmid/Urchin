class Interpolate {
    static EASE = 0;
    static EASE_IN = 1;
    static EASE_OUT = 2;
    static LINEAR = 3;

    static range(t: number, start: number, end: number, type = Interpolate.LINEAR) {
        if (t <= 0) return start;
        if (t >= 1) return end;
        let diff = end - start;
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
    }
}