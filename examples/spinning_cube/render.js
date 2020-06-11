URCHIN_PATH = "../../Urchin.js";
window.addEventListener("load", function () {
    var scene = new Scene();
    var camera = new Camera({
        position: new Vector(-10, 0, 0),
        fov: 14
    });
    var cube = new MeshUrbject({
        mesh: Mesh.cube().rotateAxis(new Vector(1, 1, 1), Math.PI / 4),
        material: new Material({ fill: new Color(0, 100, 50) })
    });
    scene.add(cube);
    scene.add(new DirectionalLight());
    scene.add(new AmbientLight());
    var timer = new Stats();
    var animTime = 0;
    var draw = function () {
        var t = timer.readTimer() / 1000.0;
        animTime += t / 6;
        if (animTime >= 1)
            animTime = 0;
        var angleZ = Interpolate.range(animTime, 0, Math.PI * 6, Interpolate.EASE), angleXY = Interpolate.range(animTime, 0, Math.PI * 2, Interpolate.LINEAR);
        cube.orientation = Quaternion.fromAxisRotation(Vector.Z_AXIS, angleZ).rotateAxis(new Vector(1, 1, 0), angleXY);
        timer.startTimer();
    };
    var canvas = document.getElementById("spinning-cube-canvas") || undefined;
    var renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color()
    });
    (canvas || document.querySelector("canvas")).addEventListener("click", function () {
        var color = cube.material.fill;
        var hue = color.h + 60;
        if (hue > 360)
            hue -= 360;
        cube.material.setColor(new Color(hue, color.s, color.l));
    });
    renderer.start(scene, camera);
});
