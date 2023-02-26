# InsightGPT
[![Build and Deploy Angular App](https://github.com/aymenfurter/InsightGPT/actions/workflows/main.yml/badge.svg)](https://github.com/aymenfurter/InsightGPT/actions/workflows/main.yml)

📄🔎 InsightGPT enables users to extract text from their uploaded PDF files and uncovers valuable information like dates and locations using Azure OpenAI Service. Users can specify precisely what they wish to analyze within the text by adjusting the settings. To demonstrate it's capabilities, I analyzed UFO sighting reports published by the National Archives in the UK. Extracting information from the unstructured text, such as the shape of the observed object and the type of observation (e.g. naked eye), worked like a charm.

🚀🌕 Live Demo: https://aymenfurter.github.io/InsightGPT

## Features
* Upload PDF files for text extraction (In-Browser).
* Extract additional information from text using Azure OpenAI Service.
* Specify what entities to extract through the settings.
* Start analysis through the network view.

## InsightGPT in action

Here you can see InsightGPT in action, analyzing UFO sightings reports from [The National Archives](https://www.nationalarchives.gov.uk/ufos/):

![Screenshot 1](intro.gif)

## Installation

To install InsightGPT, follow these steps:

1. Clone the repository
2. Install the required dependencies using `npm install`
3. Run the application using `ng serve`

## Acknowledgements

InsightGPT is based on the following technologies:

* Angular
* Angular Material UI
* vis.js
* Typescript
* Material
* Azure OpenAI Service

The sample data was gathered from:
* [The National Archives (UK)](https://www.nationalarchives.gov.uk/ufos/)
* [Occupational Safety and Health Administration (US)](https://www.osha.gov/)

## License
InsightGPT is licensed under the Apache License, Version 2.0.

## Disclaimer
The developers of InsightGPT are not responsible for any loss, injury, claim, liability, or damage related to your use of the application, whether from errors or omissions in the content of our website or any other linked sites, from the site being down, or from any other use of the site. Use at your own risk.

## Requirements
InsightGPT requires an [Azure Open AI Service](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/) instance and an API Key.
