URCHIN_PATH = "../../Urchin.js";
window.addEventListener("load", function () {
    var scene = new Scene();
    var camera = new Camera({
        position: new Vector(-10, 0, 0),
        fov: 22
    });
    var urchinMesh = new Mesh();
    var c0 = Mesh.sphere({ subdivisions: 3, radius: 0.1 });
    var c1 = Mesh.rotateZ(c0, 0.3);
    var c2 = Mesh.scale(c0, 10);
    urchinMesh.addTrigon(c0.trigons);
    for (var i = 0; i < c0.trigons.length; i++) {
        var t = new Trigon(c0.trigons[i].v0, c1.trigons[i].v0, c2.trigons[i].v0);
        var tInv = new Trigon(t.v0, t.v2, t.v1);
        urchinMesh.addTrigon([t, tInv]);
    }
    var urchin = new MeshUrbject({
        mesh: urchinMesh,
        material: new Material({ fill: new Color(20) })
    });
    scene.add(urchin);
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
        urchin.orientation = Quaternion.fromAxisRotation(Vector.Z_AXIS, angleZ).rotateAxis(new Vector(1, 1, 0), angleXY);
        timer.startTimer();
    };
    var canvas = document.getElementById("urchin-canvas") || undefined;
    var renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color("white")
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
