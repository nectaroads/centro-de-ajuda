function fileToBase64(filepath) {
    print("[Log] Convert: Creating base64 file");
    const completePath = path.join(__dirname, "..", "assets", filepath );
    return fs.readFileSync(completePath).toString("base64");
}

function extractJson(text) {
    if (!text) return null;

    const cleaned = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch {}

    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first === -1 || last === -1 || last <= first) return null;

    try {
        return JSON.parse(cleaned.slice(first, last + 1));
    } catch { return null; }
}
