const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
let imageFile = null;
imageInput.addEventListener("change", event => {
  const selectedFile = event.target.files[0];
  if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
  imageFile = selectedFile;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imagePreview.src = reader.result;
    imagePreview.hidden = false;
  });
  reader.readAsDataURL(imageFile);
});
