import { promises as fs } from 'fs';
import path from 'path';


//============================> Define a City class with name and id properties <========================
class City {
  name: string;
 

  constructor(name: string) {
    if (!name ) {
      throw new Error('City name ');
    }
    this.name = name;
   
  }
}

//===================================> Complete the HistoryService class <==============================
class HistoryService {
  private readonly filePath: string;

  constructor() {
    this.filePath = path.resolve(process.env.HISTORY_FILE || './searchHistory.json'); // Default to local file
  }

  //=======================> Private method to read the JSON file <======================================

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (err: any) {
      if (err.code === 'ENOENT') return []; // File not found
      console.error(`Error reading file: ${err.message}`);
      throw err;
    }
  }

  //======> write method that writes the updated cities array to the searchHistory.json file <=========
  
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (err: any) {
      console.error(`Error writing file: ${err.message}`);
      throw err;
    }
  }

  // ==============================> Method to get all cities< ========================================
 
  public async getCities(): Promise<City[]> {
    return this.read();
  }

  //============================> Method to add a city to the search history<==========================

  public async addCity(): Promise<void> {
    const cities = await this.getCities();

      //=======> Check for duplication of cities<==================

      if (cities.some((c) => c.name=== City.name)) {
      console.warn(`City with ID "${City}" already exists.`);
      return;
    }
    cities.push(City);
    await this.write(cities);
  }


  //================================> Method to remove a city by ID <==================================

  public async removeCity(): Promise<void> {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city) => city.name!);
    await this.write(updatedCities);
  }
}

export default new HistoryService();


