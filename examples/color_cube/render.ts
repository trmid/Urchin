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
     * Make a Camera looking up at the origin
     * 
     * Note: All object orientations are handled with Quaternions with Urchin.
     * 
     * If you want to obtain a Euler Angle rotation, simply start with a new Quaternion() and then use the folowing functions:
     * 
     *      - .rotateX()
     *      - .rotateY()
     *      - .rotateZ()
     * 
     * 
     * If you want to rotate around a defined axis, use:
     * 
     *      - .rotateAxis()
     *          OR
     *      - Quaternion.fromAxisRotation()
     */

    let camera = new Camera({
        position: new Vector(-3, -3, -3),
        orientation: new Quaternion()
            .rotateY(-Math.asin(Math.sqrt(1 / 3.0)))
            .rotateZ(Math.PI / 4)
    });



    /****************************************
     * Make a MeshUrbject with a cube as the mesh located at the origin
     */

    let cube = new MeshUrbject({
        mesh: Mesh.cube(),
        material: new Material({ fill: new Color("white") }),
    });
    scene.add(cube);



    /****************************************
     * Add 3 directional lights to the scene, each facing down a different axis
     */

    // RED
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("red"),
        direction: Vector.axis(Vector.X_AXIS)
    }));

    // GREEN
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("lime"),
        direction: Vector.axis(Vector.Y_AXIS)
    }));

    // BLUE
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("blue"),
        direction: Vector.axis(Vector.Z_AXIS)
    }));



    /****************************************
     * Create a Stats object that can be used to get the elapsed time of each frame
     */

    let timer = new Stats();



    /****************************************
     * Create a callback function that will be called each frame
     */

    let animTime = 0, startAngle = 0;
    let draw = function () {

        let t = timer.readTimer() / 1000.0;



        /****************************************
         * Loop animTime from 0 to 1 every 3 seconds
         * Each loop, switch the startAngle between 0 and Math.PI
         */

        animTime += t / 3;
        if (animTime >= 1) {
            animTime = 0;
            startAngle = startAngle ? 0 : Math.PI;
        }



        /******************************************
         * Interpolate the cube's orientation around the (i + j + k) axis
         */

        let angle = Interpolate.range(animTime, startAngle, startAngle + Math.PI, Interpolate.EASE);
        cube.orientation = Quaternion.fromAxisRotation(new Vector(1, 1, 1), angle);



        timer.startTimer();

    }




    /****************************************
     * Make a PerformanceRenderer with a callback to draw() on each frame.
     * Add a nearly-transparent background to add a "motion blur" effect.
     * 
     * NOTE: We don't have to use requestAnimationFrame() when using PerformanceRenderer.start()
     */

    let canvas = <HTMLCanvasElement>document.getElementById("color-cube-canvas") || undefined;

    let renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color(0, 0.002)
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