const availableColors = ["#000000", "#fb00ff", "#fff900"];

const svgMaster = document.getElementById("svg-master");
const generateButton = document.getElementById("but-generate");
generateButton.addEventListener("click", changeColor);

// get all paths from the svg
const paths = svgMaster.querySelectorAll("path");
// separate paths with fill and paths with outline
const pathsWithFill = Array.from(paths).filter(
  (path) => path.style.fill !== "none"
);
const pathsWithOutline = Array.from(paths).filter((path) => path.style.stroke);

// go through all paths with fill and change the color
// todo: make sure that the same color is not used twice
function changeColor() {
  pathsWithFill.forEach((path) => {
    const index = Math.floor(Math.random() * availableColors.length);
    path.style.fill = availableColors[index];
  });

  pathsWithOutline.forEach((path) => {
    const index = Math.floor(Math.random() * availableColors.length);
    path.style.stroke = availableColors[index];
  });
}
