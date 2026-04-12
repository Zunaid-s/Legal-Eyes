const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeDocument = async (req, res) => {
  try {
    const { text } = req.body; 
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze the following legal text and simplify it for a student.
      Provide the response strictly in the following JSON format:
      {
        "summary": "Short overview",
        "keyPoints": ["point 1", "point 2"],
        "risks": ["potential risk 1"],
        "simplerTerms": "Very easy explanation"
      }
      Legal Text: ${text}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
};

module.exports = { analyzeDocument };