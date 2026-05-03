# CivicQ

CivicQ is an AI-powered civic education and election assistance platform. It is designed to guide users through the democratic process, from understanding voter registration to finding polling stations and exploring election scenarios. The application features a dynamic, multilingual interface and an intelligent chatbot to answer civic queries in real-time.

## Features

- **Multilingual AI Assistant**: An intelligent chatbot powered by Llama-3 (via Groq API) that answers election-related questions natively in English, Hindi, Marathi, Gujarati, and Kannada.
- **Smart Registration Hub**: Allows users to upload their voter ID or Aadhar card. The system uses Optical Character Recognition (OCR) via Tesseract.js to extract data and provides AI-driven validation of the document.
- **Polling Station Finder**: An interactive map integrating OpenStreetMap and Leaflet to help users locate nearby polling stations based on their geographical location.
- **Election Walkthrough & Timeline**: Step-by-step guides and interactive timelines detailing the entire electoral process, complete with "Explain Like I'm 5" (ELI5) simplified modes.
- **Scenario Simulator**: A "What If" module that allows users to explore real-world election scenarios and understand their outcomes.
- **Localization (i18n)**: Full platform internationalization, seamlessly switching the entire UI and AI context between 5 different languages.

## Technology Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Custom CSS (Glassmorphism & Neobrutalism aesthetics)
- **Mapping**: React-Leaflet
- **Localization**: react-i18next
- **Document Parsing**: pdfjs-dist

### Backend
- **Framework**: Node.js with Express
- **AI Integration**: Groq API (llama-3.3-70b-versatile)
- **OCR**: Tesseract.js
- **Location Services**: OpenStreetMap / Nominatim API

## Prerequisites

- Node.js (v18 or higher recommended)
- A Groq API Key
- An OpenL Translate RapidAPI Key (for generating translations via scripts)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/civicq.git
cd civicq
```

### 2. Set up the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your Groq API key:
```env
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```
Start the backend server:
```bash
npm start
```

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

## Deployment

For production, it is recommended to deploy the frontend and backend separately:
- **Frontend**: Deploy the `client` directory to a static hosting service like Netlify or Vercel. Be sure to configure the `VITE_API_URL` environment variable to point to your live backend.
- **Backend**: Deploy the `server` directory to a Node.js hosting provider like Render, Railway, or Heroku. Ensure all environment variables (like `GROQ_API_KEY`) are securely configured.

## License

This project is licensed under the MIT License.