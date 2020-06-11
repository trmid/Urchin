/// <reference path="../../src/index.ts" />

window.addEventListener("load", function () {

    /****************************************
     * Make a Scene
     */

    let scene = new Scene();



    /****************************************
     * Make a Camera looking down the x-axis
     */

    let camera = new Camera();



    /****************************************
     * Make a MeshUrbject with a cube as the mesh located at the origin
     */

    let cube = new MeshUrbject({
        mesh: Mesh.cube(),
        material: new Material({ fill: new Color("red") }),
        orientation: Quaternion.fromAxisRotation(new Vector(1, 1, 1), Math.PI / 4)
    });
    scene.add(cube);



    /****************************************
     * Add an Ambient Light and a Directional Light to the scene
     */

    scene.add(new AmbientLight());
    scene.add(new DirectionalLight());



    /****************************************
     * Make a Renderer to render the scene
     */

    let canvas = <HTMLCanvasElement>document.getElementById("hello-world-canvas") || undefined;

    let renderer = new Renderer({
        canvas: canvas,
    });


    /****************************************
     * Render the scene
     */

    renderer.render(scene, camera);

});