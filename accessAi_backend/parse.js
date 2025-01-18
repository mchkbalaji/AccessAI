import fs from "fs";

function parseJsonChunks() {
  try {
    const fileContent = fs.readFileSync("response.txt", "utf8");
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

const parsedData = parseJsonChunks();
const data = JSON.stringify(parsedData, null, 2);
fs.writeFileSync("parsed_output.json", data);
