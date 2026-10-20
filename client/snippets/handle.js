async function handleServerResponse(response) {
  let result;
  try {
    result = await response.json();
  } catch (error) {
    showResponseError("O servidor retornou uma resposta inválida. Tente novamente.");
    return;
  }
  const validResponse = response.ok && typeof result?.service_name === "string" && typeof result?.phone_number === "string" && typeof result?.emergency_context === "string";
  if (!validResponse) {
    showResponseError(result?.error || "Não foi possível analisar a ocorrência. Tente novamente.");
    return;
  }
  document.getElementById("service-name").textContent = result.service_name;
  document.getElementById("phone-number").textContent = result.phone_number;
  document.getElementById("emergency-context").textContent = result.emergency_context;
  configureCallButton(result.phone_number);
  showScreen("result-screen");
}
function showResponseError(message) {
  const errorMessage = document.getElementById("request-error");
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  showScreen("initial-screen");
}
