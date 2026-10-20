function configureCallButton(phoneNumber) {
  const callButton = document.getElementById("call-button");
  const sanitizedNumber = phoneNumber.replace(/\D/g, "");
  if (!sanitizedNumber) {
    callButton.hidden = true;
    callButton.removeAttribute("href");
    return;
  }
  callButton.href = `tel:${sanitizedNumber}`;
  callButton.hidden = false;
}
