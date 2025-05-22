# User Management Dashboard

This project consists of a Go backend API and a React frontend for displaying and analyzing user data.

## Features

- Display user information in a sortable table
- Live computation of days since password change and last access
- Filter users by MFA status
- Highlight users who haven't changed passwords in over a year
- Highlight users who haven't accessed in over 90 days
- Material UI for modern styling

## Project Structure

- `/` - Go backend API
- `/frontend` - React frontend application

## Setup Instructions

### Backend (Go)

1. Ensure you have Go installed (version 1.15+ recommended)
2. Run the Go server:

```bash
go run main.go
```

The server will start on port 8080 and provide the `/api/users` endpoint.

### Frontend (React)

1. Make sure you have Node.js installed (version 14+ recommended)
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The React app will start on port 3000 and automatically open in your browser.

## Architecture and Design Notes

### Backend

- Simple Go HTTP server that serves mock user data
- CORS enabled to allow requests from the frontend
- JSON serialization for API responses

### Frontend

- React with TypeScript for type safety
- Material-UI for components and styling
- Axios for API requests
- date-fns for date calculations
- Component-based architecture for maintainability

### State Management

- React Hooks (useState, useEffect) for local component state
- No global state management needed for this simple application

### Data Flow

1. React app loads and fetches data from the Go backend API
2. User data is transformed and displayed in the table
3. Live calculations for days since password change and last access
4. Client-side filtering by MFA status

### Screenshots of the Application

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/69cd6544-fa97-4886-9dc3-1520a5d58d52" />
Filtering with MFA
<img width="1497" alt="image" src="https://github.com/user-attachments/assets/05dfea0b-b698-4a46-9ce8-ed15fd2c72e7" />
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/16d55377-13e8-410d-879d-48175c91230b" />

### Unit Tests Screenshots

<img width="328" alt="image" src="https://github.com/user-attachments/assets/f79e38bc-767c-42a6-927f-cea2343a4a99" />
<img width="407" alt="image" src="https://github.com/user-attachments/assets/41a1a672-c947-4855-b106-72bea2bc332f" />





