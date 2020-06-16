/// <reference path="./Controller.ts" />
/// <reference path="./Interpolate.ts" />
/// <reference path="./Camera.ts" />
/// <reference path="./Stats.ts" />

class FocalPointController extends Controller {

    controlFace: HTMLElement | Window;
    sensitivity: number;
    friction: number;
    zoomMultiplier: number;
    focalPoint: Vector;
    minDist: number;
    maxDist: number;

    private velocity = new Vector();
    private dist: number;
    private dMouse = new Vector();
    private mousePressed: boolean;
    private timer: Stats;

    constructor({
        sensitivity = 1,
        friction = 0.1,
        zoomMultiplier = 1,
        focalPoint = new Vector(),
        minDist = 1,
        maxDist = 20,
        controlFace = window
    }: {
        sensitivity?: number,
        friction?: number,
        zoomMultiplier?: number,
        focalPoint?: Vector,
        minDist?: number,
        maxDist?: number,
        controlFace?: HTMLElement | Window
    } = {}) {
        super(Controller.FOCAL_POINT);
        this.sensitivity = sensitivity;
        this.friction = Num.constrain(friction, 0, 1);
        this.zoomMultiplier = zoomMultiplier;
        this.focalPoint = focalPoint;
        this.minDist = minDist;
        this.maxDist = maxDist;
        this.controlFace = controlFace;
        this.timer = new Stats();

        // Setup
        var controller = this;
        controlFace.addEventListener("mousedown", function (e: MouseEvent) { controller.mouseDown(e); });
        controlFace.addEventListener("mouseup", function (e: MouseEvent) { controller.mouseUp(e); });
        controlFace.addEventListener("mousemove", function (e: MouseEvent) { controller.mouseMove(e); });
        controlFace.addEventListener("wheel", function (e: WheelEvent) { controller.wheel(e); });

    }

    move(camera: Camera) {

        let t = this.timer.readTimer() / 1000.0;

        if (this.dMouse.mag()) {
            this.velocity = this.dMouse.div(t * 100).mult(this.sensitivity);
            this.dMouse = new Vector();
        }

        let pos = Vector.sub(camera.position, this.focalPoint);

        if (this.dist === undefined) {
            this.dist = pos.mag();
        }

        let XYAxis = new Vector(pos.x, pos.y, 0).normalize().rotateZ(Math.PI / 2);
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

        let diff = Vector.sub(this.focalPoint, camera.position),
            diffXY = new Vector(diff.x, diff.y, 0),
            diffZ = new Vector(diffXY.mag(), 0, diff.z);

        camera.orientation = Quaternion.fromVector(diffZ).rotateZ(diffXY.angleBetween(Vector.axis(Vector.X_AXIS)) * (diffXY.y > 0 ? 1 : -1));

        this.velocity.mult(1 - this.friction);

        this.timer.startTimer();

    }

    mouseDown(e: MouseEvent) {
        this.mousePressed = true;
    }

    mouseUp(e: MouseEvent) {
        this.mousePressed = false;
    }

    mouseMove(e: MouseEvent) {
        if (this.mousePressed) {
            this.dMouse.x += e.movementX;
            this.dMouse.y += e.movementY;
        }
    }

    wheel(e: WheelEvent) {
        if (e.deltaY) {
            let zoomDir = Num.getSign(e.deltaY);
            this.dist = Num.constrain(this.dist + zoomDir * this.zoomMultiplier, this.minDist || 0.001, this.maxDist);
        }
    }

}