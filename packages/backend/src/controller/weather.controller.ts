import { Request, Response } from 'express';
// got problem with node fetch have no fcking idea what is goin on
import fetch from 'cross-fetch';

/**
 * get weather data from external api
 * as parameters are day,year,month and we will only send state and icon as response.
 * return 404 notfound if data not found
 * @param req
 * @param res
 */
export const getWeatherAPI = async (req: Request, res: Response) => {
  // default place is frankfurt
  const year: number = +req.params.year;
  const month: number = +req.params.month;
  const day: number = +req.params.day;
  try {
    const response = await fetch(`https://www.metaweather.com/api/location/650272/${year}/${month}/${day}`, {
      method: 'GET',
    });
    const weather: any = await response.json();
    const iconName: string = weather[0].weather_state_abbr;
    const imgUrl: string = `https://www.metaweather.com/static/img/weather/${iconName}.svg`;
    res.status(200).send({
      // @ts-ignore
      weather_icon: imgUrl,
      // @ts-ignore
      weather_state: weather[0].weather_state_name,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ status: 'not_found' });
  }
};
