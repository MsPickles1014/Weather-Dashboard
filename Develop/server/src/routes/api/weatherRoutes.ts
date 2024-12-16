gi
import { promises as fs } from 'fs';
import path from 'path';

//========================================>Define a City class with name and id properties<========================================
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

//=====================================================>Complete the HistoryService class<==============================================
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve('path/to/searchHistory.json');  // Set the path to the searchHistory.json file
  }

  //===========================================> Private method to read the JSON file<==================================================

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (err) {
      if (err.code === 'ENOENT') {
        return []; // If the file does not exist, return an empty array
      }
      console.error(`Error reading or parsing file: ${err.message}`);
      throw err;
    }
  }

  //================================> write method that writes the updated cities array to the searchHistory.json file<=================

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
      console.log('Search history updated successfully.');
    } catch (err) {
      console.error('Error writing to file:', err.message);
      throw err;
    }
  }

  // ====================================================>Method to get all cities<=====================================================

  public async getCities(): Promise<City[]> {
    try {
      return await this.read();
    } catch (err) {
      console.error(`Error fetching cities: ${err.message}`);
      throw err;
    }
  }

  //=======================================================> Method to add a city to the search history<=================================

  public async addCity(city: City): Promise<void> {
    try {
      const cities = await this.getCities();

      //=======> Check for duplication of cities<==================

      if (cities.find((c) => c.id === city.id)) {
        console.warn(`City with ID "${city.id}" already exists in history.`);
        return;
      }

      cities.push(city);
      await this.write(cities);
      console.log(`City "${city.name}" added to search history.`);
    } catch (err) {
      console.error(`Error adding city: ${err.message}`);
    }
  }

  //===================================================> Method to remove a city by ID<================================================

  public async removeCity(id: string): Promise<void> {
    try {
      const cities = await this.getCities();

      const updatedCities = cities.filter((city) => city.id !== id);

      if (cities.length === updatedCities.length) {
        console.warn(`City with ID "${id}" not found in search history.`);
        return;
      }

      await this.write(updatedCities);
      console.log(`City with ID "${id}" removed from search history.`);
    } catch (err) {
      console.error(`Error removing city: ${err.message}`);
    }
  }
}

export default new HistoryService();


