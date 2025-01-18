import express from "express";
import pa11y from "pa11y";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

const app = new express();
const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);

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

Fix the problems and return a separate JSON chunk in the following format:
{
    "title": "A small title for describing the problem",
    "selector": "the string which i should pass to document.querySelector() to select the element",
    "setAttributes": {
        "attributeName": "value" (these are the attributes which you need to set)
    },
    "innerhtml": "if you want to change the innerhtml else just return empty string"
}
Ensure that each JSON chunk contains the above json properties to fix the specific issue.` +
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

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
