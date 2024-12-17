import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates{
lon : number;
lat :number;

}
//========>class for the Weather object<===========
class Weather {
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
    icon: string
  ) {
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.pressure = pressure;
    this.description = description;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class

  class WeatherService {
    private baseURL: string;
    private apiKey: string;
    private city: string | null;
  
    constructor(apiKey: string) {
      this.baseURL = 'https://api.openweathermap.org/data/2.5';
      this.apiKey = apiKey;
      this.city = null;
    }
// ======= Fetch Location Data =======
private async fetchLocationData(query: string): Promise<any> {
  const response = await axios.get(`${this.baseURL}/weather`, {
    params: {
      q: query,
      appid: this.apiKey,
    },
  });
  return response.data;
}

// ======= Extract Coordinates =======
private destructureLocationData(locationData: any): Coordinates {
  return {
    lat: locationData.coord.lat,
    lon: locationData.coord.lon,
  };
}

// ======= Build Geocode Query =======
private buildGeocodeQuery(): string {
  if (!this.city) throw new Error('City name is required.');
  return `${this.baseURL}/weather?q=${this.city}&appid=${this.apiKey}`;
}

// ======= Build Weather Query =======
private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${this.apiKey}`;
}

// ======= Fetch and Extract Coordinates =======
private async fetchAndDestructureLocationData(): Promise<Coordinates> {
  if (!this.city) throw new Error('City name is required.');
  const locationData = await this.fetchLocationData(this.city);
  return this.destructureLocationData(locationData);
}

// ======= Fetch Weather Data =======
private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
  const weatherQuery = this.buildWeatherQuery(coordinates);
  const response = await axios.get(weatherQuery);
  return response.data;
}

// ======= Parse Current Weather =======
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

// ======= Build Forecast Array =======
private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
  return weatherData.map((day: any) => {
    const { temp, feels_like, humidity, pressure } = day;
    const { description, icon } = day.weather[0];

    return new Weather(temp, feels_like, humidity, pressure, description, icon);
  });
}

// ======= Get Weather for City =======
public async getWeatherForCity(city: string): Promise<Weather> {
  this.city = city;

  // Fetch coordinates for the city
  const coordinates = await this.fetchAndDestructureLocationData();

  // Fetch weather data for the coordinates
  const weatherData = await this.fetchWeatherData(coordinates);

  // Parse current weather data
  return this.parseCurrentWeather(weatherData);
}
}









  
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}

export default new WeatherService();
