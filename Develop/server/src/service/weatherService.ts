
import axios from 'axios';
// import weatherService from './service/weatherService';





// TODO: Define an interface for the Coordinates object
interface Coordinates{
lon : number;
lat : number;

}
//========>class for the Weather object<===========
class Weather {
  id?: string;  // Optional ID property
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;

  constructor(
    temperature: number,
    feelsLike: number,
    humidity: number,
    pressure: number,
    description: string,
    icon: string,
    id?: string
  ) {
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.pressure = pressure;
    this.description = description;
    this.icon = icon;
    if (id) this.id = id;
  }
}


    //======================> Complete the WeatherService class <=========================

  class WeatherService {
   
    private baseURL: string;
    private API_KEY: string;
    private city: string ;

    //============> Define the baseURL, API key, and city name properties <===============
    
    constructor(API_KEY: string) {
      this.baseURL = 'https://api.openweathermap.org';
      this.API_KEY = API_KEY;
      this.city = '';
    }
    

   //=========================> Fetch Location Data Method <===============================

   private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: { q: query, appid: this.API_KEY },
      });
      return {
        id: response.data.id, // City ID
        name: response.data.name, // City name
        coord: response.data.coord, // Coordinates
      };
    } catch (error) {
      console.error(`Error fetching location data:', ${Error}`);
      throw new Error('Failed to fetch location data.');
    
  }
  
  

  // ===========================> Extract Coordinates Method <==============================

}private destructureLocationData(locationData: any): Coordinates {
  return {
    lat: locationData.coord.lat,
    lon: locationData.coord.lon,
  };
}

  
//   ===========================> Build Weather Query Method <===============================
  
    private buildWeatherQuery(coordinates: Coordinates): string {
        return `${this.baseURL}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${this.API_KEY}`;
    }
    
    // ===========================> Fetch and Extract Coordinates Method <========================
    
    private async fetchAndDestructureLocationData(): Promise<Coordinates> {
      if (!this.city) throw new Error('City name is required.');
      const locationData = await this.fetchLocationData(this.city);
      return this.destructureLocationData(locationData);
    }
    
    // =========> Fetch Weather Data Method <==================================
    
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const response = await axios.get(weatherQuery);
      if (!response.data.current) {
        throw new Error('Current weather data not available.');
      }
      
      return response.data;
    }
    
    // ===========================> Parse Current Weather Method <==================================
    
    private parseCurrentWeather(response: any): Weather {
      const { temp, feels_like, humidity, pressure } = response.current;
      const { description, icon } = response.current.weather[0];
      
      return new Weather(
        temp,
        feels_like,
        humidity,
        pressure,
        description,
        icon
      );
    }
    
    // ===========================> Build Forecast Array Method <=====================================
    private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
      return weatherData.map((day: any) => {
        const { temp, feels_like, humidity, pressure } = day;
        const { description, icon } = day.weather[0];
        
        return new Weather(temp, feels_like, humidity, pressure, description, icon);
      });
    }
    
    // ========> Get Weather for City Method <===============
    
    public async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
      this.city = city;
      
      const coordinates = await this.fetchAndDestructureLocationData(); //====> Fetch coordinates for the city
      const weatherData = await this.fetchWeatherData(coordinates); //===> Fetch weather data for the coordinates
      const currentWeather = this.parseCurrentWeather(weatherData);

  // Build forecast array from 'daily' data in API response
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);

      return {
        current: currentWeather,
        forecast: forecastArray,
      };
    }
  }
  const weatherServiceInstance = new WeatherService(process.env.API_KEY as string);
  
  export default weatherServiceInstance;
