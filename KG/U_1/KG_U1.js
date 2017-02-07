var canvas;
var ctx;
var mouseDown = false;
var gearsConnected = false;
var gearsMaches = false;
var gearSpeed = 1;

var mainGear = new Gear({
	x: 100,
	y: 100,
	alpha: 0,
	spikeCount: 8,
	innerRadius: 10,
	outterRadius: 20,
	color: '#FF9E9D',
	distanceToTouchMain: 0
});
var secondaryGear1 = new Gear({
	x: 220,
	y: 380,
	alpha: 0,
	spikeCount: 80,
	innerRadius: 200,
	outterRadius: 210,
	color: '#D25D00',
	distanceToTouchMain: 221,
	distanceToTouchOutterMain: 231,
	touchingMain: false
});
var secondaryGear2 = new Gear({
	x: 516,
	y: 477,
	alpha: 0.4,
	spikeCount: 40,
	innerRadius: 100,
	outterRadius: 110,
	color: '#005C06',
	distanceToTouchMain: 121,
	distanceToTouchOutterMain: 131,
	touchingMain: false
});

function init(){
	canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		setInterval(draw, 20);
		
		canvas.addEventListener('mousedown', function(e){
			mouseDown = true;
		});

		canvas.addEventListener('mouseup', function(e){
			mouseDown = false;
		});

		canvas.addEventListener('mousemove', function(e){
			if (mouseDown){
				var distanceToFirst = Math.sqrt(Math.pow(e.layerX - secondaryGear1.x, 2) + Math.pow(e.layerY - secondaryGear1.y, 2));
				var distanceToSecond = Math.sqrt(Math.pow(e.layerX - secondaryGear2.x, 2) + Math.pow(e.layerY - secondaryGear2.y, 2));
				
				var gearDistanceToFirst = Math.sqrt(Math.pow(mainGear.x - secondaryGear1.x, 2) + Math.pow(mainGear.y - secondaryGear1.y, 2)) - 8;
				var gearDistanceToSecond = Math.sqrt(Math.pow(mainGear.x - secondaryGear2.x, 2) + Math.pow(mainGear.y - secondaryGear2.y, 2)) - 8;
				if (
					(distanceToFirst >= secondaryGear1.distanceToTouchOutterMain && distanceToSecond >= secondaryGear2.distanceToTouchOutterMain)
					||
					(distanceToFirst >= secondaryGear1.distanceToTouchMain && distanceToSecond >= secondaryGear2.distanceToTouchOutterMain)
					||
					(distanceToSecond >= secondaryGear2.distanceToTouchMain && distanceToFirst >= secondaryGear1.distanceToTouchOutterMain)
				){
					mainGear.x = e.layerX;
					mainGear.y = e.layerY;
					gearsConnected = false;
					gearsMaches = false;
				}else if (gearDistanceToFirst <= secondaryGear1.distanceToTouchMain){
					gearsConnected = true;
					gearsMaches = false;
					secondaryGear1.clockwise = false;
					secondaryGear2.clockwise = true;
					secondaryGear1.touchingMain = true;
					secondaryGear2.touchingMain = false;
				} else if (gearDistanceToSecond <= secondaryGear2.distanceToTouchMain){
					gearsConnected = true;
					gearsMaches = false;
					secondaryGear1.clockwise = true;
					secondaryGear2.clockwise = false;
					secondaryGear1.touchingMain = false;
					secondaryGear2.touchingMain = true;
				} 
			}
		});
	}
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBorder();
	var smallGearAngle = Math.PI / 180 * gearSpeed;
	mainGear.alpha = mainGear.alpha + smallGearAngle;
	
	ctx.save();
	ctx.translate(mainGear.x, mainGear.y);
	ctx.rotate(mainGear.alpha);
	mainGear.draw();
	ctx.restore();
	
	ctx.save();
	ctx.translate(secondaryGear1.x, secondaryGear1.y);
	
	gearsMaches = true;
	
	if (gearsConnected && gearsMaches){
		if (secondaryGear1.clockwise){
			secondaryGear1.alpha = (mainGear.outterRadius * smallGearAngle / secondaryGear1.innerRadius) + secondaryGear1.alpha;
		} else {
			secondaryGear1.alpha = (-1 * mainGear.outterRadius * smallGearAngle / secondaryGear1.innerRadius) + secondaryGear1.alpha;	
		}		
	}
	
	
	ctx.rotate(secondaryGear1.alpha);
	secondaryGear1.draw();
	ctx.restore();
	
	ctx.save();
	ctx.translate(secondaryGear2.x, secondaryGear2.y);
	if (gearsConnected && gearsMaches){
		if (secondaryGear2.clockwise){
			secondaryGear2.alpha = (mainGear.outterRadius * smallGearAngle / secondaryGear2.innerRadius) + secondaryGear2.alpha;
		} else {
			secondaryGear2.alpha = (-1 * mainGear.outterRadius * smallGearAngle / secondaryGear2.innerRadius) + secondaryGear2.alpha;	
		}
	}
	ctx.rotate(secondaryGear2.alpha);
	secondaryGear2.draw();
	ctx.restore();
	
	if (!gearsMaches){
	  // bandom teisingai sujungti
		gearsMaches = gearsIntersect();
	}
	
}

