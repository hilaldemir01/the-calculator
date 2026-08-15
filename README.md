# Full-Stack Calculator

This project is a modern, responsive, full-stack calculator.

##  Features
- **Advanced Math:** Standard operations:
  - addition (+)
  - subtraction (-)
  - division (/)
  - multiplication (*)
  - exponentiation (xʸ)
  - square root (√)
  - percentages (%)
- **Dynamic UI/UX:**
  - Dark/light mode toggle is supported
  - useRef is used to scale down font sizes in the expression in case the user wants to calculate long expresions
  - Responsive design is supported in order to use it in mobile devices and different sized devices
- **Strict Validation:**
  - 15-digit maximum limit for each inputted number
  - Numbers cannot be divided by zero and displays error

##  Architecture & Design Decisions
- **Frontend:**
  - Built with React, TypeScript, and Vite for extreme speed and type safety.
- **Backend Strategy** 
  - The task required the Go programming language implementation, I have implemented the program in Java first, and used AI agents to convert it to a Go project with my personal research on the Go programming language.
  - I also wanted to implement the backend in JAva to reflect my deep professional expertise in the Java ecosystem. It allowed me to showcase enterprise-grade structure, robust exception handling, and clean DTO isolation while perfectly fulfilling the REST API requirements.

##  Running with Docker
You can launch both the frontend and backend simultaneously using Docker Compose.

1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up -d --build

## How to Interact with the Application
 - Open your browser:

Frontend: http://localhost:5173
Backend API: http://localhost:8080/api/calculate

##  Running Locally (Without Docker)
1. Backend Setup (Java / Spring Boot)
    Ensure you have JDK 17+ and Maven installed.
    Run these commands on the terminal in the IDE you have chosen ( I have used IntelliJ IDEA):
   
      cd backend-java
      mvn clean install -DskipTests
      mvn spring-boot:run
   
    The Spring Boot API will start on http://localhost:8080
  
    (Alternative: Go Backend)
    If you wish to run the Go backend version instead of Java,  Run these commands on the terminal in the IDE you have chosen (I have used Visual Studio Code):
        cd backend
        go run main.go
    The Go API will start on http://localhost:8080

  3. Frontend Setup (React / Vite) 
    Ensure you have Node.js 18+ installed.
    Run these commands on the terminal in the IDE you have chosen (I have used Visual Studio Code):
      cd ui
      npm install
      npm run dev
     
    The React app will open on http://localhost:5173

##  API Documentation (REST API)
  The backend exposes a single REST endpoint to evaluate mathematical expressions.
  
    POST /api/calculate
    URL: http://localhost:8080/api/calculate
    
    Content-Type: application/json
  
  Request Example (JSON):
    JSON
    {
      "expression": "5 + 5 * 2"
    }
    Response Example (Success - 200 OK):
    JSON
    {
      "result": 15.0,
      "error": null
    }
    
  Response Example (Error / Division by Zero - 400 Bad Request):
    JSON
    {
      "result": null,
      "error": "Geçersiz matematiksel ifade veya sıfıra bölme hatası"
    }
  cURL Command for Testing:
    You can test the backend directly via terminal using cURL:

    curl -X POST http://localhost:8080/api/calculate \
      -H "Content-Type: application/json" \
      -d "{\"expression\":\"10 ** 2 + SQRT(16)\"}"
    
## Running Tests
  Frontend Tests: Run npm run test inside the ui folder to execute Vitest suites.
  
  Backend Tests: Run mvn test inside the backend-java folder to execute JUnit tests.

   
