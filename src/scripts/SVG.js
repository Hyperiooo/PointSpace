//parse svg element from string OR dom element
function SVGToDOM(svg) {
  if (typeof svg === "string") {
    //parse to dom element
    var parser = new DOMParser();
    svg = parser.parseFromString(svg, "image/svg+xml").documentElement;
  } else if (svg instanceof Element) {
    svg = svg.cloneNode(true);
  }
  return svg;
}
//async and await load svg from url and parse it
async function loadSVG(url) {
  var response = await fetch(url);
  var svg = await response.text();
  return SVGToDOM(svg);
}
//parse svg from dom element. get every children of the dom element, and add it to an array based on its type.
function parseSVG(svg) {
  var children = svg.children;
  var parsed = [];
  var metadata = new SVGMetadata(svg);
  parsed.push(metadata);
  new SvgInterface(parsed[0].width, parsed[0].height, parsed[0].viewBox);
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.tagName === "path") {
      parsed.push(new Path(child));
    } else if (child.tagName === "circle") {
      parsed.push(new Circle(child));
    } else if (child.tagName === "rect") {
      parsed.push(new Rect(child));
    } else if (child.tagName === "ellipse") {
      parsed.push(new Ellipse(child));
    } else if (child.tagName === "line") {
      parsed.push(new Line(child));
    } else if (child.tagName === "polyline") {
      parsed.push(new Polyline(child));
    } else if (child.tagName === "polygon") {
      parsed.push(new Polygon(child));
    }
  }
  parsed.forEach((e) => {
    if (e.render) e.render();
  });
  return parsed;
}

class SVGMetadata {
  constructor(svg) {
    this.svg = svg;
    this.width = svg.getAttribute("width");
    this.height = svg.getAttribute("height");
    this.viewBox = svg.getAttribute("viewBox");
    this.preserveAspectRatio = svg.getAttribute("preserveAspectRatio");
    this.version = svg.getAttribute("version");
    this.baseProfile = svg.getAttribute("baseProfile");
    this.xmlns = svg.getAttribute("xmlns");
    this.xmlnsXlink = svg.getAttribute("xmlns:xlink");
    this.xmlnsSvg = svg.getAttribute("xmlns:svg");
    this.xmlnsSodipodi = svg.getAttribute("xmlns:sodipodi");
    this.xmlnsInkscape = svg.getAttribute("xmlns:inkscape");
    this.id = svg.getAttribute("id");
    this.style = svg.getAttribute("style");
    this.class = svg.getAttribute("class");
  }
}

