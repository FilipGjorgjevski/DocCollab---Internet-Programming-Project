# DocCollab - Real-Time Collaborative Document Editor

Internet Programming
Filip Gjorgjevski 5349
December 2025

## 1. Project Goal
The goal of **DocCollab** is to create a seamless, real-time multiplayer workspace similar to Google Docs. It demonstrates modern frontend development competencies by solving the complex challenge of synchronizing state across multiple clients instantly.

The application allows multiple users to:
*   **Join a session** with a custom username.
*   **Edit a shared document** simultaneously with rich text formatting (Bold, Italic, Colors).
*   **Visualize presence** through real-time cursor tracking (seeing exactly where other users are pointing).
*   **Communicate** via a built-in chat sidebar.

## 2. Technical Stack
*   **Frontend Framework:** Angular 17+ (Standalone Components)
*   **Language:** TypeScript
*   **Styling:** CSS3 (Flexbox, Media Queries for Responsiveness)
*   **Real-time Communication:** WebSockets (Socket.io-client)
*   **Backend:** Node.js + Express + Socket.io (Minimal implementation to support frontend)

## 3. Project Structure
The project follows a modular, component-based architecture to ensure separation of concerns.

```text
/doccollab
│
├── /server                 # Node.js Backend
│   └── index.js            # Handles WebSocket events (cursor, text, chat broadcasting)
│
└── /client                 # Angular Frontend
    ├── src/app
    │   │
    │   ├── /components     # Reusable UI Modules
    │   │   ├── /chat           # Handles message history and input logic
    │   │   ├── /cursor-layer   # Renders SVG cursors based on coordinates
    │   │   └── /toolbar        # Handles text formatting actions (Bold, Colors)
    │   │
    │   ├── /editor         # Main Application View
    │   │   ├── editor.component.ts   # Integrates all child components & socket logic
    │   │   └── editor.component.html # Layout for the workspace
    │   │
    │   ├── /home           # Landing Page Module
    │   │   └── home.component.ts     # Handles login and LocalStorage saving
    │   │
    │   ├── /services       # State Management
    │   │   └── sockets.ts  # Singleton service managing WebSocket connections
    │   │
    │   ├── app.ts          # Root Shell (Router Outlet)
    │   └── app.routes.ts   # Client-side Routing Config
```

## 4. Key Features & Architecture
This project implements the following core requirements:

*   **Component Architecture:** The application is split into 6 distinct components (`App`, `Home`, `Editor`, `Toolbar`, `Chat`, `CursorLayer`) to ensure maintainability.
*   **Client-Side Routing:** Uses Angular Router to navigate between the Login page (`/`) and the Editor (`/editor`).
*   **Asynchronous Data:** Heavy use of **RxJS Observables** to handle asynchronous streams of data coming from the WebSocket server.
*   **State Persistence:** Uses **LocalStorage** to persist user identity across page refreshes.
*   **Responsive Design:** The interface adapts to mobile devices by hiding the sidebar and adjusting editor width via CSS Media Queries.

## 5. How to Run

### Prerequisites
*   Node.js installed.
*   Angular CLI installed (`npm install -g @angular/cli`).

### Step 1: Start the Server
The backend acts as the traffic controller for signals.
```bash
cd server
npm install
node index.js
```
*Server will start on port 3000.*

### Step 2: Start the Client
Open a new terminal window.
```bash
cd client
npm install
ng serve
```
*Client will run on http://localhost:4200*

### Step 3: Test Multiplayer
1.  Open `http://localhost:4200` in one browser tab.
2.  Open the same URL in a second tab (or a different device on the same network).
3.  Enter different names and click "Join".
4.  Type and move your mouse to see real-time synchronization.
