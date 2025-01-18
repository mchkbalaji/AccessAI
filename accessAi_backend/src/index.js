import express from "express";
import pa11y from "pa11y";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = new express();
const genAI = new GoogleGenerativeAI("AIzaSyDteCLr8VTaultT66oJdOTy1Zl2duTZEg4");

app.use(express.json());

function parseJsonChunks(fileContent) {
  try {
    const jsonArray = [];
    const chunks = fileContent.split("```json");

    chunks.forEach((chunk, index) => {
      if (chunk.trim()) {
        try {
          // Clean the chunk
          let cleanChunk = chunk.split("```")[0].trim();

          // Find JSON content between curly braces
          const match = cleanChunk.match(/{[\s\S]*}/);

          if (match) {
            let jsonString = match[0];

            // Handle code blocks with backticks
            jsonString = jsonString.replace(/:\s*`([^`]+)`/g, (match, code) => {
              // Escape the code content properly
              const escapedCode = code
                .replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n");
              return `: "${escapedCode}"`;
            });

            // Clean up any remaining whitespace
            jsonString = jsonString.replace(/\s+/g, " ");

            const jsonObject = JSON.parse(jsonString);
            jsonArray.push(jsonObject);
          }
        } catch (parseError) {
          console.log(`Error parsing chunk ${index}:`, parseError.message);
        }
      }
    });

    console.log(`Successfully parsed ${jsonArray.length} JSON objects`);
    return jsonArray;
  } catch (error) {
    console.error("Error reading file:", error.message);
    return [];
  }
}


const getLlmResponse = async (data) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(data);
  const response = await result.response;
  const text = response.text();
  return parseJsonChunks(text);
};

function writeQuery(pallyResults) {
  const query =
    `You are given a list of accessibility issues in HTML. For each issue:

Fix the problems and return a separate JSON chunk in the following format, where the "correctedCode" should be JavaScript that will perform the correction when executed:
{
    "title": "A small title for describing the problem",
    "correctedCode": "<JavaScript_Code_To_Fix>"
}
Ensure that each JSON chunk contains the JavaScript code needed to fix the specific issue.` +
    JSON.stringify(pallyResults);
  return query;
}

app.get("/scrape", async (req, res) => {
  const url = req.body.url;
  const results = await pa11y(url);

  const query = writeQuery(results);
  const llmResults = await getLlmResponse(query);

  return res.json(llmResults);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