function genId(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

//class which parses path from dom element
class Path {
  constructor(path) {
    var parse = new SvgParser().parse;
    if (path) {
      this.path = path;
      this.d = path.getAttribute("d");
      this.dArray = convertToAbsolute(parse(this.d));
      this.d = toDString(convertToAbsolute(this.dArray));
      this.stroke = path.getAttribute("stroke");
      this.strokeWidth = path.getAttribute("stroke-width");
      this.fill = path.getAttribute("fill");
      this.strokeDasharray = path.getAttribute("stroke-dasharray");
      this.strokeDashoffset = path.getAttribute("stroke-dashoffset");
      this.strokeLinecap = path.getAttribute("stroke-linecap");
      this.strokeLinejoin = path.getAttribute("stroke-linejoin");
      this.strokeMiterlimit = path.getAttribute("stroke-miterlimit");
      this.strokeOpacity = path.getAttribute("stroke-opacity");
      this.fillOpacity = path.getAttribute("fill-opacity");
      this.opacity = path.getAttribute("opacity");
      this.transform = path.getAttribute("transform");
      this.style = path.getAttribute("style");
      this.id = path.getAttribute("id") || genId(10);
      this.class = path.getAttribute("class");
    } else {
      this.path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      this.d = "";
      this.dArray = [];
      this.stroke = "none";
      this.strokeWidth = 120;
      this.fill = "none";
      this.strokeDasharray = "none";
      this.strokeDashoffset = 0;
      this.strokeLinecap = "butt";
      this.strokeLinejoin = "miter";
      this.strokeMiterlimit = 4;
      this.strokeOpacity = 1;
      this.fillOpacity = 1;
      this.opacity = 1;
      this.transform = "none";
      this.style = "none";
      this.id = genId(10);
      this.class = "";

      this.path.setAttributeNS(null, "d", this.d);
      this.path.setAttributeNS(null, "stroke", this.stroke);
      this.path.setAttributeNS(null, "stroke-width", this.strokeWidth);
      this.path.setAttributeNS(null, "fill", this.fill);
      this.path.setAttributeNS(null, "stroke-dasharray", this.strokeDasharray);
      this.path.setAttributeNS(
        null,
        "stroke-dashoffset",
        this.strokeDashoffset
      );
      this.path.setAttributeNS(null, "stroke-linecap", this.strokeLinecap);
      this.path.setAttributeNS(null, "stroke-linejoin", this.strokeLinejoin);
      this.path.setAttributeNS(
        null,
        "stroke-miterlimit",
        this.strokeMiterlimit
      );
      this.path.setAttributeNS(null, "stroke-opacity", this.strokeOpacity);
      this.path.setAttributeNS(null, "fill-opacity", this.fillOpacity);
      this.path.setAttributeNS(null, "opacity", this.opacity);
      this.path.setAttributeNS(null, "transform", this.transform);
      this.path.setAttributeNS(null, "style", this.style);
    }
    this.nextAnchorPoint = null
    this.render();
  }
  render() {
    this.d = this.dArray
      .map((item) => {
        return item.join(" ");
      })
      .join(" ");
    this.path.setAttributeNS(null, "d", this.d);
    if (document.getElementById("mainArtboard").contains(this.path)) {
      document.getElementById("mainArtboard").removeChild(this.path);
    }
    //this for some reason causes the for loop to end. why?
    document.getElementById("mainArtboard").appendChild(this.path);
    document
      .getElementById("mainArtboard")
      .querySelectorAll(".anchorpoint-" + this.id)
      .forEach((e) => {
        e.remove();
      });
    document
      .getElementById("mainArtboard")
      .querySelectorAll(".handlepoint-" + this.id)
      .forEach((e) => {
        e.remove();
      });
    document
      .getElementById("mainArtboard")
      .querySelectorAll(".previewpath-" + this.id)
      .forEach((e) => {
        e.remove();
      });
    this.drawAnchorPoints();
  }
  setStroke(color, width) {
    this.stroke = color;
    this.strokeWidth = width * pixelSize;
    this.path.setAttributeNS(null, "stroke", this.stroke);
    this.path.setAttributeNS(null, "stroke-width", this.strokeWidth);
    this.render();
  }
  moveTo(x, y) {
    this.dArray.push(["M", x, y]);
    this.render();
  }
  lineTo(x, y) {
    this.dArray.push(["L", x, y]);
    this.render();
  }
  bezierTo(a1x, a1y, a2x, a2y, ex, ey) {
    this.dArray.push(["C", a1x, a1y, a2x, a2y, ex, ey]);
    this.render();
  }
  updateCurrentHandle(x, y) {
    this.dArray[this.dArray.length - 1][3] = x;
    this.dArray[this.dArray.length - 1][4] = y;
  }
  drawAnchorPoints() {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("previewpath-" + this.id);
    path.setAttributeNS(null, "fill", "#0000");
    path.setAttributeNS(null, "stroke", "blue");
    path.setAttributeNS(null, "stroke-width", pixelSize);
    path.setAttributeNS(null, "d", this.d);

    document.getElementById("mainArtboard").appendChild(path);
    this.dArray.forEach((e, i) => {
      switch (e[0]) {
        case "M":
          if(this.nextAnchorPoint) {
            var x = -(this.nextAnchorPoint[0] - e[1]) + e[1];
            var y = -(this.nextAnchorPoint[1] - e[2]) + e[2];
            this.drawHandle(this.nextAnchorPoint[0], this.nextAnchorPoint[1], x, y);

          }
          this.drawPoint(e[1], e[2]);
          break;

        case "L":
          this.drawPoint(e[1], e[2]);
          break;
        case "C":
          var x = -(e[3] - e[5]) + e[5];
          var y = -(e[4] - e[6]) + e[6];
          this.drawHandle(e[3], e[4], x, y);
          this.drawPoint(e[5], e[6]);
          break;

        default:
          break;
      }
    });
  }
  drawHandle(x1, y1, x2, y2) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("handlepoint-" + this.id);
    path.setAttributeNS(null, "stroke", "blue");
    path.setAttributeNS(null, "stroke-width", pixelSize);
    path.setAttributeNS(null, "d", `M ${x1} ${y1} L ${x2} ${y2}`);
    document.getElementById("mainArtboard").appendChild(path);

    var pt1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pt1.classList.add("handlepoint-" + this.id);
    pt1.setAttributeNS(null, "r", pixelSize * 5);
    pt1.setAttributeNS(null, "cx", x1);
    pt1.setAttributeNS(null, "cy", y1);
    pt1.setAttributeNS(null, "fill", "white");
    pt1.setAttributeNS(null, "stroke", "blue");
    pt1.setAttributeNS(null, "stroke-width", pixelSize);
    var pt2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pt2.classList.add("handlepoint-" + this.id);
    pt2.setAttributeNS(null, "r", pixelSize * 5);
    pt2.setAttributeNS(null, "cx", x2);
    pt2.setAttributeNS(null, "cy", y2);
    pt2.setAttributeNS(null, "fill", "white");
    pt2.setAttributeNS(null, "stroke", "blue");
    pt2.setAttributeNS(null, "stroke-width", pixelSize);
    document.getElementById("mainArtboard").appendChild(pt1);
    document.getElementById("mainArtboard").appendChild(pt2);
  }
  drawPoint(x, y) {
    var pt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pt.classList.add("anchorpoint-" + this.id);
    pt.setAttributeNS(null, "r", pixelSize * 5);
    pt.setAttributeNS(null, "cx", x);
    pt.setAttributeNS(null, "cy", y);
    pt.setAttributeNS(null, "fill", "blue");
    document.getElementById("mainArtboard").appendChild(pt);
  }
}
var pixelSize = 0.048;
//class which parses circle from dom element
class Circle {
  constructor(circle) {
    this.circle = circle;
    this.cx = circle.getAttribute("cx");
    this.cy = circle.getAttribute("cy");
    this.r = circle.getAttribute("r");
    this.stroke = circle.getAttribute("stroke");
    this.strokeWidth = circle.getAttribute("stroke-width");
    this.fill = circle.getAttribute("fill");
    this.strokeDasharray = circle.getAttribute("stroke-dasharray");
    this.strokeDashoffset = circle.getAttribute("stroke-dashoffset");
    this.strokeLinecap = circle.getAttribute("stroke-linecap");
    this.strokeLinejoin = circle.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = circle.getAttribute("stroke-miterlimit");
    this.strokeOpacity = circle.getAttribute("stroke-opacity");
    this.fillOpacity = circle.getAttribute("fill-opacity");
    this.opacity = circle.getAttribute("opacity");
    this.transform = circle.getAttribute("transform");
    this.style = circle.getAttribute("style");
    this.id = circle.getAttribute("id");
    this.class = circle.getAttribute("class");
  }
}
//class which parses rect from dom element
class Rect {
  constructor(rect) {
    this.rect = rect;
    this.x = rect.getAttribute("x");
    this.y = rect.getAttribute("y");
    this.width = rect.getAttribute("width");
    this.height = rect.getAttribute("height");
    this.rx = rect.getAttribute("rx");
    this.ry = rect.getAttribute("ry");
    this.stroke = rect.getAttribute("stroke");
    this.strokeWidth = rect.getAttribute("stroke-width");
    this.fill = rect.getAttribute("fill");
    this.strokeDasharray = rect.getAttribute("stroke-dasharray");
    this.strokeDashoffset = rect.getAttribute("stroke-dashoffset");
    this.strokeLinecap = rect.getAttribute("stroke-linecap");
    this.strokeLinejoin = rect.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = rect.getAttribute("stroke-miterlimit");
    this.strokeOpacity = rect.getAttribute("stroke-opacity");
    this.fillOpacity = rect.getAttribute("fill-opacity");
    this.opacity = rect.getAttribute("opacity");
    this.transform = rect.getAttribute("transform");
    this.style = rect.getAttribute("style");
    this.id = rect.getAttribute("id");
    this.class = rect.getAttribute("class");
  }
}
//class which parses ellipse from dom element
class Ellipse {
  constructor(ellipse) {
    this.ellipse = ellipse;
    this.cx = ellipse.getAttribute("cx");
    this.cy = ellipse.getAttribute("cy");
    this.rx = ellipse.getAttribute("rx");
    this.ry = ellipse.getAttribute("ry");
    this.stroke = ellipse.getAttribute("stroke");
    this.strokeWidth = ellipse.getAttribute("stroke-width");
    this.fill = ellipse.getAttribute("fill");
    this.strokeDasharray = ellipse.getAttribute("stroke-dasharray");
    this.strokeDashoffset = ellipse.getAttribute("stroke-dashoffset");
    this.strokeLinecap = ellipse.getAttribute("stroke-linecap");
    this.strokeLinejoin = ellipse.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = ellipse.getAttribute("stroke-miterlimit");
    this.strokeOpacity = ellipse.getAttribute("stroke-opacity");
    this.fillOpacity = ellipse.getAttribute("fill-opacity");
    this.opacity = ellipse.getAttribute("opacity");
    this.transform = ellipse.getAttribute("transform");
    this.style = ellipse.getAttribute("style");
    this.id = ellipse.getAttribute("id");
    this.class = ellipse.getAttribute("class");
  }
}
//class which parses line from dom element
class Line {
  constructor(line) {
    this.line = line;
    this.x1 = line.getAttribute("x1");
    this.y1 = line.getAttribute("y1");
    this.x2 = line.getAttribute("x2");
    this.y2 = line.getAttribute("y2");
    this.stroke = line.getAttribute("stroke");
    this.strokeWidth = line.getAttribute("stroke-width");
    this.fill = line.getAttribute("fill");
    this.strokeDasharray = line.getAttribute("stroke-dasharray");
    this.strokeDashoffset = line.getAttribute("stroke-dashoffset");
    this.strokeLinecap = line.getAttribute("stroke-linecap");
    this.strokeLinejoin = line.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = line.getAttribute("stroke-miterlimit");
    this.strokeOpacity = line.getAttribute("stroke-opacity");
    this.fillOpacity = line.getAttribute("fill-opacity");
    this.opacity = line.getAttribute("opacity");
    this.transform = line.getAttribute("transform");
    this.style = line.getAttribute("style");
    this.id = line.getAttribute("id");
    this.class = line.getAttribute("class");
  }
}
//class which parses polyline from dom element
class Polyline {
  constructor(polyline) {
    this.polyline = polyline;
    this.points = polyline.getAttribute("points");
    this.stroke = polyline.getAttribute("stroke");
    this.strokeWidth = polyline.getAttribute("stroke-width");
    this.fill = polyline.getAttribute("fill");
    this.strokeDasharray = polyline.getAttribute("stroke-dasharray");
    this.strokeDashoffset = polyline.getAttribute("stroke-dashoffset");
    this.strokeLinecap = polyline.getAttribute("stroke-linecap");
    this.strokeLinejoin = polyline.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = polyline.getAttribute("stroke-miterlimit");
    this.strokeOpacity = polyline.getAttribute("stroke-opacity");
    this.fillOpacity = polyline.getAttribute("fill-opacity");
    this.opacity = polyline.getAttribute("opacity");
    this.transform = polyline.getAttribute("transform");
    this.style = polyline.getAttribute("style");
    this.id = polyline.getAttribute("id");
    this.class = polyline.getAttribute("class");
  }
}
//class which parses polygon from dom element
class Polygon {
  constructor(polygon) {
    this.polygon = polygon;
    this.points = polygon.getAttribute("points");
    this.stroke = polygon.getAttribute("stroke");
    this.strokeWidth = polygon.getAttribute("stroke-width");
    this.fill = polygon.getAttribute("fill");
    this.strokeDasharray = polygon.getAttribute("stroke-dasharray");
    this.strokeDashoffset = polygon.getAttribute("stroke-dashoffset");
    this.strokeLinecap = polygon.getAttribute("stroke-linecap");
    this.strokeLinejoin = polygon.getAttribute("stroke-linejoin");
    this.strokeMiterlimit = polygon.getAttribute("stroke-miterlimit");
    this.strokeOpacity = polygon.getAttribute("stroke-opacity");
    this.fillOpacity = polygon.getAttribute("fill-opacity");
    this.opacity = polygon.getAttribute("opacity");
    this.transform = polygon.getAttribute("transform");
    this.style = polygon.getAttribute("style");
    this.id = polygon.getAttribute("id");
    this.class = polygon.getAttribute("class");
  }
}
const kCommandTypeRegex = /^[\t\n\f\r ]*([MLHVZCSQTAmlhvzcsqta])[\t\n\f\r ]*/;
const kFlagRegex = /^[01]/;
const kNumberRegex =
  /^[+-]?(([0-9]*\.[0-9]+)|([0-9]+\.)|([0-9]+))([eE][+-]?[0-9]+)?/;
