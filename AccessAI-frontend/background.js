chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startAnalysis") {
    // Get the active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTabUrl = tabs[0].url; // Get the URL of the active tab

        // Send a request with the current tab's URL in the body
        fetch("http://localhost:8080/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: activeTabUrl }), // Include the tab URL in the request body
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the JSON response
          })
          .then((jsonData) => {
            sendResponse({ success: true, data: jsonData });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            sendResponse({ success: false, error: error.message });
          });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});
