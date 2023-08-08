const presetColors = ["#000000", "#fb00ff", "#fff900"];
const threadColors = [];

const svgMaster = document.getElementById("svg-master");
const generateButton = document.getElementById("but-generate");
const addColorButton = document.getElementById("but-addColor");
const results = document.getElementById("results");
const fileInput = document.getElementById("fileInput");

var usedSVG = null;
var paths = [];
var pathsWithFill = [];
var pathsWithOutline = [];

function generateColorVariations(colors, length) {
  const variations = [];

  function generateVariations(currentVariation, remainingLength) {
    if (remainingLength === 0) {
      variations.push(currentVariation);
      return;
    }

    for (const color of colors) {
      generateVariations(currentVariation.concat(color), remainingLength - 1);
    }
  }

  generateVariations([], length);
  return variations;
}

function makeVariations() {
  results.innerHTML = "";
  const colorVariations = generateColorVariations(threadColors, paths.length);

  const shirtColorPicker = document.getElementById("shirtColor");
  const shirtColor = shirtColorPicker.value;

  // create a new svg for each variation
  for (const newVar of colorVariations) {
    const newSvg = usedSVG.cloneNode(true);
    const newPaths = newSvg.querySelectorAll("path");

    for (let i = 0; i < newPaths.length; ) {
      var increment = 0;
      if (newPaths[i].style.fill !== "none") {
        newPaths[i].style.fill = newVar[i];
        increment++;
      }
      if (newPaths[i].style.stroke !== "") {
        newPaths[i].style.stroke = newVar[i];
        increment++;
      }

      if (increment === 0) {
        i++;
      } else {
        i += increment;
      }
    }

    // set svg background color
    newSvg.style.backgroundColor = shirtColor;

    results.appendChild(newSvg);
  }
}

function addColor() {
  const colorPicker = document.getElementById("colorPicker");
  const color = colorPicker.value;

  appendColor(color);
}

function appendColor(color) {
  const colorList = document.getElementById("colorList");
  const listItem = document.createElement("li");
  listItem.style.backgroundColor = color;

  // Add a label to each list item
  const label = document.createElement("label");
  label.textContent = color;
  listItem.appendChild(label);

  // Add a remove button to each list item
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.onclick = function () {
    colorList.removeChild(listItem);
    // remove the color from available colors
    threadColors.splice(threadColors.indexOf(color), 1);
    updateStats(
      threadColors.length,
      pathsWithFill.length + pathsWithOutline.length
    );
  };
  listItem.appendChild(removeButton);

  colorList.appendChild(listItem);

  threadColors.push(color);
  updateStats(
    threadColors.length,
    pathsWithFill.length + pathsWithOutline.length
  );
}

function updateStats(colorsLength, pathsAmount) {
  const stats = document.getElementById("stats");

  stats.innerHTML = `This will generate ${
    colorsLength ** pathsAmount
  } variations.`;
}

function handleSVGInput(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const svgContent = e.target.result;
      const svgContainer = document.getElementById("svgContainer");
      svgContainer.innerHTML = svgContent;
      updateMasterSVG(svgContainer);
    };
    reader.readAsText(file);
  }
}

function updateMasterSVG(newSVG) {
  // find all paths with fill
  const newPaths = newSVG.querySelectorAll("path");
  const newpathsWithFill = Array.from(newPaths).filter(
    (path) => path.style.fill !== "none"
  );
  const newpathsWithOutline = Array.from(newPaths).filter(
    (path) => path.style.stroke
  );

  // update global variables
  usedSVG = newSVG;
  paths = newPaths;
  pathsWithFill = newpathsWithFill;
  pathsWithOutline = newpathsWithOutline;

  updateStats(
    threadColors.length,
    pathsWithFill.length + pathsWithOutline.length
  );

  console.log("SVG updated");
}

updateMasterSVG(svgMaster);

presetColors.forEach((color) => {
  appendColor(color);
});

addColorButton.addEventListener("click", addColor);
generateButton.addEventListener("click", makeVariations);
fileInput.addEventListener("change", handleSVGInput);
