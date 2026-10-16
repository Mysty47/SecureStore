# SecureStore

## Run locally

Start Spring Boot in one PowerShell terminal (JDK 21 required):

```powershell
cd C:\Users\Dimitar\Documents\SecureStore\backend\secure_store\secure_store
.\mvnw.cmd spring-boot:run
```

Start React in another terminal:

```powershell
cd C:\Users\Dimitar\Documents\SecureStore\frontend\secure_store_frontend
npm run dev
```

Open http://localhost:3100. Restart Vite after changing its configuration.
Vite uses port 3100 and reports an error if that port is already occupied.
The page checks the backend automatically and lets you check again. Requests
time out after five seconds and show an error if the backend is unavailable.

## How the connection works

React requests `/api/health`. During development, Vite forwards `/api` requests
to `http://localhost:8080`. Spring's `HealthController` returns:

```json
{"status":"UP"}
```

This checks that the application responds to HTTP requests; it does not check
storage or database health. The Vite proxy is for development only. A production
deployment must route `/api` to Spring Boot through its web server or reverse proxy.

## Checks

In the frontend folder, run `npm run build` and `npm run lint`.
In the backend folder, run `.\mvnw.cmd test`.
