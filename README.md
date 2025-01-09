# 09 Servers and APIs: Weather Dashboard

## Your Task

A dynamic and interactive weather dashboard application that provides real-time weather data and forecasts for any location from https://api.openweathermap.org      

## Table of Contents

  * Features
  * Technologies Used
  * Installation
  * Usage
  * Screenshots
  * License
  * Contributing
  * Contact

## Features

  * Search for current weather conditions by city or location.
  * View a 5-day weather forecast.
  * Display additional details like temperature, humidity, wind speed, and UV index.
  * Responsive design for optimal viewing on desktop and mobile devices.
  * Interactive user interface with dynamic updates.
## Technologies Used

FRONTEND:
  * React
  * Vite for fast builds
  * CSS for styling
BACKEND:
  * Node.js
  * Express
APIs:
  * OpenWeatherMap API for real-time weather data
BUILD TOOLS:
  * TypeScript for type safety
  * npm for package management


# Mock Up

The following image shows the web application's appearance and functionality:

![The weather app includes a search option, a list of cities, and a 5-day forecast and current weather conditions for Atlanta ](./Assets/09-servers-and-apis-homework-demo.png)

## Getting Started

On the back end, the application should include a `searchHistory.json` file that will be used to store and retrieve cities using the `fs` module.

The following HTML route should be created:

* `GET *` should return the `index.html` file.

The following API routes should be created:

* `GET /api/weather/history` should read the `searchHistory.json` file and return all saved cities as JSON.

* `POST /api/weather` should receive a city name to save on the request body, add it to the `searchHistory.json` file, and then return associated weather data to the client. You'll need to find a way to give each city name a unique id when it's saved (look into npm packages that could do this for you).

Refer to the [Full-Stack Blog on deploying to Render](https://coding-boot-camp.github.io/full-stack/render/render-deployment-guide) and the [Render documentation on setting environment variables](https://docs.render.com/configure-environment-variables).

---

## Installation

1. Clone the repository:
     *  git clone https://github.com/MsPickles1014/weather-dashboard.git
       
2. Navigate to the project directory:
     *  cd weather-dashboard
       
3. Install dependencies for the server and client:
     *  cd server && npm install
     *  cd ../client && npm install

4. Create a .env file in the server directory and add the following:
     * PORT=3001
     * WEATHER_API_KEY=your_openweathermap_api_key

## Usage

1.  Build the client and start the server:
      * npm run start
        
2.  Open your browser and navigate to:
      * http://localhost:3001
        
3.  Search for a city or location to view weather data.

## Render URL:
      * postgresql://weather_dashboard_user:wnbMPsMjyQ17So4bcY15nKXRZRBEP08s@dpg-ctsil3d2ng1s73c1f32g-a.ohio-postgres.render.com/weather_dashboard


## Contributing

> **Note**  💡 Contributions are welcome! Please follow these steps:
> * Fork the repository.
>
> * Create a new branch (git checkout -b feature-name)..
>
> * Commit your changes (git commit -m "Add some feature").
>
> * Push to the branch (git push origin feature-name)..

> * Open a pull request.

## Contact

 * Noela Deane
 * Email: Noeladnelson@gmail.com
 * GitHub: @MsPickles1014

