let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
async function startAudioRecording() {
  const stream = await requestMicrophoneAccess();
  if (!stream) return false;
  audioChunks = [];
  audioBlob = null;
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.addEventListener("dataavailable", event => {
    if (event.data.size > 0) audioChunks.push(event.data);
  });
  mediaRecorder.addEventListener("stop", () => {
    audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
    stream.getTracks().forEach(track => track.stop());
    audioStream = null;
  });
  mediaRecorder.start();
  return true;
}
function stopAudioRecording() {
  if (mediaRecorder?.state === "recording") mediaRecorder.stop();
}
