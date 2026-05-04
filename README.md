# CoverMe

An AI-powered excuse generator web application that helps you craft believable excuses for various situations. Built with Next.js frontend and FastAPI backend using Groq AI.

## Features

- Generate multiple excuse options for any situation
- Customize tone (Casual, Formal, Very Formal, Funny, Emotional, Serious)
- Adjust lie strength (Low, Medium, High)
- Add optional context for better results
- Copy excuses to clipboard
- Responsive web interface

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.8+
- **AI**: Groq API (Llama 3.1-8B model)
- **Styling**: Tailwind CSS

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Groq API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coverme
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate

   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   # Activate virtual environment if not already
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## API Usage

The backend provides a REST API endpoint:

**POST** `/api/generate`

Request body:
```json
{
  "situation": "I need an excuse for being late to work",
  "tone": "Casual",
  "lie_strength": "Low",
  "context": "Traffic was bad"
}
```

Response:
```json
{
  "excuses": [
    "Sorry, I got stuck in traffic.",
    "My alarm didn't go off.",
    "I had a family emergency."
  ],
  "best": "Sorry, I got stuck in traffic.",
  "tip": "Deliver with a sincere tone and offer to make up the time."
}
```

## Development

- **Linting**: `npm run lint` (frontend)
- **Building**: `npm run build` (frontend)
- **Testing**: Add your test scripts as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and entertainment purposes only. Use responsibly.

## Disclaimer

This application generates fictional excuses. The developers are not responsible for how the generated content is used.