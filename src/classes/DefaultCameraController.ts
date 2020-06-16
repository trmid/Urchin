/// <reference path="./Controller.ts" />
/// <reference path="./Interpolate.ts" />
/// <reference path="./Camera.ts" />

class DefaultCameraController extends Controller {

    minSpeed: number;
    maxSpeed: number;
    accelerationTime: number; // seconds to reach max speed
    accelerationType: number;
    controlFace: HTMLElement | Window;

    private u: boolean;
    private d: boolean;
    private l: boolean;
    private r: boolean;
    private f: boolean;
    private b: boolean;
    private x = 0;
    private y = 0;
    private dFov = 0;
    private mousePressed: boolean;
    private speed: number;
    private startMove: number;
    private lastMove: number;

    constructor({
        minSpeed = 0.5,
        maxSpeed = 2,
        accelerationTime = 1.0,
        accelerationType = Interpolate.EASE_OUT,
        controlFace = window
    }: {
        minSpeed?: number,
        maxSpeed?: number,
        accelerationTime?: number,
        accelerationType?: number,
        controlFace?: HTMLElement | Window
    } = {}) {
        super(Controller.DEFAULT_CAMERA);
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.accelerationTime = accelerationTime;
        this.accelerationType = accelerationType;
        this.controlFace = controlFace;

        // Setup
        var controller = this;
        controlFace.addEventListener("mousedown", function (e: MouseEvent) { controller.mouseDown(e); });
        controlFace.addEventListener("mouseup", function (e: MouseEvent) { controller.mouseUp(e); });
        controlFace.addEventListener("mousemove", function (e: MouseEvent) { controller.mouseMove(e); });
        controlFace.addEventListener("wheel", function (e: WheelEvent) { controller.wheel(e); });
        controlFace.addEventListener("keydown", function (e: KeyboardEvent) { controller.keyDown(e); });
        controlFace.addEventListener("keyup", function (e: KeyboardEvent) { controller.keyUp(e); });

        this.lastMove = performance.now();
    }

    move(camera: Camera) {

        let now = performance.now();
        let elapsedTime = now - this.lastMove;
        this.lastMove = now;

        /**
         * FOV
         */

        camera.fov = Num.constrain(camera.fov + this.dFov, 1, 180);
        this.dFov = 0;

        /**
         * ROTATION
         */

        let fov = camera.fov || 60;
        let delta = new Vector(-this.x, this.y, 0);
        let dir = Vector.qRotate(new Vector(1, 0, 0), camera.orientation);
        let dirXY = new Vector(dir.x, dir.y, 0);
        let xyMag = dirXY.mag();
        let xDelta = (xyMag * delta.x * Math.PI / 1000.0) * fov / 120.0;
        let xAngle = xDelta + dirXY.angleBetween(new Vector(1, 0, 0)) * (dir.y < 0 ? -1 : 1);
        let yDelta = (delta.y * Math.PI / 1000.0) * fov / 120.0;;
        let yAngle = yDelta + dir.angleBetween(dirXY) * (dir.z < 0 ? 1 : -1);

        // Ensure vertical look angle cannot move passed looking straight down or up
        yAngle = Num.constrain(yAngle, -Math.PI / 2.01, Math.PI / 2.01);
        dirXY.rotateZ(Math.PI / 2);

        let newOrientation = (new Quaternion(1, 0, 0, 0))
            .rotateZ(xAngle)
            .rotateAxis(dirXY, yAngle);

        camera.orientation = newOrientation;
        this.x = 0;
        this.y = 0;

        /**
         * MOVEMENT
         */

        let moving = (this.u || this.d || this.l || this.r || this.f || this.b);
        if (moving) {
            if (!this.startMove) {
                this.startMove = now;
            }
            let timeSinceStart = now - this.startMove;
            this.speed = timeSinceStart == 0 ?
                this.minSpeed :
                this.getSpeed(timeSinceStart);

            let movement = (new Vector((this.f ? 1 : 0) + (this.b ? -1 : 0), (this.l ? 1 : 0) + (this.r ? -1 : 0), (this.u ? 1 : 0) + (this.d ? -1 : 0))).normalize().mult(this.speed * elapsedTime / 100.0);
            movement.qRotate(camera.orientation);
            camera.position.add(movement);
        } else {
            this.startMove = undefined;
        }


    }

    private getSpeed(t: number) {
        t = (t / 1000.0) / this.accelerationTime;
        return Interpolate.range(t, this.minSpeed, this.maxSpeed, this.accelerationType);
    }

    mouseDown(e: MouseEvent) {
        this.mousePressed = true;
    }

    mouseUp(e: MouseEvent) {
        this.mousePressed = false;
    }

    mouseMove(e: MouseEvent) {
        if (this.mousePressed) {
            this.x += e.movementX;
            this.y += e.movementY;
        }
    }

    wheel(e: WheelEvent) {
        if (e.deltaY) {
            let zoomDir = Num.getSign(e.deltaY);
            this.dFov = zoomDir * 5.0;
        }
    }

    keyDown(e: KeyboardEvent) {
        // let time = e.timeStamp;
        switch (e.key.toUpperCase()) {
            case 'W': this.f = true; break;
            case 'A': this.l = true; break;
            case 'S': this.b = true; break;
            case 'D': this.r = true; break;
            case 'Q': this.d = true; break;
            case 'E': this.u = true; break;
        }
    }

    keyUp(e: KeyboardEvent) {
        switch (e.key.toUpperCase()) {
            case 'W': this.f = false; break;
            case 'A': this.l = false; break;
            case 'S': this.b = false; break;
            case 'D': this.r = false; break;
            case 'Q': this.d = false; break;
            case 'E': this.u = false; break;
        }
    }
}