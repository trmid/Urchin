window.addEventListener("load", function () {
    URCHIN_PATH = "../../Urchin.js";
    var scene = new Scene();
    var camera = new Camera({
        position: new Vector(-3, -3, -3),
        orientation: new Quaternion()
            .rotateY(-Math.asin(Math.sqrt(1 / 3.0)))
            .rotateZ(Math.PI / 4)
    });
    var cube = new MeshUrbject({
        mesh: Mesh.cube(),
        material: new Material({ fill: new Color("white") })
    });
    scene.add(cube);
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("red"),
        direction: Vector.axis(Vector.X_AXIS)
    }));
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("lime"),
        direction: Vector.axis(Vector.Y_AXIS)
    }));
    scene.add(new DirectionalLight({
        brightness: 2,
        color: new Color("blue"),
        direction: Vector.axis(Vector.Z_AXIS)
    }));
    var timer = new Stats();
    var animTime = 0, startAngle = 0;
    var draw = function () {
        var t = timer.readTimer() / 1000.0;
        animTime += t / 3;
        if (animTime >= 1) {
            animTime = 0;
            startAngle = startAngle ? 0 : Math.PI;
        }
        var angle = Interpolate.range(animTime, startAngle, startAngle + Math.PI, Interpolate.EASE);
        cube.orientation = Quaternion.fromAxisRotation(new Vector(1, 1, 1), angle);
        timer.startTimer();
    };
    var canvas = document.getElementById("color-cube-canvas") || undefined;
    var renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color(0, 0.002)
    });
    if (canvas) {
        canvas.addEventListener("mouseover", function () { renderer.start(scene, camera); timer.startTimer(); });
        canvas.addEventListener("mouseleave", function () { renderer.stop(); });
    }
    if (!canvas) {
        renderer.start(scene, camera);
    }
    else {
        renderer.render(scene, camera);
    }
});
