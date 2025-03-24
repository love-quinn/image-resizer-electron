const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
let dimensions = {};
let aspectRatio;

//Ensure file is image
const isFileImage = (file) => {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];
  return file && acceptedImageTypes.includes(file["type"]);
};

const showAlert = (message, type) => {
  const SUCCESS_COLOR = "#44d62c";
  const ERROR_COLOR = "#ff0033";

  const background = type === "success" ? SUCCESS_COLOR : ERROR_COLOR;
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: background,
      color: "white",
      textAlign: "center",
    },
  });
};

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    showAlert("Please select an image", "error");
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
    aspectRatio = this.width / this.height
    const imagePath = electron.showFilePath(file);
    dimensions = { width: this.width, height: this.height, imgPath: imagePath };
  };

  form.style.display = "block";
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

//Send image data to main
function sendImage(e) {
  e.preventDefault();

  if (!img.files[0]) {
    showAlert("Please upload an image", "error");
    return;
  }

  // const file = img.files[0];
  const conversionWidth = widthInput.value;
  const conversionHeight = heightInput.value;

  if (conversionWidth === "" || height === "") {
    showAlert("Please fill in a height and width", "error");
    return;
  }

  // Send to main using ipcRenderer
  ipcRenderer.send("image:resize", {
    imgPath: dimensions.imgPath,
    width: conversionWidth,
    height: conversionHeight,
  });

  // Catch the image:done event
  ipcRenderer.on("image:done", () => {
    showAlert(
      `Image resized to ${widthInput.value} x ${heightInput.value}`,
      "success"
    );
  });

  // Catch the image:error event
  ipcRenderer.on("image:error", (errorMessage) => {
    console.log(errorMessage);
    showAlert(`Error: ${errorMessage}`, "error");
  });
}

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);

widthInput.addEventListener("input", () => {
  if (widthInput.value) {
    heightInput.value = Math.round(Number(widthInput.value) / aspectRatio);
  }
});

heightInput.addEventListener("input", () => {
  if (heightInput.value) {
    widthInput.value = Math.round(Number(heightInput.value) * aspectRatio);
  }
});
