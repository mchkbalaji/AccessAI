function removePresentationRole(element) {
  const tableElements = element.querySelectorAll('table[role="presentation"]');
  tableElements.forEach((table) => {
    if (table.querySelectorAll("*").length > 0) {
      // Check if it contains any child element.
      table.removeAttribute("role");
    }
  });
}

const body = document.querySelector("body");
removePresentationRole(body);
