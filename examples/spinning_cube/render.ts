/// <reference path="../../src/index.ts" />

window.addEventListener("load", function () {

    /****************************************
     * Point to the current location of the library for our Web Workers to find it. Default is "/Urchin/Urchin.js"
     */

    URCHIN_PATH = "../../Urchin.js";




    /****************************************
     * Make a Scene
     */

    let scene = new Scene();



    /****************************************
     * Make a Camera looking at the origin
     */

    let camera = new Camera({
        position: new Vector(-10, 0, 0),
        fov: 14
    });



    /****************************************
     * Make a MeshUrbject with a cube as the mesh located at the origin.
     * Rotate the mesh 45deg around the XYZ axis
     */

    let cube = new MeshUrbject({
        mesh: Mesh.cube().rotateAxis(new Vector(1, 1, 1), Math.PI / 4),
        material: new Material({ fill: new Color(0, 100, 50) }),
    });
    scene.add(cube);



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
         * Interpolate the cube's orientation around the Z-Axis
         */

        let angleZ = Interpolate.range(animTime, 0, Math.PI * 6, Interpolate.EASE),
            angleXY = Interpolate.range(animTime, 0, Math.PI * 2, Interpolate.LINEAR);

        cube.orientation = Quaternion.fromAxisRotation(Vector.Z_AXIS, angleZ).rotateAxis(new Vector(1, 1, 0), angleXY);



        timer.startTimer();

    }




    /****************************************
     * Make a PerformanceRenderer with a callback to draw() on each frame.
     */

    let canvas = <HTMLCanvasElement>document.getElementById("spinning-cube-canvas") || undefined;

    let renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color()
    });




    /****************************************
     * Change color of cube on canvas click
     */

    (canvas || document.querySelector("canvas")).addEventListener("click", function () {
        let color = cube.material.fill;
        let hue = color.h + 60;
        if (hue > 360) hue -= 360;
        cube.material.setColor(new Color(hue, color.s, color.l));
    });



    /****************************************
     * Start the animation
     */

    renderer.start(scene, camera);
});