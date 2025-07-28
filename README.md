# 🧠 Riddle Game (Terminal Edition)

A full-stack interactive riddle game built with **Node.js**, using **Object-Oriented Programming**, ES Modules, and a **RESTful Express.js** backend powered by **Supabase** and **MongoDB**.

---

## 🎯 Project Overview

- Terminal-based riddle game using `readline-sync`
- Players solve riddles from easy to hard
- Guest mode for instant access without registration
- Authenticated players tracked via Supabase
- Admins can fully manage riddles (CRUD)
- Leaderboard based on total riddles solved
- Token-based authentication (JWT) with auto-login
- Game data stored via Supabase (riddles) and MongoDB (player stats)

---

## 🗂️ Project Structure

```
.
├── app.js                  # Entry point for the terminal game
├── core/                  # Core game logic
│   ├── GameEngine.js      # Main game loop and gameplay logic
│   └── Player.js          # Player class, roles, and token handling
├── riddles/               # Riddle-related logic
│   ├── Riddle.js          # Riddle object creation and printing
│   └── RiddleController.js# Client-side CRUD operations for riddles
├── managers/              # Game flow and menu managers
│   ├── GameManager.js     # Main login/signup/guest/start menu
│   ├── GameStarter.js     # Starts the GameEngine
│   ├── GuestManager.js    # Guest player logic
│   ├── AuthManager.js     # Login/signup process
│   └── MenuManager.js     # Menus for user/admin actions
├── utils/                 # Shared utilities
│   ├── idHelper.js        # Generates auto-incrementing riddle IDs
│   └── TokenManager.js    # Save/load/delete local JWT token
├── lib/
│   └── riddleId.txt       # Tracks last used riddle ID
└── README.md              # This file
```

---

## ⚙️ Installation & Running

### 1. Install dependencies:
```bash
npm install
```

### 2. Run the terminal game:
```bash
node app.js
```

### 3. Run the backend server:
Assuming it's in a separate folder (`/server`):
```bash
cd server/
npm install
node app.js
```

✅ Make sure to set up `.env` on the server:
```env
SUPABASE_URL=...
SUPABASE_KEY=...
MONGODB_URI=...
JWT_SECRET=...
```

---

## 👥 Player Roles

| Role   | Description |
|--------|-------------|
| Guest  | No registration needed, plays immediately |
| User   | Registered player, can play, create riddles, view leaderboard |
| Admin  | Full permissions: CRUD riddles, view leaderboard, play |

---

## 🔁 Game Flow

```mermaid
flowchart TD
    Start[Start app.js] --> HasToken{Token exists?}
    
    HasToken -- Yes --> Decode[Decode token]
    Decode --> RoleCheck{Role?}
    
    RoleCheck -- guest --> StartGame[Start game immediately]
    RoleCheck -- user --> UserMenu[Show user menu]
    RoleCheck -- admin --> AdminMenu[Show admin menu]
    
    HasToken -- No --> ShowMainMenu[Show main menu]
    ShowMainMenu --> Choice1[1. Login]
    ShowMainMenu --> Choice2[2. Sign Up]
    ShowMainMenu --> Choice3[3. Guest]
    ShowMainMenu --> Choice4[4. Exit]
    
    Choice1 --> Login[Enter credentials]
    Login --> LoginSuccess{Login successful?}
    LoginSuccess -- Yes --> SaveToken[Save token] --> Decode
    LoginSuccess -- No --> ShowMainMenu

    Choice2 --> Signup[Enter new credentials]
    Signup --> SignupSuccess{Signup successful?}
    SignupSuccess -- Yes --> SaveToken2[Save token] --> Decode
    SignupSuccess -- No --> ShowMainMenu

    Choice3 --> GuestFlow[Create guest player]
    GuestFlow --> SaveToken3[Save token] --> StartGame

    UserMenu --> UserChoice1[1. Play game] --> StartGame
    UserMenu --> UserChoice2[2. View leaderboard] --> Leaderboard
    UserMenu --> UserChoice3[3. Add riddle] --> CreateRiddle
    UserMenu --> UserChoice0[0. Logout] --> ClearToken --> ShowMainMenu

    AdminMenu --> AdminChoice1[1. Play game] --> StartGame
    AdminMenu --> AdminChoice2[2. View leaderboard] --> Leaderboard
    AdminMenu --> AdminChoice3[3. Add riddle] --> CreateRiddle
    AdminMenu --> AdminChoice4[4. Update riddle] --> UpdateRiddle
    AdminMenu --> AdminChoice5[5. Delete riddle] --> DeleteRiddle
    AdminMenu --> AdminChoice6[6. View all riddles] --> ShowRiddles
    AdminMenu --> AdminChoice0[0. Logout] --> ClearToken --> ShowMainMenu

    CreateRiddle --> Done1[Return to menu]
    UpdateRiddle --> Done2[Return to menu]
    DeleteRiddle --> Done3[Return to menu]
    ShowRiddles --> Done4[Return to menu]
    Leaderboard --> Done5[Return to menu]

```

---

## 🔧 API Overview

### 🔐 Player Endpoints
| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/players`              | Signup                    |
| POST   | `/players/login`        | Login                     |
| POST   | `/players/guest`        | Create guest account      |
| POST   | `/players/solve`        | Submit solved riddle data |
| GET    | `/players/sorted-by-total` | Get leaderboard         |

### 🧩 Riddle Endpoints
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | `/riddles`                | Get all riddles     |
| GET    | `/riddles/difficulty/:d`  | Filter by difficulty|
| POST   | `/riddles`                | Create riddle       |
| PUT    | `/riddles/:id`            | Update riddle       |
| DELETE | `/riddles/:id`            | Delete riddle       |

---

## 🧪 Features

- Terminal-based UI with `readline-sync`
- Local JWT storage and auto-login
- Riddle difficulty flow: easy → hard
- Solving time tracked per riddle
- Leaderboard with total solved
- Admins can manage riddles via terminal
- Role-based access control for actions

---

## ✍️ Author

Developed by **Nahman Ben Or**  
Guided by **Yishai Malkieli** – Full Stack Training Program

---
