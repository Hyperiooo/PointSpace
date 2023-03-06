function renderViewport() {
	if (!window.svgInterface) {
		requestAnimationFrame(renderViewport);
		return;
	}
    /*
	vCtx.msImageSmoothingEnabled = false;
	vCtx.mozImageSmoothingEnabled = false;
	vCtx.webkitImageSmoothingEnabled = false;
	vCtx.imageSmoothingEnabled = false;
	var transform = canvasInterface.zoom.getTransform();
	var bounding = canvasInterface.zoom.getRect();
	vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	vCtx.translate(transform.centerX, transform.centerY);
	vCtx.rotate((transform.angle * Math.PI) / 180);
	vCtx.translate(-transform.centerX, -transform.centerY);
	vCtx.drawImage(
		canvasInterface.bggridcanvas,
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2,
		transform.width,
		transform.height
	);

	vCtx.setTransform(1, 0, 0, 1, 0, 0);*/
    //render svg element mAinArtboard. mainArtobard is an svg DOM element, so we have to convert it to an image url and then draw it on the canvas
    var svgData = new XMLSerializer().serializeToString(window.svgInterface.mainArtboard);
    var svg64 = btoa(svgData);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;
    var img = new Image();
    img.onload = function() {
        vCtx.clearRect(0, 0, viewport.width, viewport.height);
        vCtx.drawImage(img, 0, 0);
    }
    img.src = image64;
	requestAnimationFrame(renderViewport);
}

var viewport = document.createElement("canvas");
viewport.width = 450
viewport.height = 450
document.body.appendChild(viewport)
var vCtx = viewport.getContext("2d");

renderViewport()