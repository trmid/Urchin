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

    let camera = new Camera();



    /****************************************
     * Make some inter-linked rings
     */

    let ring = Mesh.cylinder({
        innerRadius: 0.95,
        outerRadius: 1.05,
        height: 0.1,
        resolution: 24
    });

    let silver = new Material({ fill: new Color("silver") });

    scene.add(new MeshUrbject({
        position: new Vector(),
        orientation: Quaternion.fromAxisRotation(Vector.Y_AXIS, Math.PI / 2),
        mesh: ring,
        material: silver
    }));

    scene.add(new MeshUrbject({
        position: new Vector(0, 1.5, 0),
        orientation: new Quaternion().rotateY(1),
        mesh: ring,
        material: silver
    }));

    scene.add(new MeshUrbject({
        position: new Vector(0, -1.5, 0),
        orientation: new Quaternion().rotateY(-1),
        mesh: ring,
        material: silver
    }));

    scene.add(new MeshUrbject({
        position: new Vector(0, 0, 1.5),
        orientation: Quaternion.fromAxisRotation(Vector.X_AXIS, Math.PI / 2).rotateZ(-1),
        mesh: ring,
        material: silver
    }));

    scene.add(new MeshUrbject({
        position: new Vector(0, 0, -1.5),
        orientation: Quaternion.fromAxisRotation(Vector.X_AXIS, Math.PI / 2).rotateZ(1),
        mesh: ring,
        material: silver
    }));




    /****************************************
     * Add a Directional Light and an Ambient Light
     */

    scene.add(new DirectionalLight());
    scene.add(new AmbientLight());




    /****************************************
     * Create a FocalPointController
     */

    let canvas = <HTMLCanvasElement>document.getElementById("focal-point-controller-canvas") || undefined;

    let controller = new FocalPointController({
        focalPoint: new Vector(0, 0, 0),
        friction: 0.05,
        controlFace: canvas || window
    });



    /****************************************
     * Create a callback function that will be called each frame
     */

    let draw = function () {

        controller.move(camera);

    }




    /****************************************
     * Make a PerformanceRenderer with a callback to draw() on each frame.
     */

    let renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color("white")
    });




    /* [IGNORE] CODE FOR EXAMPLE PAGE */
    if (canvas) {
        canvas.addEventListener("mouseover", function () { renderer.start(scene, camera); });
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