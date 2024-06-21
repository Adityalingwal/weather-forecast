import { useState, useEffect } from 'react';
import './App.css';
import search from './assets/icons/search.svg';
import { useStateContext } from './Context';
import { BackgroundLayout, WeatherCard, MiniCard, Favorites } from './Components';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [input, setInput] = useState('');
    const { setPlace, units, setUnits } = useStateContext();

    const submitCity = () => {
        setPlace(input);
        localStorage.setItem('lastCity', input);
        setInput('');
    };

    const toggleUnits = () => {
        setUnits(units === 'metric' ? 'imperial' : 'metric');
    };

    return (
        <nav className='w-full p-3 flex justify-between items-center'>
            <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
            {location.pathname === '/' && (
                <>
                    <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded-xl flex items-center p-2 gap-2'>
                        <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem]'  onClick={submitCity} />
                        <input
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    submitCity();
                                }
                            }}
                            type="text"
                            placeholder='Search city'
                            className='focus:outline-none w-full text-[#212121] text-lg'
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                    </div>
                    <button onClick={toggleUnits} className='text-lg p-2 bg-green-500 rounded-xl'>
                        {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
                    </button>
                </>
            )}
            <Link to="/favorites" className='text-lg p-2 bg-blue-500 rounded-xl'>Favorites</Link>
        </nav>
    );
};

function App() {
    const { weather, thisLocation, values, setPlace } = useStateContext();

    useEffect(() => {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            setPlace(lastCity);
        }
    }, [setPlace]);

    return (
        <Router>
            <div className='w-full h-screen text-white px-8'>
                <Navbar />
                <BackgroundLayout />
                <Routes>
                    <Route path="/" element={
                        <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
                            <WeatherCard
                                place={thisLocation}
                                windspeed={weather.wind?.speed}
                                humidity={weather.main?.humidity}
                                temperature={weather.main?.temp}
                                heatIndex={weather.main?.feels_like}
                                iconString={weather.weather?.[0]?.icon}
                                conditions={weather.weather?.[0]?.description}
                            />
                            <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
                                {values?.slice(0, 5).map((curr, index) => (
                                    <MiniCard
                                        key={index}
                                        time={curr.datetime}
                                        temp={curr.temp}
                                        iconString={curr.conditions}
                                    />
                                ))}
                            </div>
                        </main>
                    } />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
