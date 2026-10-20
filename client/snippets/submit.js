const helpForm = document.getElementById("help-form");
const submitButton = document.getElementById("submit-button");
let requestInProgress = false;
helpForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (requestInProgress) return;
  const text = captureText();
  const hasAudio = audioBlob instanceof Blob;
  const hasImage = imageFile instanceof File;
  if (!text && !hasAudio && !hasImage) {
    alert("Forneça um relato por texto, áudio ou imagem.");
    return;
  }
  requestInProgress = true;
  submitButton.disabled = true;
  showScreen("waiting-screen");
  try {
    const location = await getCurrentLocation();
    const occurrenceData = await buildOccurrenceData(text, location);
    const response = await fetch("/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(occurrenceData)
    });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    await handleServerResponse(response);
  } catch (error) {
    console.error("Erro ao enviar a solicitação:", error);
    showResponseError("Não foi possível processar a solicitação. Tente novamente.");
  } finally {
    requestInProgress = false;
    submitButton.disabled = false;
  }
});
