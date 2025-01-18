import fs from "fs";

function parseCodeBlocks() {
  try {
    // Read parsed JSON file
    const data = JSON.parse(fs.readFileSync("parsed_output.json", "utf8"));

    // Create output directory if it doesn't exist
    const outputDir = "generated_code";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Process each JSON object
    data.forEach((item, index) => {
      if (item.correctedCode) {
        // Clean the code
        let code = item.correctedCode
          .trim()
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"');

        // Write to file
        const fileName = `${outputDir}/solution_${index + 1}.js`;
        fs.writeFileSync(fileName, code);
        console.log(`Created: ${fileName}`);
      }
    });

    console.log("Code extraction complete!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

parseCodeBlocks();
