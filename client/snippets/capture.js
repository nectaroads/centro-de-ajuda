function captureText() {
  const textInput = document.getElementById("occurrence-text");
  const text = textInput.value.trim();
  return text || null;
}
