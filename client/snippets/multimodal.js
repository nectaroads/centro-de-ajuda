const content = [];
if (user) content.push({ type: "text", text: user });
if (image) {
  const ext = image.split(".").pop().toLowerCase();
  const fmt = ext === "jpg" ? "jpeg" : ext;
  content.push({ type: "image_url", image_url: { url: `data:image/${fmt};base64,` + fileToBase64(image) } });
}
if (audio) content.push({ type: "input_audio", input_audio: { data: fileToBase64(audio), format: "ogg" } });
