/// <reference path="../../src/index.ts" />

/****************************************
 * Point to the current location of the library for our Web Workers to find it. Default is "/Urchin/Urchin.js"
 */

URCHIN_PATH = "../../Urchin.js";

window.addEventListener("load", function () {

    /****************************************
     * Make a Scene
     */

    let scene = new Scene();



    /****************************************
     * Make a Camera looking at the origin
     */

    let camera = new Camera({
        position: new Vector(-20, 0, 0)
    });



    /****************************************
     * Make some inter-linked rings
     */

    let ringSegments = new Array<Urbject>();

    let ring = Mesh.cylinder({
        innerRadius: 0.95,
        outerRadius: 1.05,
        height: 0.1,
        resolution: 16
    });
    let smallRing = Mesh.scale(ring, 0.75);

    let ringMat = new Material({ fill: new Color("white") });

    let centerRing = new MeshUrbject({
        position: new Vector(0, 0, 4),
        mesh: ring,
        material: ringMat
    });

    let outerRings = new Urbject({
        position: new Vector(0, 0, 4),
    });

    outerRings.addChild(new MeshUrbject({
        position: new Vector(0.6, 0, 0),
        orientation: Quaternion.fromAxisRotation(Vector.Y_AXIS, Num.rad(45)),
        mesh: smallRing,
        material: ringMat
    }));

    outerRings.addChild(new MeshUrbject({
        position: new Vector(-0.6, 0, 0),
        orientation: Quaternion.fromAxisRotation(Vector.Y_AXIS, Num.rad(-45)),
        mesh: smallRing,
        material: ringMat
    }));

    let numSegments = 12;
    for (let i = 0; i < numSegments; i++) {
        let innerLink = new Urbject();
        let outerLink = new Urbject();
        let innerRingSegment = centerRing.copy();
        let outerRingSegment = outerRings.copy();
        ringSegments.push(innerRingSegment);
        ringSegments.push(outerRingSegment);
        innerLink.addChild(innerRingSegment);
        outerLink.addChild(outerRingSegment);
        innerLink.orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, Num.rad((360.0 * i) / numSegments));
        outerLink.orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, Num.rad((360.0 * (i + 0.5)) / numSegments))
        scene.add(innerLink);
        scene.add(outerLink);
    }



    /****************************************
     * Add three Directional Lights that are all perpendicular to each other.
     */

    let lightRotation = Quaternion.fromVector(new Vector(1, -1, -1));

    scene.add(new DirectionalLight({
        color: new Color("yellow"),
        direction: Vector.xAxis().qRotate(lightRotation),
        brightness: 1
    }));
    scene.add(new DirectionalLight({
        color: new Color("aqua"),
        direction: Vector.yAxis().qRotate(lightRotation),
        brightness: 1
    }));
    scene.add(new DirectionalLight({
        color: new Color("fuchsia"),
        direction: Vector.zAxis().qRotate(lightRotation),
        brightness: 1
    }));




    /****************************************
     * Create a FocalPointController
     */

    let canvas = <HTMLCanvasElement>document.getElementById("focal-point-controller-canvas") || undefined;

    let controller = new FocalPointController({
        focalPoint: new Vector(0, 0, 0),
        friction: 0.03,
        minDist: 5,
        maxDist: 30,
        zoomMultiplier: 1,
        controlFace: canvas || window
    });





    /****************************************
     * Create a Stats object to time each render frame.
     */

    let timer = new Stats();




    /****************************************
     * Create a callback function that will be called each frame
     */

    let draw = function () {
        let t = timer.readTimer() / 1000.0;




        /****************************************
         * Rotate each of the ring segments around their local Y-axis by 45 degrees per second.
         */

        for (let i = 0; i < ringSegments.length; i++) {
            ringSegments[i].orientation.rotateY(Num.rad(45) * t);
        }




        /****************************************
         * Move the camera with the FocalPointController
         */

        controller.move(camera);




        timer.startTimer();

    }




    /****************************************
     * Make a PerformanceRenderer with a callback to draw() on each frame.
     * Set the background to a nearly-transparent color to add a "blur" effect.
     */

    let renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color(0, 0.05)
    });




    /* [IGNORE] CODE FOR EXAMPLE PAGE */
    if (canvas) {
        canvas.addEventListener("mouseover", function () { timer.startTimer(); renderer.start(scene, camera); });
        canvas.addEventListener("mouseleave", function () { renderer.stop(); });
    }
    /* --------------------- */




    /****************************************
     * Start the animation
     */

    if (!canvas) {
        renderer.start(scene, camera);
    } else {
        /* [IGNORE] CODE FOR EXAMPLE PAGE */
        renderer.render(scene, camera);
        /* --------------------- */
    }
});