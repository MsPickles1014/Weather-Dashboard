
import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  date: string; // Changed to string to store formatted date
  icon: string;

  constructor(city: string, date: string, tempF: number, windSpeed: number, humidity: number, icon: string) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error("API key or base URL not found");
      }
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.statusText}`);
      }
      const locationData = await response.json();
      if (!locationData.length) {
        throw new Error("Location not found");
      }
      return locationData[0]; // Assuming the API returns an array
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
      data
    );
  }
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      if (!response) {
        throw new Error(`Failed to fetch weather data`);
      }
      
      const currentWeather: Weather = this.parseCurrentWeather(
        response.list[0]
      );

      const forecast: Weather[] = this.buildForecastArray(
        currentWeather,
        response.list
      );

      return forecast;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY'); // Format date using dayjs

    return new Weather(
      this.cityName,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon
    );
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data:any) => {
      return data.dt_txt.includes('12:00:00'); // Filter for 12:00 PM forecasts
    })
      
    for (const data of filteredWeatherData) {
      weatherForecast.push(
        new Weather(
          this.cityName,
          dayjs.unix(data.dt).format('M/D/YYYY'), // Format date using dayjs
          data.main.temp,
          data.wind.speed,
          data.main.humidity,
          data.weather[0].icon
        )
      );

    }
    return weatherForecast;
}

  async getWeatherForCity(city: string) {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData(); 

      if (coordinates){
        // Fetch weather data
        const weatherData = await this.fetchWeatherData(coordinates);
        return weatherData
      }
      throw new Error(`City "${city}" not found.`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new WeatherService();





































// import dotenv from 'dotenv';
// dotenv.config();
// // TODO: Define an interface for the Coordinates object
// interface Coordinates {
//   lat: number;
//   lon: number;
// }
// // TODO: Define a class for the Weather object
// class Weather {
//   city: string;
//   tempF: number;
//   wind : number;
//   humidity: number;
//   date: Date;
//   icon: string;
//   constructor(city:string, date: Date, tempF: number, wind: number, humidity: number, icon: string) {
//   this.city = city;
//   this.date = date
//   this.tempF = tempF;
//   this.wind = wind;
//   this.humidity = humidity;
//   this.icon = icon;
//   }
// }
// // TODO: Complete the WeatherService class
// class WeatherService {
//   // TODO: Define the baseURL, API key, and city name properties
//   private baseURL: string;
//   private apiKey: string;
//   private cityName: string;
//   constructor() {
//     this.baseURL = process.env.API_BASE_URL || '';
//     this.apiKey = process.env.API_KEY || '';
//     this.cityName = '';
//   }
//   // TODO: Create fetchLocationData method
//   private async fetchLocationData(query: string) {
//     //fetch location France
//     try{
//       if(!this.baseURL || !this.apiKey){
//         throw new Error("key or url not found")
//       }
//       const response = await fetch(query);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch location data: ${response.statusText}`);
//       }
//       const locationData = await response.json();
//       return locationData[0]; // Assuming the API returns an array and we need the first result
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
//   // TODO: Create destructureLocationData method
//   private destructureLocationData(locationData: Coordinates): Coordinates {
//     //returns lat and lon
//     if(!locationData){
//       throw new Error("Please pass in a location")
//     }
//     const {lat, lon} = locationData;
//     const coordinates: Coordinates = {
//       lat,
//       lon
//     }
//     return coordinates;
//   }
//   // TODO: Create buildGeocodeQuery method
//   private buildGeocodeQuery(): string {
//     const geoQuery = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`
//     return geoQuery
//     // return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;  (ChatGPT)
//   }
//   // TODO: Create buildWeatherQuery method //====> uses API call from 5day weather forecast on openweathermap
//   private buildWeatherQuery(coordinates: Coordinates): string {
//     // const weatherQuery = `api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
//     // return weatherQuery;
//     return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;    // (chatGPT)
//   }
//   // TODO: Create fetchAndDestructureLocationData method
//   private async fetchAndDestructureLocationData() {
//     const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
//     return this.destructureLocationData(locationData);
//   }
//   // TODO: Create fetchWeatherData method
//   private async fetchWeatherData(coordinates: Coordinates) {
//     try{
//       const query = this.buildWeatherQuery(coordinates);
//       const response = await fetch(query);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch weather data: ${response.statusText}`);
//       }
//       const weatherData = await response.json();
//       return weatherData;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
//   // TODO: Build parseCurrentWeather method
//   private parseCurrentWeather(response: any): Weather {
//     const currentWeatherData = response.list[0]; // Assuming the first entry is the current weather
//     return new Weather(
//       this.cityName,
//       new Date(currentWeatherData.dt_txt),
//       currentWeatherData.main.temp,
//       currentWeatherData.wind.speed,
//       currentWeatherData.main.humidity,
//       currentWeatherData.weather[0].icon
//     );
//   }
//   // TODO: Complete buildForecastArray method
//   private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
//     return weatherData
//         .filter(entry => new Date(entry.dt_txt) > currentWeather.date) // Exclude past data
//         .map((entry: any) => {
//             return new Weather(
//                 this.cityName,
//                 new Date(entry.dt_txt),
//                 entry.main.temp,
//                 entry.wind.speed,
//                 entry.main.humidity,
//                 entry.weather[0].icon
//             );
//         });
// }
//   // TODO: Complete getWeatherForCity method
//   async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
//     try {
//       this.cityName = city;
//       // Fetch and destructure location data
//       const coordinates = await this.fetchAndDestructureLocationData();
//       // Fetch weather data
//       const weatherData = await this.fetchWeatherData(coordinates);
//       // Parse current weather and forecast
//       const currentWeather = this.parseCurrentWeather(weatherData);
//       const forecast = this.buildForecastArray(currentWeather, weatherData.list.slice(1)); // Slice to exclude current weather
//       return { currentWeather, forecast };
//     } catch (error) {
//       console.error(`Error fetching weather for city ${city}:`, error);
//       throw error;
//     }
//   }
// }
// export default new WeatherService();