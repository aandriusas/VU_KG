var canvas;
var ctx;
var time = 0;
var diff = 0.0;
//600x600

function init(){
	canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		drawFractal(time);
	} else {
		alert('Nëra canvas!');
	}
}

document.addEventListener("keydown", function(e){
	if (e.key == 'ArrowUp'){
		time = (+time + +diff).toFixed(2);
		drawBorder();
		drawFractal(time);
	} else if (e.key == 'ArrowDown') {
		time = (+time - +diff).toFixed(2);
		drawBorder();
		drawFractal(time);
	} else if (e.key == 'ArrowLeft') {
		diff = (+diff - +0.01).toFixed(2);
	} else if (e.key == 'ArrowRight') {
		diff = (+diff + +0.01).toFixed(2);
	}
	document.getElementById('timeValueSpan').innerHTML = time;
	document.getElementById('diffValueSpan').innerHTML = diff;
	
});

function drawFractal(num){
	if (num == 0){
		drawShape();
	} else {
		var toMinus = 1;
		if (num <= 1){
			toMinus = num;
		}
		ctx.save();
		if (num == time){
			ctx.fillStyle = '#FF0000';
		}
		transformF1(toMinus);
		drawFractal(num - toMinus);
		ctx.restore();
		
		ctx.save();
		if (num == time){
			ctx.fillStyle = '#00FF00';
		}
		transformF2(toMinus);
		drawFractal(num - toMinus);
		ctx.restore();
		
		ctx.save();
		if (num == time){
			ctx.fillStyle = '#0000FF';
		}
		transformF3(toMinus);
		drawFractal(num - toMinus);
		ctx.restore();
		
		ctx.save();
		if (num == time){
			ctx.fillStyle = '#00FFFF';
		}
		transformF4(toMinus);
		drawFractal(num - toMinus);
		ctx.restore();
		
	}
}

function transformF1(t){
	
	var l = 1 - 0.5 * t;
	var alpha = Math.PI / 2 * t;
	
	ctx.transform(l * Math.cos(alpha), l * Math.sin(alpha), l * (-Math.sin(alpha)), l * Math.cos(alpha), 300 * t, 0);
	
}

function transformF2(t){

	var l = 1 - 0.5 * t;
	ctx.transform(l, 0, 0, l, 300 * t, 0);
	
}

function transformF3(t){
		
	var l1 = 1 - 0.75 * t;
	var l2 = 1 - 1.25 * t;
	var alpha = -Math.PI / 2 * t;
	
	ctx.transform(l1 * Math.cos(alpha), l1 * (-Math.sin(alpha)),l2 * Math.sin(alpha), l2 * Math.cos(alpha), 0, 300 * t);
	
}

function transformF4(t){
	
	var l1 = 1 - 0.5 * t;
	var l2 = 1 - 1.5 * t;
	ctx.transform(l1, 0, 0, l2, 300 * t, 600 * t);
	
}

function drawBorder(){
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(600, 0);
	ctx.lineTo(600, 600);
	ctx.lineTo(0, 600);
	ctx.closePath();
	ctx.fillStyle = '#FDFDFD';
	ctx.fill();
	ctx.restore();
}

function drawShape(){
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(600, 0);
	ctx.lineTo(600, 600);
	ctx.lineTo(300, 600);
	ctx.lineTo(300, 150);
	ctx.lineTo(0, 150);
	ctx.fill();
}

init();