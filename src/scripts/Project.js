class SvgInterface {
  constructor(width, height, viewBox) {
    this.mainArtboard = document.getElementById("mainArtboard");
    this.width = width;
    this.height = height;
    this.viewBox = viewBox;
    this.mainArtboard
      .setAttributeNS(null, "width", this.width || 100);
      this.mainArtboard
      .setAttributeNS(null, "height", this.height || 100);
    this.mainArtboard
      .setAttributeNS(null, "viewBox", this.viewBox);

    document.addEventListener("pointerdown", this.inputDown.bind(this))
    document.addEventListener("pointerup", this.inputUp.bind(this))
    document.addEventListener("pointermove", this.inputActive.bind(this))

    this.currentPath
    this.inputMoved= false
    this.drawingPath = false
  }

  inputDown(e) {
    var rect = this.mainArtboard.getBoundingClientRect();
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    x = x / rect.width  * this.width
    y = y / rect.height * this.height
    if(!this.drawingPath){
      this.currentPath = new Path()
      this.currentPath.setStroke("black", 1)
      this.currentPath.moveTo(x, y)
      this.drawingPath = true
    }else if(this.drawingPath) {
      this.currentPath.lineTo(x, y)
    }
    console.log(e.clientX, e.clientY)
  }
  inputUp(e) {
    this.inputMoved= false
  }
  inputActive(e) {
    this.inputMoved = true
  }
}
