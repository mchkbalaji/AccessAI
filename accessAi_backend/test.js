const htmlFunction = new Function("\n const htmlElement = document.querySelector('html');\n if (!htmlElement.hasAttribute('lang')) {\n htmlElement.setAttribute('lang', 'en'); // Replace 'en' with the appropriate language code\n }\n ");

htmlFunction();

console.log(htmlFunction.toString());