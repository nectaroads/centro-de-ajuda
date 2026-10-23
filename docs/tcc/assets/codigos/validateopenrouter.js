const recommendation = result?.content;

const validResult =
    typeof recommendation?.service_name === "string" &&
    typeof recommendation?.phone_number === "string" &&
    typeof recommendation?.emergency_context === "string";

if (!validResult) {
    return res.status(500).json({
        success: false,
        reason: "Invalid model response"
    });
}

return res.status(200).json({
    success: true,
    service_name:
        recommendation.service_name,
    phone_number:
        recommendation.phone_number,
    emergency_context:
        recommendation.emergency_context
});

