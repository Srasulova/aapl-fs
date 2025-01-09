# Apple Financial Data Filter

A web application that allows users to filter and analyze Apple Inc.'s financial data over the past years. Users can filter data based on revenue, net income, and year ranges, with the ability to sort results by different financial metrics.

## Live Demo

- Frontend: [https://aapl-fs-1.onrender.com](https://aapl-fs-1.onrender.com)
- Backend API: [https://aapl-fs.onrender.com/api/financial-data](https://aapl-fs.onrender.com/api/financial-data)

## Features

- Filter financial data by revenue range (in billions)
- Filter by net income range (in billions)
- Filter by year range
- Sort data by different financial metrics
- Responsive design
- Real-time filtering

## Local Development

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:

```
FLASK_APP=run.py
FLASK_DEBUG=1
API_KEY=your_api_key
API_BASE_URL=your_api_base_url
```

5. Run the development server:

```bash
flask run
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/financial-data
```

4. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Technologies Used

- Frontend:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - React Query
- Backend:
  - Python
  - Flask
  - Flask-CORS

## Deployment

The application is deployed on Render:

- Frontend is deployed as a Web Service
- Backend is deployed as a Web Service with Python runtime
