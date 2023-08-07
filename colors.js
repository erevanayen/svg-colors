const availableColors = ["#000000", "#fb00ff", "#fff900"];
const shirtColor = "#444444";

const svgMaster = document.getElementById("svg-master");
const generateButton = document.getElementById("but-generate");
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
  const colorVariations = generateColorVariations(
    availableColors,
    paths.length
  );

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

generateButton.addEventListener("click", makeVariations);