function drawBorder(){
	ctx.save();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas. height);
	ctx.lineTo(0, canvas.height);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
}

function Gear(config){
	this.x = config.x;
	this.y = config.y;
	this.alpha = config.alpha;
	this.spikeCount = config.spikeCount;
	this.innerRadius = config.innerRadius;
	this.outterRadius = config.outterRadius;
	this.color = config.color;
	this.distanceToTouchMain = config.distanceToTouchMain;
	this.clockwise = config.clockwise;
	this.touchingMain = config.touchingMain;
	this.distanceToTouchOutterMain = config.distanceToTouchOutterMain;
}

Gear.prototype.draw = function(){
	ctx.save();
	ctx.beginPath();
	var pointCount = this.spikeCount * 2;
	for (var i = 0; i < pointCount; i++){
		var radius = this.innerRadius;
		if (i % 2 === 0){
			radius = this.outterRadius;
		}
		var alpha = Math.PI / this.spikeCount * i;
		var spikeX = radius * Math.sin(alpha);
		var spikeY = radius * Math.cos(alpha);
		
		if (i === 0) {
			ctx.moveTo(spikeX, spikeY);
		} else {
			ctx.lineTo(spikeX, spikeY);
		}
	}
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(0, 0, this.innerRadius / 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#FFFFFF';
	ctx.fill();
	ctx.restore();
};

Gear.prototype.paintArow = function(){
	ctx.beginPath();
	ctx.moveTo(-2, 0);
	ctx.lineTo(0, this.innerRadius);
	ctx.lineTo(2, 0);
	ctx.fillStyle = '#00FF00';
	ctx.fill();
};

Gear.prototype.getSpikePoints = function(inner, outter){
	var points = [];
	var pointCount = this.spikeCount * 2;
	for (var i = 0; i < pointCount; i++){
		if (!inner && i % 2 == 1){
			continue;
		}
		if (!outter && i % 2 === 0){
			continue;
		}
		var radius = this.innerRadius;
		if (i % 2 === 0){
			radius = this.outterRadius;
		}
		var alpha = (Math.PI / this.spikeCount * i) + this.alpha;
		var spikeX = radius * Math.sin(alpha) + this.x;
		var spikeY = radius * Math.cos(alpha) + this.y;
		if (i % 2 === 0){
			points.push([spikeX, spikeY, (radius - 1 ) * Math.sin(alpha) + this.x, (radius - 1) * Math.cos(alpha) + this.y, (radius - 2) * Math.sin(alpha) + this.x, (radius - 2) * Math.cos(alpha) + this.y, (radius - 3) * Math.sin(alpha) + this.x, (radius - 3) * Math.cos(alpha) + this.y]);
		} else {
			points.push([spikeX, spikeY, (radius + 1 ) * Math.sin(alpha) + this.x, (radius + 1) * Math.cos(alpha) + this.y, (radius + 2) * Math.sin(alpha) + this.x, (radius + 2) * Math.cos(alpha) + this.y, (radius + 3) * Math.sin(alpha) + this.x, (radius + 3) * Math.cos(alpha) + this.y]);
		}
		
		
	}
	return points;
};

function gearsIntersect(){
	var mainGearPoints = mainGear.getSpikePoints(false, true);
	var secondaryGear1Points = secondaryGear1.getSpikePoints(true, false);
	var secondaryGear2Points = secondaryGear2.getSpikePoints(true, false);
	
	for (var i = 0; i < mainGearPoints.length; i++){
		if (secondaryGear1.touchingMain){
			for (var j = 0; j < secondaryGear1Points.length; j++){
				if ((Math.abs(mainGearPoints[i][0] - secondaryGear1Points[j][4]) < 1 && Math.abs(mainGearPoints[i][1] - secondaryGear1Points[j][5]) < 1)) {
					return true;
				}
			}
		} else if (secondaryGear2.touchingMain){
			for (var j = 0; j < secondaryGear2Points.length; j++){
				if ((Math.abs(mainGearPoints[i][0] - secondaryGear2Points[j][4]) < 1 && Math.abs(mainGearPoints[i][1] - secondaryGear2Points[j][5]) < 1)) {
					return true;
				}
			}
		}
	}
	
}

document.addEventListener("keypress", function(e){
	if (e.key == '+'){
		gearSpeed++;
	} else if (e.key == '-'){
		gearSpeed--;
	}
});

init();
