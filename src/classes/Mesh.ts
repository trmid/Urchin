/// <reference path="./Trigon.ts" />
/// <reference path="./Quaternion.ts" />
/// <reference path="./Vector.ts" />

class Mesh {

    public trigons: Array<Trigon>;

    constructor() {
        this.trigons = new Array<Trigon>();
    }

    rotateAxis(axis: number | Vector, angle: number) {
        for (let i = 0; i < this.trigons.length; i++) {
            this.trigons[i].rotateAxis(axis, angle);
        }
        return this;
    }

    rotateX(angle: number) {
        return this.rotateAxis(Vector.X_AXIS, angle);
    }

    rotateY(angle: number) {
        return this.rotateAxis(Vector.Y_AXIS, angle);
    }

    rotateZ(angle: number) {
        return this.rotateAxis(Vector.Z_AXIS, angle);
    }

    qRotate(q: Quaternion) {
        return this.quaternionRotate(q);
    }

    quaternionRotate(q: Quaternion) {
        for (let i = 0; i < this.trigons.length; i++) {
            this.trigons[i].quaternionRotate(q);
        }
        return this;
    }

    translate(v: Vector) {
        for (let i = 0; i < this.trigons.length; i++) {
            this.trigons[i].translate(v);
        }
        return this;
    }

    transform(M: Array<Array<number>>) {
        for (let i = 0; i < this.trigons.length; i++) {
            this.trigons[i].transform(M);
        }
        return this;
    }

    scale(s: number | Vector) {
        for (let i = 0; i < this.trigons.length; i++) {
            this.trigons[i].scale(s);
        }
        return this;
    }

    addTrigon(t: Trigon | Array<Trigon>) {
        if (Array.isArray(t)) {
            for (let i = 0; i < t.length; i++) {
                this.trigons.push(t[i].copy());
            }
        } else {
            this.trigons.push(t.copy());
        }
        return t;
    }

    generateFromArrayData(v: Array<number>) {
        // Increment by 9 since there are 9 values per trigon (3 vertices)
        for (let i = 0; i < v.length; i += 9) {
            let t = new Trigon(
                new Vector(v[i + 0], v[i + 1], v[i + 2]),
                new Vector(v[i + 3], v[i + 4], v[i + 5]),
                new Vector(v[i + 6], v[i + 7], v[i + 8])
            );
            this.addTrigon(t);
        }
        return this;
    }

    inverseNormals() {
        for (let i = 0; i < this.trigons.length; i++) {
            let t = this.trigons[i];
            this.trigons[i] = new Trigon(t.v1, t.v0, t.v2);
        }
        return this;
    }

    copy() {
        let copy = new Mesh();
        for (let i = 0; i < this.trigons.length; i++) {
            copy.addTrigon(this.trigons[i].copy());
        }
        return copy;
    }

    static rotateAxis(m: Mesh, axis: number, angle: number) {
        return m.rotateAxis(axis, angle);
    }

    static rotateX(m: Mesh, angle: number) {
        return m.copy().rotateX(angle);
    }

    static rotateY(m: Mesh, angle: number) {
        return m.copy().rotateY(angle);
    }

    static rotateZ(m: Mesh, angle: number) {
        return m.copy().rotateZ(angle);
    }

    static qRotate(m: Mesh, q: Quaternion) {
        return m.copy().qRotate(q);
    }

    static quaternionRotate(m: Mesh, q: Quaternion) {
        return m.copy().quaternionRotate(q);
    }

    static translate(m: Mesh, v: Vector) {
        return m.copy().translate(v);
    }

    static transform(m: Mesh, M: Array<Array<number>>) {
        return m.copy().transform(M);
    }

    static scale(m: Mesh, s: number | Vector) {
        return m.copy().scale(s);
    }

    static addTrigon(m: Mesh, t: Trigon | Array<Trigon>) {
        return m.addTrigon(t);
    }

    static generateFromArrayData(v: Array<number>) {
        let m = new Mesh();
        return m.generateFromArrayData(v);
    }

    static inverseNormals(m: Mesh) {
        return m.copy().inverseNormals();
    }

    static copy(m: Mesh) {
        let copy = new Mesh();
        for (let i = 0; i < m.trigons.length; i++) {
            copy.addTrigon(Trigon.copy(m.trigons[i]));
        }
        return copy;
    }

    static plane() {
        let plane = new Mesh();
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
    }