const kCoordinateRegex = kNumberRegex;
const kCommaWsp = /^(([\t\n\f\r ]+,?[\t\n\f\r ]*)|(,[\t\n\f\r ]*))/;

const kGrammar = {
  M: [kCoordinateRegex, kCoordinateRegex],
  L: [kCoordinateRegex, kCoordinateRegex],
  H: [kCoordinateRegex],
  V: [kCoordinateRegex],
  Z: [],
  C: [
    kCoordinateRegex,
    kCoordinateRegex,
    kCoordinateRegex,
    kCoordinateRegex,
    kCoordinateRegex,
    kCoordinateRegex,
  ],
  S: [kCoordinateRegex, kCoordinateRegex, kCoordinateRegex, kCoordinateRegex],
  Q: [kCoordinateRegex, kCoordinateRegex, kCoordinateRegex, kCoordinateRegex],
  T: [kCoordinateRegex, kCoordinateRegex],
  A: [
    kNumberRegex,
    kNumberRegex,
    kCoordinateRegex,
    kFlagRegex,
    kFlagRegex,
    kCoordinateRegex,
    kCoordinateRegex,
  ],
};

class SvgParser {
  static components(type, path, cursor) {
    const expectedRegexList = kGrammar[type.toUpperCase()];

    const components = [];
    while (cursor <= path.length) {
      const component = [type];
      for (const regex of expectedRegexList) {
        const match = path.slice(cursor).match(regex);

        if (match !== null) {
          component.push(match[0]);
          cursor += match[0].length;
          const ws = path.slice(cursor).match(kCommaWsp);
          if (ws !== null) {
            cursor += ws[0].length;
          }
        } else if (component.length === 1) {
          return [cursor, components];
        } else {
          throw new Error("malformed path (first error at " + cursor + ")");
        }
      }
      components.push(component);
      if (expectedRegexList.length === 0) {
        return [cursor, components];
      }
      if (type === "m") {
        type = "l";
      }
      if (type === "M") {
        type = "L";
      }
    }
    throw new Error("malformed path (first error at " + cursor + ")");
  }

