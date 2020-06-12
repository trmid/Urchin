URCHIN_PATH = "../../Urchin.js";
window.addEventListener("load", function () {
    var scene = new Scene();
    var camera = new Camera({
        position: new Vector(-20, 0, 0)
    });
    var ringSegments = new Array();
    var ring = Mesh.cylinder({
        innerRadius: 0.95,
        outerRadius: 1.05,
        height: 0.1,
        resolution: 16
    });
    var smallRing = Mesh.scale(ring, 0.75);
    var ringMat = new Material({ fill: new Color("white") });
    var centerRing = new MeshUrbject({
        position: new Vector(0, 0, 4),
        mesh: ring,
        material: ringMat
    });
    var outerRings = new Urbject({
        position: new Vector(0, 0, 4)
    });
    outerRings.addChild(new MeshUrbject({
        position: new Vector(0.6, 0, 0),
        orientation: Quaternion.fromAxisRotation(Vector.Y_AXIS, Num.rad(45)),
        mesh: smallRing,
        material: ringMat
    }));
    outerRings.addChild(new MeshUrbject({
        position: new Vector(-0.6, 0, 0),
        orientation: Quaternion.fromAxisRotation(Vector.Y_AXIS, Num.rad(-45)),
        mesh: smallRing,
        material: ringMat
    }));
    var numSegments = 12;
    for (var i = 0; i < numSegments; i++) {
        var innerLink = new Urbject();
        var outerLink = new Urbject();
        var innerRingSegment = centerRing.copy();
        var outerRingSegment = outerRings.copy();
        ringSegments.push(innerRingSegment);
        ringSegments.push(outerRingSegment);
        innerLink.addChild(innerRingSegment);
        outerLink.addChild(outerRingSegment);
        innerLink.orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, Num.rad((360.0 * i) / numSegments));
        outerLink.orientation = Quaternion.fromAxisRotation(Vector.X_AXIS, Num.rad((360.0 * (i + 0.5)) / numSegments));
        scene.add(innerLink);
        scene.add(outerLink);
    }
    var lightRotation = Quaternion.fromVector(new Vector(1, -1, -1));
    scene.add(new DirectionalLight({
        color: new Color("yellow"),
        direction: Vector.xAxis().qRotate(lightRotation),
        brightness: 1
    }));
    scene.add(new DirectionalLight({
        color: new Color("aqua"),
        direction: Vector.yAxis().qRotate(lightRotation),
        brightness: 1
    }));
    scene.add(new DirectionalLight({
        color: new Color("fuchsia"),
        direction: Vector.zAxis().qRotate(lightRotation),
        brightness: 1
    }));
    var canvas = document.getElementById("focal-point-controller-canvas") || undefined;
    var controller = new FocalPointController({
        focalPoint: new Vector(0, 0, 0),
        friction: 0.03,
        minDist: 5,
        maxDist: 30,
        zoomMultiplier: 1,
        controlFace: canvas || window
    });
    var timer = new Stats();
    var draw = function () {
        var t = timer.readTimer() / 1000.0;
        for (var i = 0; i < ringSegments.length; i++) {
            ringSegments[i].orientation.rotateY(Num.rad(45) * t);
        }
        controller.move(camera);
        timer.startTimer();
    };
    var renderer = new PerformanceRenderer({
        canvas: canvas,
        frameCallback: draw,
        backgroundColor: new Color(0, 0.05)
    });
    if (canvas) {
        canvas.addEventListener("mouseover", function () { timer.startTimer(); renderer.start(scene, camera); });
        canvas.addEventListener("mouseleave", function () { renderer.stop(); });
    }
    if (!canvas) {
        renderer.start(scene, camera);
    }
    else {
        renderer.render(scene, camera);
    }
});
