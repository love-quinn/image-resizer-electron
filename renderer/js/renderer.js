const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

//Ensure file is image
const isFileImage = (file) => {
  const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg']
  return file && acceptedImageTypes.includes(file['type']);
}

const getOriginalFileDimensions = (file) => {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function() {
    widthInput.value = image.width;
    heightInput.value = image.height;
  }
}

function loadImage(e) {
  const file = e.target.files[0];

  if(!isFileImage(file)) {
    alert('Please select an image');
    return;
  }

  getOriginalFileDimensions(file);

  form.style.display = 'block'
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer')
}

img.addEventListener('change', loadImage);
