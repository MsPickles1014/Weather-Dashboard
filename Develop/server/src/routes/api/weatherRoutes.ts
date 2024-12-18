
import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { city } = req.body;

  if (!city || typeof city !== 'string') {
    res.status(400).json({ error: 'Valid city name is required.' });
    return;
  }

  try {
    // Fetch weather data for the requested city
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Create a new City instance and add it to the search history
    await HistoryService.addCity();

    // Respond with weather data
    res.status(200).json({
      message: `Weather data for ${city}`,
      data: weatherData,
    });
  } catch (error: any) {
    console.error(`Error in POST /weather: ${error.message}`);
    res.status(500).json({ error: `Error retrieving weather data: ${error.message}` });
  }
});


router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.status(200).json(savedCities);
  } catch (error: any) {
    console.error(`Error in GET /weather/history: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'City ID is required.' });
    return;
  }

  try {
    await HistoryService.removeCity();
    res.status(200).json({ message: 'City successfully removed from search history.' });
    return;
  } catch (error: any) {
    console.error(`Error in DELETE /weather/history/${id}: ${error.message}`);
    res.status(500).json({ error: 'Failed to remove city from search history.' });
    return;
  }
});

export default router;