
// document.addEventListener("DOMContentLoaded", () => {
//   const startAnalysisButton = document.getElementById("start-analysis-button");

//   if (startAnalysisButton) {
//     startAnalysisButton.addEventListener("click", () => {
//       chrome.runtime.sendMessage({ action: "startAnalysis" }, (response) => {
//         if (response.success && response.data) {
//           createButtons(response.data);
//         } else {
//           console.error("Failed to fetch analysis data.");
//         }
//       });
//     });
//   }

//   function createButtons(jsonData) {
//     const buttonContainer = document.createElement('div');
//     buttonContainer.className = 'button-container';

//     jsonData.forEach((item, index) => {
//       const button = document.createElement("button");
//       button.textContent = item.title;
//       button.id = `button-${index}`;
//       buttonContainer.appendChild(button);

//       button.addEventListener("click", () => {
//         chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//           chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             func: executeCodeInTab,
//             args: [item] // Pass the code string
//           });
//         });
//       });
//     });

//     document.body.appendChild(buttonContainer);
//   }
// });

// // This function will be injected into the tab
// function executeCodeInTab(jsonData) {
//  // Get the element based on the selector
//  const element = document.querySelector(jsonData.selector);

//  if (!element) {
//      console.error('Element not found for selector: ${jsonData.selector}');
//      return;
//  }

//  // Handle setting attributes
//  if (jsonData.setAttributes) {
//      for (let attr in jsonData.setAttributes) {
//          element.setAttribute(attr, jsonData.setAttributes[attr]);
//      }
//  }

//  // Handle modifying innerHTML if provided
//  if (jsonData.innerhtml !== "") {
//      element.innerHTML = jsonData.innerhtml;
//  }

//  // Handle 'style' attribute (if applicable)
//  if (jsonData.setAttributes && jsonData.setAttributes.style) {
//      const newStyle = jsonData.setAttributes.style;
//      const existingStyle = element.getAttribute('style') || '';

//      // Append new style to existing ones, if any
//      element.setAttribute('style', `${existingStyle} ${newStyle}`);
//   }

// }

document.addEventListener("DOMContentLoaded", () => {
  const startAnalysisButton = document.getElementById("start-analysis-button");

  if (startAnalysisButton) {
    startAnalysisButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "startAnalysis" }, (response) => {
        if (response.success && response.data) {
          createCheckboxes(response.data);
        } else {
          console.error("Failed to fetch analysis data.");
        }
      });
    });
  }

  function createCheckboxes(jsonData) {
    const container = document.createElement('div');
    container.className = 'checkbox-container';

    jsonData.forEach((item, index) => {
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.className = 'form-check';

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input";
      checkbox.id = `checkbox-${index}`;

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.setAttribute("for", `checkbox-${index}`);
      label.textContent = item.title;

      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(label);
      container.appendChild(checkboxWrapper);

      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: executeCodeInTab,
              args: [item]
            });
          });
        }
      });
    });

    document.body.appendChild(container);
  }
});

// This function will be injected into the tab
function executeCodeInTab(jsonData) {
  const element = document.querySelector(jsonData.selector);

  if (!element) {
    console.error(`Element not found for selector: ${jsonData.selector}`);
    return;
  }

  if (jsonData.setAttributes) {
    for (let attr in jsonData.setAttributes) {
      element.setAttribute(attr, jsonData.setAttributes[attr]);
    }
  }

  if (jsonData.innerhtml !== "") {
    element.innerHTML = jsonData.innerhtml;
  }

  if (jsonData.setAttributes && jsonData.setAttributes.style) {
    const newStyle = jsonData.setAttributes.style;
    const existingStyle = element.getAttribute("style") || "";
    element.setAttribute("style", `${existingStyle} ${newStyle}`);
  }
}
