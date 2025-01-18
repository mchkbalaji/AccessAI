# AccesAI: AI-Powered Website Accessibility Enhancer

TEAM NAME: TEAM202
TEAM LEADER: Kollakota Siva Sai

AccesAI is an AI-powered tool designed to enhance website accessibility. Using computer vision, web scraping technologies, and AI models, AccesAI identifies accessibility issues on websites and automatically suggests or implements fixes. The tool is aimed at improving accessibility for users with disabilities by providing solutions like alt text for images, clearer labels for form elements, and better color contrast.

## Features

### 1. **Alt Text for Images**
AccesAI automatically detects images without alt attributes and generates meaningful alt text for them, improving the accessibility of images for visually impaired users.

### 2. **Color Contrast Enhancement**
The tool detects elements with insufficient color contrast and suggests adjustments to meet WCAG (Web Content Accessibility Guidelines) standards, ensuring content is readable for users with color vision deficiencies.

### 3. **Improved Form Labels**
AccesAI ensures that all form elements (such as input fields, buttons, etc.) are correctly labeled, providing better clarity for screen readers and enhancing the user experience.

### 4. **Automatic Fixes**
Once issues are identified, AccesAI can automatically apply fixes or suggest the necessary code updates, making it easy to improve website accessibility without manual intervention.

## Tech Stack

- **JavaScript** (for the main tool functionality)
- **AI Models** (for generating alt text and analyzing accessibility issues)
- **Pa11y Library** (for website analysis and accessibility issue detection)
- **Node.js** (for backend and server-side processing)
- **Web Scraping Technologies** (for extracting content from websites)

## Getting Started

To run AccesAI locally, follow these steps:

### Prerequisites

- **Node.js** (>= 14.x)
- **npm** (>= 6.x)
- You will also need an active internet connection to fetch website data and analyze it.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/accesai.git
