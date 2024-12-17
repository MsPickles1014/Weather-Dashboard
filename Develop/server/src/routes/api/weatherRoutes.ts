import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';  //handles storing and retrieving search history.
import weatherService from '../../service/weatherService.js';  //fetches weather data for a given city.

const router = Router();

//============>Retrieve weather data for a city and save it to search history<=====================

router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;

    ////// ================>Validate the city name<==================
    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'City name is required and must be a string' });
    }

    //////================>Fetch weather data<=========================

    const weatherData = await weatherService.getWeatherByCity(city);// MAKE SURE NAMES MSTCH

    //////================>Save city to search history<================

    await historyService.addCity(new City(city, weatherData.id));


    //==================>Respond with weather data<===========

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
}
);
//////======================>GET: Retrieve search history<==================

router.get('/history', async (req: Request, res: Response) => {

  try {

    //////======================> Fetch search history<=============================

    const history = await historyService.getCities();
    //////===================>retrieve all previously searched cities<===============

    res.status(200).json(history); // Responds with the search history as JSON.
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
}
);
// =============>* BONUS TODO: DELETE city from search history<============

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required.' });
    }

    ///////////////////////// Delete the city from search history

    await historyService.removeCity(id);

     res.status(200).json({ message: 'City removed from search history.' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});
export default router;
