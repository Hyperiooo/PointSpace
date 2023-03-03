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
    this.prevAnchorPoint = [0, 0]
    this.anchorCenter = [0,0]
    this.inputMoved= false
    this.drawingPath = false
    this.firstPoint = false
  }

  inputDown(e) {
    e.preventDefault()
    var rect = this.mainArtboard.getBoundingClientRect();
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    x = x / rect.width  * this.width
    y = y / rect.height * this.height
    this.anchorCenter = [x,y]
    if(!this.drawingPath){
      this.currentPath = new Path()
      this.currentPath.setStroke("black", 1)
      this.currentPath.moveTo(x, y)
      this.currentPath.bezierTo(x, y, x, y, x, y)
      this.drawingPath = true
      this.firstPoint = true
    }else if(this.drawingPath) {
      this.firstPoint = false;
      this.currentPath.bezierTo(this.prevAnchorPoint[0], this.prevAnchorPoint[1], x, y, x, y)
    }
    console.log(e.clientX, e.clientY)
  }
  inputUp(e) {
    var rect = this.mainArtboard.getBoundingClientRect();
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    x = x / rect.width  * this.width
    y = y / rect.height * this.height
    this.prevAnchorPoint = [x, y]
    this.inputMoved= false
  }
  inputActive(e) {
    var rect = this.mainArtboard.getBoundingClientRect();
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    x = x / rect.width  * this.width
    y = y / rect.height * this.height
    x = -(x - this.anchorCenter[0]) + this.anchorCenter[0]
    y = -(y - this.anchorCenter[1]) + this.anchorCenter[1]
    if(this.firstPoint){
      this.currentPath.dArray[this.dArray.length -1 ][1] = x
      this.currentPath.dArray[this.dArray.length -1 ][2] = y
      this.currentPath.dArray[this.dArray.length -1 ][3] = x
      this.currentPath.dArray[this.dArray.length -1 ][4] = y

    }else {
      this.currentPath.updateCurrentHandle(x, y)

    }
    this.currentPath.render()
    e.preventDefault()
    this.inputMoved = true
  }
}
