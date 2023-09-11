const presetColors = ["#000000", "#fb00ff", "#fff900"];
const threadColors = [];

const svgMaster = document.getElementById("svg-master");
const svgMaster2 = document.getElementById("svg-master2");
const generateButton = document.getElementById("but-generate");
const addColorButton = document.getElementById("but-addColor");
const results = document.getElementById("results");
const fileInput = document.getElementById("fileInput");

// buttons for setting master file
const butClassic = document.getElementById("button-classic");
const butSwirl = document.getElementById("button-swirl");

var usedSVG = null;
var paths = [];
var pathsWithFill = [];
var pathsWithOutline = [];

// master type enum
const masterType = {
  CLASSIC: "classic",
  SWIRL: "swirl",
};

function updateMasterViewport(type) {
  switch (type) {
    case masterType.CLASSIC:
      svgMaster.style.display = "block";
      svgMaster2.style.display = "none";
      break;
    case masterType.SWIRL:
      svgMaster.style.display = "none";
      svgMaster2.style.display = "block";
      break;
    default:
      svgMaster.style.display = "block";
      svgMaster2.style.display = "none";
  }
}

function switchMasterSVG(type) {
  switch (type) {
    case masterType.CLASSIC:
      updateMasterSVG(svgMaster);
      break;
    case masterType.SWIRL:
      updateMasterSVG(svgMaster2);
      break;
    default:
      updateMasterSVG(svgMaster);
  }

  updateMasterViewport(type);
}

function generateColorVariations(colors, length) {
  const variations = [];

  function generateVariations(currentVariation, remainingLength) {
    if (remainingLength === 0) {
      variations.push(currentVariation);
      return;
    }

    for (const color of colors) {
      generateVariations(
        currentVariation.concat(color.value),
        remainingLength - 1
      );
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

function editColor(colorId, newColor, listItem) {
  console.log("edit color", colorId);
  // update the color object in threadColors array by id
  const index = threadColors.findIndex((color) => color.id === colorId);

  if (index <= -1) return;

  threadColors[index].value = newColor;
  listItem.style.backgroundColor = newColor;
  listItem.querySelector("label").textContent = newColor;
}

function removeColor(colorId, listItem, colorList) {
  console.log("remove color", colorId);
  // remove the color object from threadColors array by id
  const index = threadColors.findIndex((color) => color.id === colorId);

  if (index <= -1) return;

  threadColors.splice(index, 1);
  colorList.removeChild(listItem);
  updateStats();
}

function appendColor(color) {
  // add color object to available colors
  const newColorId = threadColors.length;
  threadColors.push({ id: newColorId, value: color });

  const colorList = document.getElementById("colorList");
  const listItem = document.createElement("li");
  listItem.style.backgroundColor = color;

  // Add a label to list item
  const label = document.createElement("label");
  label.textContent = color;
  listItem.appendChild(label);

  // Add an edit button to list item
  const editInput = document.createElement("input");
  editInput.type = "color";
  editInput.value = color;
  editInput.oninput = () => editColor(newColorId, editInput.value, listItem);
  listItem.appendChild(editInput);

  // Add a remove button to list item
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.onclick = () => removeColor(newColorId, listItem, colorList);
  listItem.appendChild(removeButton);

  // Add the color element to the lost
  colorList.appendChild(listItem);

  updateStats();
}

function updateStats() {
  const stats = document.getElementById("stats");
  const variationCount =
    threadColors.length ** (pathsWithFill.length + pathsWithOutline.length);

  stats.innerHTML = `This will generate ${variationCount} variations.`;
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
updateMasterViewport(masterType.CLASSIC);

presetColors.forEach((color) => {
  appendColor(color);
});

addColorButton.addEventListener("click", addColor);
generateButton.addEventListener("click", makeVariations);
fileInput.addEventListener("change", handleSVGInput);
// buttons for setting master file
butClassic.addEventListener("click", () => switchMasterSVG(masterType.CLASSIC));
butSwirl.addEventListener("click", () => switchMasterSVG(masterType.SWIRL));