    static cube() {
        let cube = new Mesh();

        let p = [
            [0, 0, 0], //0
            [0, 0, 1], //1
            [0, 1, 0], //2
            [0, 1, 1], //3
            [1, 0, 0], //4
            [1, 0, 1], //5
            [1, 1, 0], //6
            [1, 1, 1]  //7
        ];

        let vectorPoints = [
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

        let vectorArray = new Array();
        for (let i = 0; i < vectorPoints.length; i++) {
            let point = p[vectorPoints[i]];
            vectorArray.push(point[0]);
            vectorArray.push(point[1]);
            vectorArray.push(point[2]);
        }

        cube.generateFromArrayData(vectorArray);

        // Translate cube to center
        cube.translate(new Vector(-0.5, -0.5, -0.5));

        return cube;
    }

    static circle(options: { resolution?: number, radius?: number } = {}) {
        if (options.resolution === undefined) options.resolution = 16;
        if (options.radius === undefined) options.radius = 0.5;
        if (options.resolution < 3) options.resolution = 3;
        let circle = new Mesh();
        let angle = 0;
        let step = (Math.PI * 2) / options.resolution;
        for (let i = 0; i < options.resolution; i++) {
            let t = new Trigon(
                new Vector(),
                (new Vector(Math.cos(angle), Math.sin(angle), 0)).mult(options.radius),
                (new Vector(Math.cos(angle + step), Math.sin(angle + step), 0)).mult(options.radius)
            );
            circle.addTrigon(t);
            angle += step;
        }
        return circle;
    }

    static cylinder(options: { resolution?: number, outerRadius?: number, innerRadius?: number, height?: number } = {}) {
        if (options.resolution === undefined) options.resolution = 6;
        if (options.innerRadius === undefined) options.innerRadius = 0;
        if (options.outerRadius === undefined) options.outerRadius = 0.5;
        if (options.height === undefined) options.height = 1;

        let res = options.resolution < 3 ? 3 : options.resolution;
        let outR = options.outerRadius;
        let inR = options.innerRadius;
        let hasCenter = inR != 0;
        let hasEnds = outR != inR;
        let h = options.height;
        let hasSides = h != 0;

        let cylinder = new Mesh();
        let angle = 0;
        let step = (Math.PI * 2) / res;
        for (let i = 0; i < res; i++) {
            let c0 = new Vector(Math.cos(angle), Math.sin(angle), 1),
                c1 = new Vector(Math.cos(angle + step), Math.sin(angle + step), 1);
            let p = [
                Vector.mult(c0, new Vector(outR, outR, h / 2.0)),   //0
                Vector.mult(c1, new Vector(outR, outR, h / 2.0)),   //1
                Vector.mult(c0, new Vector(inR, inR, h / 2.0)),     //2
                Vector.mult(c1, new Vector(inR, inR, h / 2.0)),     //3
                Vector.mult(c0, new Vector(outR, outR, -h / 2.0)),  //4
                Vector.mult(c1, new Vector(outR, outR, -h / 2.0)),  //5
                Vector.mult(c0, new Vector(inR, inR, -h / 2.0)),    //6
                Vector.mult(c1, new Vector(inR, inR, -h / 2.0))     //7
            ];
            let ends = [
                new Trigon(p[0], p[1], p[2]),
                new Trigon(p[2], p[1], p[3]),
                new Trigon(p[5], p[4], p[6]),
                new Trigon(p[5], p[6], p[7])
            ]
            let outer = [
                new Trigon(p[0], p[4], p[5]),
                new Trigon(p[5], p[1], p[0])
            ];
            let inner = [
                new Trigon(p[2], p[3], p[7]),
                new Trigon(p[7], p[6], p[2])
            ];
            if (hasEnds) {
                cylinder.addTrigon(ends);
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

    }

    static sphere(options: { resolution?: number, radius?: number } = {}) {
        if (options.resolution === undefined) options.resolution = 3;
        if (options.radius === undefined) options.radius = 0.5;
        if (options.resolution < 1) options.resolution = 1;

        let sphere = new Mesh();

        let t = (1 + Math.sqrt(5)) / 2;
        let p = [
            [-1, 0, t],   //0
            [1, 0, t],    //1
            [-1, 0, -t],  //2
            [1, 0, -t],   //3
            [0, -t, -1],  //4
            [0, -t, 1],   //5
            [0, t, -1],   //6
            [0, t, 1],    //7
            [t, 1, 0],    //8
            [t, -1, 0],   //9
            [-t, 1, 0],   //10
            [-t, -1, 0]   //11
        ];

        let vectorPoints = [
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

        let vectorArray = new Array();
        for (let i = 0; i < vectorPoints.length; i++) {
            let point = p[vectorPoints[i]];
            let v = (new Vector(point[0], point[1], point[2])).normalize();
            vectorArray.push(v.x);
            vectorArray.push(v.y);
            vectorArray.push(v.z);
        }

        // Generate initial Ico Sphere Mesh
        sphere.generateFromArrayData(vectorArray);

        if (options.resolution > 1) {
            // Iteratively Refine Ico Sphere resolution
            for (let i = 1; i < options.resolution; i++) {
                // Store current trigons and clear mesh
                let trigons = sphere.trigons;
                sphere.trigons = new Array<Trigon>();

                for (let n = 0; n < trigons.length; n++) {
                    let t = trigons[n];
                    let m01 = ((Vector.add(t.v0, t.v1)).div(2)).normalize();
                    let m12 = ((Vector.add(t.v1, t.v2)).div(2)).normalize();
                    let m20 = ((Vector.add(t.v0, t.v2)).div(2)).normalize();

                    let t0 = new Trigon(t.v0, m01, m20);
                    let t1 = new Trigon(m01.copy(), t.v1, m12);
                    let t2 = new Trigon(m20.copy(), m12.copy(), t.v2);
                    let t3 = new Trigon(m01.copy(), m12.copy(), m20.copy());

                    sphere.addTrigon([t0, t1, t2, t3]);
                }
            }
        }

        sphere.scale(options.radius);
        return sphere;
    }
}