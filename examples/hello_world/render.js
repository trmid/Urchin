window.addEventListener("load", function () {
    var scene = new Scene();
    var camera = new Camera();
    var cube = new MeshUrbject({
        mesh: Mesh.cube(),
        material: new Material({ fill: new Color("red") }),
        orientation: Quaternion.fromAxisRotation(new Vector(1, 1, 1), Math.PI / 4)
    });
    scene.add(cube);
    scene.add(new AmbientLight());
    scene.add(new DirectionalLight());
    var canvas = document.getElementById("hello-world-canvas") || undefined;
    var renderer = new Renderer({
        canvas: canvas
    });
    renderer.render(scene, camera);
});
