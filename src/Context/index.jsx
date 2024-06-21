import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState(localStorage.getItem('lastCity') || 'delhi');
    const [thisLocation, setLocation] = useState('');
    const [units, setUnits] = useState('metric');

    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/forecast',
            params: {
                q: place,
                units: units,
                appid: import.meta.env.VITE_REACT_APP_API_KEY
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            setLocation(response.data.city.name);
            
            // Update the weather state with current weather
            setWeather(response.data.list[0]);

            // Extract the weather data for 5 days at 12:00 PM
            const weatherValues = response.data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => ({
                datetime: item.dt_txt,
                temp: item.main.temp,
                conditions: item.weather[0].description
            }));

            setValues(weatherValues);
        } catch (e) {
            console.error(e);
            alert('This place does not exist');
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place, units]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    const handleSetPlace = (newPlace) => {
        setPlace(newPlace);
        localStorage.setItem('lastCity', newPlace);
    };

    return (
        <StateContext.Provider value={{
            weather,
            setPlace: handleSetPlace,
            values,
            thisLocation,
            place,
            units,
            setUnits
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
