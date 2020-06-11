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
        position: new Vector(-10, 0, 0),
        fov: 22
    });



    /****************************************
     * Make a custom Mesh by taking each point on 3 different spheres and adding a triangle between them.
     */

    let urchinMesh = new Mesh();

    // Create the inside sphere
    let c0 = Mesh.sphere({ resolution: 3, radius: 0.1 });
    // Create a duplicate sphere, rotated 0.3 radians around the Z-Axis
    let c1 = Mesh.rotateZ(c0, 0.3);
    // Create a larger sphere (Where the urchin spines will end)
    let c2 = Mesh.scale(c0, 10);

    // Add the inner shere for a solid center for the urchin
    urchinMesh.addTrigon(c0.trigons);

    // Add the spines (double-faced)
    for (let i = 0; i < c0.trigons.length; i++) {
        let t = new Trigon(c0.trigons[i].v0, c1.trigons[i].v0, c2.trigons[i].v0);
        let tInv = new Trigon(t.v0, t.v2, t.v1);
        urchinMesh.addTrigon([t, tInv]);
    }

    // Create the Urbject
    let urchin = new MeshUrbject({
        mesh: urchinMesh,
        material: new Material({ fill: new Color(20) })
    });
    scene.add(urchin);



    /****************************************
     * Add a Directional Light and an Ambient Light
     */

    scene.add(new DirectionalLight());
    scene.add(new AmbientLight());



    /****************************************
     * Create a Stats object that can be used to get the elapsed time of each frame
     */

    let timer = new Stats();



    /****************************************
     * Create a callback function that will be called each frame
     */

    let animTime = 0;
    let draw = function () {

        let t = timer.readTimer() / 1000.0;



        /****************************************
         * Loop animTime from 0 to 1 every 8 seconds
         */

        animTime += t / 6;
        if (animTime >= 1) animTime = 0;



        /******************************************
         * Interpolate the urchin's orientation around the Z-Axis
         */

        let angleZ = Interpolate.range(animTime, 0, Math.PI * 6, Interpolate.EASE),
            angleXY = Interpolate.range(animTime, 0, Math.PI * 2, Interpolate.LINEAR);

        urchin.orientation = Quaternion.fromAxisRotation(Vector.Z_AXIS, angleZ).rotateAxis(new Vector(1, 1, 0), angleXY);



        timer.startTimer();

    }




    /****************************************
     * Make a PerformanceRenderer with a callback to draw() on each frame.
     */

    let canvas = <HTMLCanvasElement>document.getElementById("urchin-canvas") || undefined;

    let renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color("white")
    });



    /* [IGNORE] CODE FOR EXAMPLE PAGE */
    if (canvas) {
        canvas.addEventListener("mouseover", function () { renderer.start(scene, camera); timer.startTimer(); });
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