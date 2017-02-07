// Naudoti Extrude geometry;
// Naudoti TubeGeometry;
//var step;
$(function () {
	var stats = initStats();
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	
	        var planeGeometry = new THREE.PlaneGeometry(80,80);
        var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);


        // rotate and position the plane
        plane.rotation.x=-0.5*Math.PI;
        plane.position.x=15
        plane.position.y=0
        plane.position.z=0
		plane.receiveShadow  = true;
        // add the plane to the scene
        scene.add(plane);
	
	var wholeStairs = new THREE.Object3D();
	
	var controls = new function() {
		this.stairAngleDiferences = 0;
		this.stairHeight = 10;
		this.extrudeAmount = 0;
		this.extrudeBevelThickness = 0.25;
		this.extrudeBevelSize = 0.5;
		this.extrudeBevelSegments = 25;
		this.extrudeCurveSegments = 20;
		this.extrudeSteps = 4;
		
		this.onLongEdge = false;
		
		this.stepCount = 10;
		this.stepWidth = 8;
		this.stepRadius = 3;
		this.stepThickness = 1;
		this.stepGap = 1;
		this.supportRadius = 0.5;
		this.stairRotation = 7;
		this.railSupportRadius = 0.25;
		this.railHeight = 4;
		this.stepRotation = 30;
		
		this.railDirection = 1;
		
		this.redraw = function(){
			if (controls.onLongEdge) {
				if (controls.stairAngleDiferences > 0) {
					controls.railDirection = -1;
				} else if (controls.stairAngleDiferences < 0) {
					controls.railDirection = 1;
				}
			} else {
				controls.railDirection = 1;
			}

			controls.stairRotation = controls.stairAngleDiferences / (controls.stepCount - 1);
			var multipartSome = controls.stairHeight / controls.stepCount / 2;
			controls.stepGap = multipartSome;
			controls.stepThickness = multipartSome;
			
			
			scene.remove(wholeStairs);
			var selectedObject = scene.getObjectByName('mesh1');
			scene.remove( selectedObject );
			wholeStairs = drawStairs();
			scene.add(wholeStairs);
		}
	}
	
	controls.stairRotation = controls.stairAngleDiferences / (controls.stepCount - 1);
	controls.stepGap = controls.stairHeight / controls.stepCount / 2;
	controls.stepThickness = controls.stepGap;
	
	wholeStairs = drawStairs();
	scene.add(wholeStairs);
	
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
	camera.lookAt(scene.position);

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( -40, 60, -10 );
        spotLight.castShadow = true;
        scene.add( spotLight );
	 
	
	
	        var ambiColor = "#0c0c0c";
        var ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);
	 
	
	$("#WebGL-output").append(renderer.domElement);
	var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
	
	var gui = new dat.GUI();
	
	//gui.add(controls, 'stairRotation', -30, 30).step(1).onFinishChange(controls.redraw);
	gui.add(controls, 'stairHeight', 5, 40).step(1).name('Laiptų aukštis').onChange(controls.redraw);
	gui.add(controls, 'stepCount', 2, 30).step(1).name('Laiptų skaičius').onChange(controls.redraw);
	gui.add(controls, 'stairAngleDiferences', -180, 180).step(1).name('Kampas').onChange(controls.redraw);
	gui.add(controls, 'onLongEdge').name('Ant ilgosios krastines').onFinishChange(controls.redraw);
	var guiAdditional = gui.addFolder('Papildomi');
	guiAdditional.add(controls, 'stepWidth', 1, 20).step(1).onFinishChange(controls.redraw);
	guiAdditional.add(controls, 'stepRadius', 1, 10).step(1).onFinishChange(controls.redraw);
	guiAdditional.add(controls, 'stepThickness', 1, 10).step(1).onFinishChange(controls.redraw);
	guiAdditional.add(controls, 'stepGap', 1, 10).step(1).onFinishChange(controls.redraw);
	guiAdditional.add(controls, 'supportRadius', 0, 1).onFinishChange(controls.redraw);
	guiAdditional.add(controls, 'railHeight', 1, 13).step(1).onFinishChange(controls.redraw);
	
	
	
	var guiExtrudeGeometry = gui.addFolder('Laipto nustatymai');
	//guiExtrudeGeometry.add(controls, 'extrudeAmount', 0, 0.5).onFinishChange(controls.redraw);
	guiExtrudeGeometry.add(controls, 'extrudeBevelThickness', 0, 0.5).onFinishChange(controls.redraw);
	guiExtrudeGeometry.add(controls, 'extrudeBevelSize', 0, 1.5).onFinishChange(controls.redraw);
	
	render();
	
	function render() {
		stats.update();

		renderer.render(scene, camera);
		requestAnimationFrame(render);
		cameraControls.update(); 
		
	}
	
	function drawStairs(){
		var wholeStairs = new THREE.Object3D();
		var stepGeometry = new THREE.CubeGeometry(controls.stepRadius, controls.stepThickness, controls.stepWidth);
		var stepMaterial = new THREE.MeshLambertMaterial({
			color: 0xDEB887
		});
		var stepSupportMaterial = new THREE.MeshLambertMaterial({color: 0x778899, side: THREE.DoubleSide});
		var stepBottomSupportGeometry = new THREE.CylinderGeometry(controls.supportRadius, controls.supportRadius, controls.stepGap, 34);
		var stepTopGeometry = new THREE.CylinderGeometry(controls.supportRadius, controls.supportRadius, controls.stepThickness + controls.supportRadius, 34);
		var stepSupportReinforcementGeometry = new THREE.CubeGeometry(controls.stepRadius / 2 + controls.supportRadius, controls.supportRadius, controls.supportRadius * 2);
		var nextX = 0;
		var nextY = 0;
		var pointsForRails = [];

		pointsForRails.push(new THREE.Vector3(0 - (controls.stepRadius / 2 + controls.supportRadius) * Math.cos(-(Math.PI / 180 * controls.stairRotation) * -1) + (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.sin(controls.railDirection * -1 * (Math.PI / 180 * controls.stairRotation) * -1), -1 * (controls.stepThickness + controls.stepGap) + controls.railHeight + controls.stepGap, 0 - (controls.stepRadius / 2 + controls.supportRadius) * Math.sin(-(Math.PI / 180 * controls.stairRotation) * -1) + controls.railDirection * -1 * (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.cos(controls.railDirection  * -1 *(Math.PI / 180 * controls.stairRotation) * -1)));

		for (var i = 0; i < controls.stepCount; i++){
			var stepBase = createStep();
			stepBase.castShadow = true;		
			
			if (i % 2 == 0) {
				stepBase.position.y = controls.stepGap + controls.stepThickness / 2;
				stepBase.rotation.x = Math.PI / 2;
			} else {
				stepBase.position.y = controls.stepGap ;
				stepBase.rotation.x = -Math.PI / 2;
			}
			
			var bottomSupport = new THREE.Mesh( stepBottomSupportGeometry, stepSupportMaterial);
			bottomSupport.castShadow = true;
			bottomSupport.position.y = controls.stepGap / 2;
			
			var topSupport = new THREE.Mesh( stepTopGeometry, stepSupportMaterial);
			topSupport.castShadow = true;		
			topSupport.position.x = controls.stepRadius / 2 + controls.supportRadius;
			topSupport.position.y = controls.stepGap - (controls.supportRadius / 2) + (controls.stepThickness + controls.supportRadius) / 2 - controls.supportRadius / 2;
			
			var supportReinforcement = new THREE.Mesh(stepSupportReinforcementGeometry, stepSupportMaterial);
			supportReinforcement.castShadow = true;		
			supportReinforcement.position.x = (controls.stepRadius / 2 + controls.supportRadius) / 2;
			supportReinforcement.position.y = controls.stepGap - controls.supportRadius / 2;
		
			
			var points = [];
			points.push(new THREE.Vector3(0, controls.stepGap - controls.railSupportRadius, controls.railDirection * (-controls.stepWidth / 2 + 1)));
			points.push(new THREE.Vector3(0, controls.stepGap - controls.railSupportRadius, controls.railDirection * (-controls.stepWidth / 2)));
			points.push(new THREE.Vector3(0, controls.stepGap - controls.railSupportRadius, controls.railDirection * (-controls.stepWidth / 2 - controls.railSupportRadius * 2)));
			points.push(new THREE.Vector3(0, controls.stepGap + 1 - controls.railSupportRadius, controls.railDirection * (-controls.stepWidth / 2 - controls.railSupportRadius * 4)));
			points.push(new THREE.Vector3(0, controls.stepGap + controls.railHeight, controls.railDirection * (-controls.stepWidth / 2 - controls.railSupportRadius * 4)));
			
			var tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 10, controls.railSupportRadius, 10, false);
			//var meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
			var mesh = THREE.SceneUtils.createMultiMaterialObject(tubeGeometry, [stepSupportMaterial]);
			
			var step = new THREE.Object3D();
			step.add(stepBase);
			step.add(bottomSupport);
			step.add(topSupport);
			step.add(supportReinforcement);
			//step.add(splineObject);
			step.add(mesh);
			
			if (i == controls.stepCount - 1){
				var planefinal = new THREE.Mesh(new THREE.PlaneGeometry(10,10),  new THREE.MeshBasicMaterial({color: 0xcccccc}));
				planefinal.position.x = 5 + controls.stepRadius / 2 + controls.supportRadius;
				planefinal.position.y = 0.01 + (controls.stepThickness + controls.supportRadius) / 2 + controls.stepGap - (controls.supportRadius / 2) + (controls.stepThickness + controls.supportRadius) / 2 - controls.supportRadius / 2
				planefinal.rotation.x=-0.5*Math.PI;
				planefinal.receiveShadow  = false;
				//step.add(planefinal);
			}
			
			
			step.position.y = i * (controls.stepThickness + controls.stepGap);
			step.position.x = nextX;
			step.position.z = nextY;
			step.rotation.y = (Math.PI / 180 * controls.stairRotation) * i;
		
			var railX = nextX + (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.sin(controls.railDirection * -1 * (Math.PI / 180 * controls.stairRotation) * i);
			var railY = i * (controls.stepThickness + controls.stepGap) + controls.railHeight + controls.stepGap;
			var railZ = nextY + (controls.railDirection * -1) * (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.cos(controls.railDirection * -1 *(Math.PI / 180 * controls.stairRotation) * i);
			pointsForRails.push(new THREE.Vector3(railX, railY, railZ ));
			
			step.name = 'step';
			wholeStairs.add(step);
			
			

			nextX = nextX + (controls.stepRadius / 2 + controls.supportRadius) * Math.cos(-(Math.PI / 180 * controls.stairRotation) * i);
			nextY = nextY + (controls.stepRadius / 2 + controls.supportRadius) * Math.sin(-(Math.PI / 180 * controls.stairRotation) * i);
		}
		
		pointsForRails.push(new THREE.Vector3(nextX + (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.sin(controls.railDirection * -1 * (Math.PI / 180 * controls.stairRotation) * controls.stepCount), controls.stepCount * (controls.stepThickness + controls.stepGap) + controls.railHeight + controls.stepGap, nextY + controls.railDirection * -1 * (controls.stepWidth / 2 + controls.railSupportRadius * 4) * Math.cos(controls.railDirection * -1 *(Math.PI / 180 * controls.stairRotation) * controls.stepCount) ));
		
		var tubeGeometry1 = new THREE.TubeGeometry(new THREE.SplineCurve3(pointsForRails), 100, controls.railSupportRadius, 30, false);
		var mesh1 = THREE.SceneUtils.createMultiMaterialObject(tubeGeometry1, [new THREE.MeshLambertMaterial({color: 0x778899, side: THREE.DoubleSide})]);
		mesh1.name = 'mesh1';
		scene.add(mesh1);

		return wholeStairs;
		
	}
	
	function createStep(){
		var extrudeSettings = {
			amount: (controls.stepThickness - controls.extrudeBevelThickness) / 2,
			bevelThickness: controls.extrudeBevelThickness,
			bevelSize: controls.extrudeBevelSize,
			bevelSegments: controls.extrudeBevelSegments,
			bevelEnabled: true,
			curveSegments: controls.extrudeCurveSegments,
			steps: controls.extrudeSteps
		};

		var step1 = new THREE.ExtrudeGeometry(drawStep(controls.stepWidth, controls.stepRadius ), extrudeSettings); 
		var material123 = new THREE.MeshLambertMaterial( { color: 0xDEB887 } );
		var mesh123654 = new THREE.Mesh( step1, material123 ) ;
		
		//mesh123654.rotation.x = Math.PI / 2;
		mesh123654.rotation.z = Math.PI / 2;	
		
		return mesh123654;
	}
	
	function drawStep(width, height){
		var shape = new THREE.Shape();
		
		shape.moveTo(0, -height / 2);
		shape.lineTo(-width * 3 / 8, -height / 2);
		
		shape.quadraticCurveTo(-width/2, 0, -width * 3 / 8, height/2);
		
		shape.bezierCurveTo(0, height/2, width / 2, 0, width/2, -height/2);
		shape.lineTo(0, -height / 2);
		
		return shape;
		
	}
	
    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append(stats.domElement);
        return stats;
    }

});


