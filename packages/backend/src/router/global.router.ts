import { Request, Response, Router } from 'express';
import { diaryEntryRouter } from './diaryEntry.router';
import { labelRouter } from './label.router';
import { getWeatherAPI } from '../controller/weather.controller';

export const globalRouter = Router({ mergeParams: true });

globalRouter.get('/', async (_: Request, res: Response) => {
  res.send({ message: 'hi' });
});
// we don't need extra router for get weather api
globalRouter.get('/weather/:year/:month/:day', getWeatherAPI);

globalRouter.use('/diary', diaryEntryRouter);
globalRouter.use('/label', labelRouter);
