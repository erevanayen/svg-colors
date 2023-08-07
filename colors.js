const presetColors = ["#000000", "#fb00ff", "#fff900", "#00f1e1", "#cc1c1c"];
const threadColors = [];

const svgMaster = document.getElementById("svg-master");
const generateButton = document.getElementById("but-generate");
const addColorButton = document.getElementById("but-addColor");
const results = document.getElementById("results");

// get all paths from the svg
const paths = svgMaster.querySelectorAll("path");
// separate paths with fill and paths with outline
const pathsWithFill = Array.from(paths).filter(
  (path) => path.style.fill !== "none"
);
const pathsWithOutline = Array.from(paths).filter((path) => path.style.stroke);

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
    const newSvg = svgMaster.cloneNode(true);
    const newPaths = newSvg.querySelectorAll("path");

    for (let i = 0; i < newPaths.length; ) {
      if (newPaths[i].style.fill !== "none") {
        newPaths[i].style.fill = newVar[i];
        i++;
      }
      if (newPaths[i].style.stroke) {
        newPaths[i].style.stroke = newVar[i];
        i++;
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
  };
  listItem.appendChild(removeButton);

  colorList.appendChild(listItem);

  threadColors.push(color);
}

presetColors.forEach((color) => {
  appendColor(color);
});

addColorButton.addEventListener("click", addColor);
generateButton.addEventListener("click", makeVariations);
