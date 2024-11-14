# ConvertHub

A simple currency converter app built with **Express**, **Sequelize**, and **JavaScript**. It allows you to convert currencies, save favorite pairs, and view exchange rates.

## Features

- Convert between currencies in real-time.
- Save favorite currency pairs.

## Tech Stack

- **Backend**: Node.js, Express, Sequelize, SQLite
- **Frontend**: HTML, JavaScript
- **API**: FreeCurrencyAPI for exchange rates

## Getting Started

### Prerequisites

- Install **Node.js** (version 14+).
- Install **SQLite** (for local database).

### Clone the Repo

```bash
    git clone https://github.com/notDuckk/ConvertHub.git
    cd ConvertHub 
```

### Install Dependencies
```bash
  npm install 
```

### Run the App
Start the server:
```bash
  npm start    
```

Open your browser and go to http://localhost:3000 to use the app.

### API Endpoints
- GET /favs: get saved favorite currency pairs
- POST /favs: Save a new favorite pair(send baseCurr & targCurr in JSON)

### Troubleshooting
- ensure db is not locked(check for other processes using prod.db file).
- ensure you have internet connection to fetch exchange rates.