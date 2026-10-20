let audioStream = null;
async function requestMicrophoneAccess() {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return audioStream;
  } catch (error) {
    console.error("Não foi possível acessar o microfone:", error);
    return null;
  }
}
