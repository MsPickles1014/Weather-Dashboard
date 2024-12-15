import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';  //handles storing and retrieving search history.
import WeatherService from '../../service/weatherService.js';  //fetches weather data for a given city.


const router = Router();

const historyService = new HistoryService(); // Assuming this handles search history logic
const weatherService = new WeatherService(); // Assuming this fetches weather data


//////////////============>POST Request with city name to retrieve weather data, GET weather data from city name, save city to search history<=====================


router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    //////================>Fetch weather data<=========================

    const weatherData = await weatherService.getWeatherByCity(city);

    //////================>Save city to search history<================

    await historyService.saveSearch(city);

    res.status(200).json(weatherData);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
}
);


/////////////////////////TODO: GET: Retrieve search history
router.get('/history', async (req: Request, res: Response) => {
    try {
    const history = await historyService.getHistory();  //retrieve all previously searched cities.
    res.status(200).json(history); // Responds with the search history as JSON.
    }

    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
    }
 }
);


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    ///////////////////////// Delete the city from search history

    await historyService.deleteSearchById(id);

    res.status(200).json({ message: 'City removed from search history' });
  }
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
    }
});

export default router;
