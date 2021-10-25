import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import "./weather.css";

import cloud from "../../Assets/img/cloud.svg";
import rain from "../../Assets/img/rain.svg";
import sun from "../../Assets/img/sun.svg";
import storm from "../../Assets/img/strom.svg";


const API_KEY = '9d6ae69e04c6d15a751792e0e2638c2d';

const Weather = ({active, setActive}) => {
  const [ weatherData, setWeatherData ] = useState({
    city: '',
    temp: '',
    description: '',
    speed: '',
    pressure: '',
    humidity: '',
    clouds: '',
    img: '',
  });
  // Запрос погодных данных
  const getWeather = useCallback(async () => {
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Yekaterinburg&lang=ru&appid=${API_KEY}&units=metric`);
    const data = weather.data;
    setWeatherData({
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      speed: data.wind.speed,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      clouds: data.clouds.all,
      img: data.weather[0].main
    });
    return data;
  }, []);

  //Вызов получения данных
  useEffect(() => {
    getWeather();
  }, [ getWeather ]);

  //Отрисовка иконки погоды
  let weatherImg;
  switch (weatherData.img) {
    case "Clouds":
      weatherImg = cloud;
      break;
    case 'Rain':
      weatherImg = rain;
      break;
    case "Clear":
      weatherImg = sun;
      break;
    case "Thunderstorm":
      weatherImg = storm;
      break;
    default:
      weatherImg = cloud;
  }

  return (
    <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
      <div className={active ? "modal__weather active" : "modal__weather"} onClick={e => e.stopPropagation()}>
        <h1 className="weather__city">{weatherData.city}</h1>
        <div className="weather__temp">
          <img src={weatherImg} alt=""/>
          <span>{Math.round(weatherData.temp)}<sup>º</sup></span>
        </div>
        <div className="weather__status">{weatherData.description}</div>
        <div className="weather-info">
          <div className="weather-info__block block_1">
            <div className="weather-info__title">Ветер</div>
            <div className="weather-info__text">{Math.round(weatherData.speed * 10) / 10} м/c</div>
          </div>
          <div className="weather-info__block block_2">
            <div className="weather-info__title">Давление</div>
            <div className="weather-info__text">{weatherData.pressure} мм рт. ст.</div>
          </div>
          <div className="weather-info__block block_3">
            <div className="weather-info__title">Влажность</div>
            <div className="weather-info__text">{weatherData.humidity}%</div>
          </div>
          <div className="weather-info__block block_4">
            <div className="weather-info__title">Облачность</div>
            <div className="weather-info__text">{weatherData.clouds}%</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Weather;