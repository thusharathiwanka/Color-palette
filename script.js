//Selecting elements and creating global variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelector("input[type=range]");
const currentHeaders = document.querySelectorAll(".color h2");
let initialColors;

//Generate hex code
function generateHex() {
  //Using chroma js
  const hexColor = chroma.random();
  return hexColor;
  /* const hexString = "0123456789ABCDEF";
  let hash = "#";

  for (let i = 0; i < 6; i++) {
    hash += hexString[Math.floor(Math.random() * 16)];
  }

  return hash; */
}

//Random color generator
function randomColorGenerate() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    //Setting color to the div background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    //Checking contrast
    checkTextContrast(randomColor, hexText);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();

  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

randomColorGenerate();
