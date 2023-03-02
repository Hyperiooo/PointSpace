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

    this.mainArtboard.addEventListener("pointerdown", this.inputDown.bind(this))
    this.mainArtboard.addEventListener("pointerup", this.inputUp.bind(this))
    this.mainArtboard.addEventListener("pointermove", this.inputActive.bind(this))

    this.currentPath
  }

  inputDown(e) {
  }
  inputUp(e) {

  }
  inputActive(e) {}
}
