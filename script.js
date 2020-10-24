//Selecting elements and creating global variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type=range]");
const currentHeaders = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector(".copy-container");
const lockBtn = document.querySelectorAll(".lock");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustBtn = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
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

currentHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    copyToClipboard(header);
  });
});

adjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustments(index);
  });
});

closeAdjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustments(index);
  });
});

generateBtn.addEventListener("click", randomColorGenerate);

lockBtn.forEach((button, index) => {
  button.addEventListener("click", (event) => {
    lockCurrentColor(event, index);
  });
});

//Functions
//Generate hex code
function generateHex() {
  //Using chroma js
  const hexColor = chroma.random();
  return hexColor;
  //Using vanilla JS
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
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }
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
  //Check for button contrast
  adjustBtn.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockBtn[index]);
  });
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
function copyToClipboard(header) {
  //Adding text area and getting the value
  const textArea = document.createElement("textarea");
  textArea.value = header.innerText;
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
  }, 800);
}

function openAdjustments(index) {
  sliderContainers[index].classList.toggle("active");
}

function closeAdjustments(index) {
  sliderContainers[index].classList.remove("active");
}

function lockCurrentColor(event, index) {
  const lockIcon = event.target.children[0];
  const activeColor = colorDivs[index];
  activeColor.classList.toggle("locked");

  if (lockIcon.classList.contains("fa-lock-open")) {
    event.target.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    event.target.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

randomColorGenerate();

//Local storage
let savedPalettes = [];
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const error = document.querySelector(".save-container p");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibrary = document.querySelector(".close-library");
const libraryPopup = libraryContainer.children[0];
const savePopup = saveContainer.children[0];

//Event listeners
saveBtn.addEventListener("click", () => {
  saveContainer.classList.add("active");
  savePopup.classList.add("active");
  saveInput.focus();
});

closeSave.addEventListener("click", () => {
  saveContainer.classList.remove("active");
  savePopup.classList.remove("active");
  error.innerText = "";
  savePopup.style.animation = "";
});

submitSave.addEventListener("click", savePalette);

libraryBtn.addEventListener("click", () => {
  libraryContainer.classList.add("active");
  libraryPopup.classList.add("active");
});

closeLibrary.addEventListener("click", () => {
  libraryContainer.classList.remove("active");
  libraryPopup.classList.remove("active");
});

//Functions
function savePalette() {
  const name = saveInput.value;
  if (name.length == 0) {
    error.innerText = "Please add a name";
    savePopup.style.animation = "shake .2s";
  } else {
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
    const colors = [];

    currentHeaders.forEach((header) => {
      colors.push(header.innerText);
    });
    //Generate object
    let paletteNumber = savedPalettes.length;
    const paletteObject = {
      name: name,
      colors: colors,
      paletteNumber: paletteNumber,
    };
    savedPalettes.push(paletteObject);
    //Save to local storage
    saveToLocalStorage(paletteObject);
    saveInput.value = "";
    error.innerText = "";

    //Generate the palette to library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObject.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObject.colors.forEach((smallColor) => {
      const smallDiv = document.createElement("div");
      smallDiv.style.backgroundColor = smallColor;
      preview.appendChild(smallDiv);
    });

    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette");
    paletteBtn.classList.add(paletteObject.paletteNumber);
    paletteBtn.innerText = "Select";

    //Add event listener to palette button
    paletteBtn.addEventListener("click", (event) => {
      libraryContainer.classList.remove("active");
      libraryPopup.classList.remove("active");

      const paletteIndex = event.target.classList[1];
      initialColors = [];
      savedPalettes[paletteIndex].colors.forEach((color, index) => {
        initialColors.push[color];
        colorDivs[index].style.backgroundColor = color;
        const text = colorDivs[index].children[0];
      });
    });

    //Append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
  }
}

function saveToLocalStorage(paletteObject) {
  let localPalette;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }

  localPalettes.push(paletteObject);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}
