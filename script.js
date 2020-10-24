//Selecting elements and creating global variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type=range]");
const currentHeaders = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector(".copy-container");
let initialColors;

//Event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentHeaders.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

//Functions
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
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    //Adding initial colors to array
    initialColors.push(chroma(randomColor).hex());
    //Setting color to the div background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    //Checking contrast
    checkTextContrast(randomColor, hexText);
    //Initial colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSlider(color, hue, brightness, saturation);
  });
  //Reset inputs
  resetInputs();
}

//Checking for color contrast
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();

  //Changing the text color
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

//Changing the color background of range inputs
function colorizeSlider(color, hue, brightness, saturation) {
  //Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBright, "white"]);
  //Scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSat, color, fullSat]);

  //Update the hue range input
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
  //Update the brightness range input
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(
    0
  )}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`;
  //Update the saturation range input
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`;
}

//Update background colors
function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const currentColor = initialColors[index];

  let color = chroma(currentColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
  //Colorize sliders
  colorizeSlider(color, hue, brightness, saturation);
}

//Updating text ui
function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const CurrentText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controllers button");

  CurrentText.innerText = color.hex();
  //Check contrast
  checkTextContrast(color, CurrentText);

  //Changing control icon colors
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

//Resetting range slider according to color
function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");

  sliders.forEach((slider) => {
    if (slider.name == "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    } else if (slider.name == "brightness") {
      const brightnessColor =
        initialColors[slider.getAttribute("data-brightness")];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = Math.floor(brightnessValue * 100) / 100;
    } else if (slider.name == "saturation") {
      const saturationColor =
        initialColors[slider.getAttribute("data-saturation")];
      const saturationValue = chroma(saturationColor).hsl()[1];
      slider.value = Math.floor(saturationValue * 100) / 100;
    }
  });
}

//Copying to clipboard
function copyToClipboard(hex) {
  //Adding text area and getting the value
  const textArea = document.createElement("textarea");
  textArea.value = hex.innerText;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  //Add popup
  const copyPopup = copyContainer.children[0];
  copyContainer.classList.add("active");
  copyPopup.classList.add("active");

  //Removing popup
  setTimeout(() => {
    copyContainer.classList.remove("active");
    copyPopup.classList.remove("active");
  }, 1000);
}

randomColorGenerate();
