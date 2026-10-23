function assistantprompt(context) {
    return `
# Informações
Horário/Dia Atual: ${context.emergency.time}
Rua: ${context.location.street}
Bairro: ${context.location.neighborhood}
Cidade: ${context.location.city}
Estado: ${context.location.state}
País: ${context.location.country}
CEP: ${context.location.zip}
`;
}
