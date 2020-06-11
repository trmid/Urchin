window.addEventListener("load", function () {
    URCHIN_PATH = "../../Urchin.js";
    var scene = new Scene();
    var camera = new Camera();
    var ring = Mesh.cylinder({
        innerRadius: 0.95,
        outerRadius: 1.05,
        height: 0.1,
        resolution: 24
    });
    var silver = new Material({ fill: new Color("silver") });
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
    scene.add(new DirectionalLight());
    scene.add(new AmbientLight());
    var canvas = document.getElementById("focal-point-controller-canvas") || undefined;
    var controller = new FocalPointController({
        focalPoint: new Vector(0, 0, 0),
        friction: 0.05,
        controlFace: canvas || window
    });
    var draw = function () {
        controller.move(camera);
    };
    var renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color("white")
    });
    if (canvas) {
        canvas.addEventListener("mouseover", function () { renderer.start(scene, camera); });
        canvas.addEventListener("mouseleave", function () { renderer.stop(); });
    }
    if (!canvas) {
        renderer.start(scene, camera);
    }
    else {
        renderer.render(scene, camera);
    }
});
