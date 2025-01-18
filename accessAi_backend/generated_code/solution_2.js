function fixAlignAttribute(element) {
  const tdElements = element.querySelectorAll("td[align]");
  tdElements.forEach((td) => {
    const align = td.getAttribute("align");
    td.style.textAlign = align;
    td.removeAttribute("align");
    if (td.hasAttribute("nowrap")) {
      td.style.whiteSpace = "nowrap";
      td.removeAttribute("nowrap");
    }
  });
}

const body = document.querySelector("body");
fixAlignAttribute(body);
