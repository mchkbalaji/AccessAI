function fixCenterTag(element) {
  const centerElement = element.querySelector("center");
  if (centerElement) {
    const div = document.createElement("div");
    div.style.textAlign = "center";
    while (centerElement.firstChild) {
      div.appendChild(centerElement.firstChild);
    }
    centerElement.parentNode.replaceChild(div, centerElement);
  }
}

const body = document.querySelector("body");
fixCenterTag(body);