  parse(path) {
    let cursor = 0;
    let tokens = [];
    while (cursor < path.length) {
      const match = path.slice(cursor).match(kCommandTypeRegex);
      if (match !== null) {
        const command = match[1];
        cursor += match[0].length;
        const componentList = SvgParser.components(command, path, cursor);
        cursor = componentList[0];
        tokens = [...tokens, ...componentList[1]];
      } else {
        throw new Error("malformed path (first error at " + cursor + ")");
      }
    }
    return tokens;
  }
}
//classes for all svg path commands
class MoveTo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class LineTo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class HorizontalLineTo {
  constructor(x) {
    this.x = x;
  }
}
class VerticalLineTo {
  constructor(y) {
    this.y = y;
  }
}
class ClosePath {
  constructor() {}
}
class CubicBezierCurve {
  constructor(x1, y1, x2, y2, x, y) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x = x;
    this.y = y;
  }
}
class SmoothCubicBezierCurve {
  constructor(x2, y2, x, y) {
    this.x2 = x2;
    this.y2 = y2;
    this.x = x;
    this.y = y;
  }
}
class QuadraticBezierCurve {
  constructor(x1, y1, x, y) {
    this.x1 = x1;
    this.y1 = y1;
    this.x = x;
    this.y = y;
  }
}
class SmoothQuadraticBezierCurve {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class EllipticalArc {
  constructor(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    this.rx = rx;
    this.ry = ry;
    this.xAxisRotation = xAxisRotation;
    this.largeArcFlag = largeArcFlag;
    this.sweepFlag = sweepFlag;
    this.x = x;
    this.y = y;
  }
}

function isUppercase(command) {
  return command === command.toUpperCase();
}
//converts array of svg path commands from relative to absolute based on the first command given, which can be assumed as a moveto command which is always relative
function convertToAbsolute(commands) {
  let homeX = parseFloat(commands[0][1]);
  let homeY = parseFloat(commands[0][2]);
  let adjustedCommands = [];
  adjustedCommands.push([
    "M",
    parseFloat(commands[0][1]),
    parseFloat(commands[0][2]),
  ]);
  for (let i = 1; i < commands.length; i++) {
    let command = commands[i];
    let type = command[0];
    let x = parseFloat(command[1]);
    let y = parseFloat(command[2]);
    let x1 = parseFloat(command[1]);
    let y1 = parseFloat(command[2]);
    let x2 = parseFloat(command[3]);
    let y2 = parseFloat(command[4]);
    let x3 = parseFloat(command[5]);
    let y3 = parseFloat(command[6]);
    if (isUppercase(type)) {
      adjustedCommands.push(command);
      continue;
    }
    switch (type) {
      case "m":
        adjustedCommands.push(["M", homeX + x, homeY + y]);
        homeX += x;
        homeY += y;
        break;
      case "l":
        adjustedCommands.push(["L", homeX + x, homeY + y]);
        homeX += x;
        homeY += y;
        break;
      case "h":
        adjustedCommands.push(["L", homeX + x, homeY]);
        homeX += x;
        break;
      case "v":
        adjustedCommands.push(["L", homeX, homeY + y]);
        homeY += y;
        break;
      case "c":
        adjustedCommands.push([
          "C",
          homeX + x1,
          homeY + y1,
          homeX + x2,
          homeY + y2,
          homeX + x3,
          homeY + y3,
        ]);
        homeX += x3;
        homeY += y3;
        break;
      case "s":
        adjustedCommands.push([
          "S",
          homeX + x1,
          homeY + y1,
          homeX + x2,
          homeY + y2,
        ]);
        homeX += x2;
        homeY += y2;
        break;
      case "q":
        adjustedCommands.push([
          "Q",
          homeX + x1,
          homeY + y1,
          homeX + x2,
          homeY + y2,
        ]);
        homeX += x2;
        homeY += y2;
        break;
      case "t":
        adjustedCommands.push(["T", homeX + x, homeY + y]);
        homeX += x;
        homeY += y;
        break;
      case "a":
        adjustedCommands.push([
          "A",
          x,
          y,
          parseFloat(command[3]),
          parseFloat(command[4]),
          parseFloat(command[5]),
          homeX + parseFloat(command[6]),
          homeY + parseFloat(command[7]),
        ]);
        homeX += parseFloat(command[6]);
        homeY += parseFloat(command[7]);
        break;
      case "z":
        adjustedCommands.push(["Z"]);
        break;
    }
  }
  return adjustedCommands;
}

function toDString(commands) {
  return commands.map((e) => e.join(" ")).join(" ");
}
//imports svg from url
var cur;
function importSVG(url) {
  loadSVG(url).then((e) => {
    var parsed = parseSVG(e);
    cur = parsed;
    document.documentElement.style.setProperty(
      "--svg1pxWidth",
      `${cur[0].width / 500}px`
    );
    pixelSize = cur[0].width / 500
    var parse = new SvgParser().parse;
    console.log(parsed);

    parsed.forEach((e) => {
      //check if e is a path class
      if (e instanceof Path) {
        var parsedPath = parse(e.d);
        console.log(parsedPath);
        console.log(convertToAbsolute(parsedPath));
        console.log(toDString(convertToAbsolute(parsedPath)));
      }
    });
  });
}
importSVG("./test.svg");

window.addEventListener("resize", () => {
  //set css variable svg1pxWidth
  document.documentElement.style.setProperty(
    "--svg1pxWidth",
    `${cur[0].width / 500}px`
  );
});
