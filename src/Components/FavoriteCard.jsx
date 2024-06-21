import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sun from '../assets/icons/sun.png';
import cloud from '../assets/icons/cloud.png';
import fog from '../assets/icons/fog.png';
import rain from '../assets/icons/rain.png';
import snow from '../assets/icons/snow.png';
import storm from '../assets/icons/storm.png';
import wind from '../assets/icons/windy.png';
import '../index.css';

const API_KEY = 'fd5bdec3747e48a9b90330deab24b941';

const FavoriteCard = ({ favorite, onRemove }) => {
  const [weather, setWeather] = useState(null);
  const [icon, setIcon] = useState(sun);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${favorite.city}&appid=${API_KEY}&units=metric`);
        setWeather(weatherResponse.data);

        const weatherDescription = weatherResponse.data.weather[0].description.toLowerCase();
        if (weatherDescription.includes('cloud')) {
          setIcon(cloud);
        } else if (weatherDescription.includes('rain')) {
          setIcon(rain);
        } else if (weatherDescription.includes('clear')) {
          setIcon(sun);
        } else if (weatherDescription.includes('thunder')) {
          setIcon(storm);
        } else if (weatherDescription.includes('fog')) {
          setIcon(fog);
        } else if (weatherDescription.includes('snow')) {
          setIcon(snow);
        } else if (weatherDescription.includes('wind')) {
          setIcon(wind);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [favorite.city]);

  return (
    <div className='w-[22rem] min-w-[22rem] h-auto glassCard p-4 mb-4'>
      <div className='flex justify-between items-center mb-4'>
        <div className='font-bold text-xl'>{favorite.city}</div>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded'
          onClick={() => onRemove(favorite.id)}
        >
          Delete
        </button>
      </div>
      {weather && (
        <div>
          <div className='flex justify-between items-center'>
            <div className='text-2xl font-bold'>{weather.main.temp}°C</div>
            <img src={icon} alt="weather icon" className='w-12 h-12'/>
          </div>
          <div className='text-lg'>{weather.weather[0].description}</div>
          <div className='mt-2'>
            <div>Wind Speed: {weather.wind.speed} km/h</div>
            <div>Humidity: {weather.main.humidity}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteCard;
