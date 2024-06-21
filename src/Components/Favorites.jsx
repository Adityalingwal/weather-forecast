import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FavoriteCard from './FavoriteCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3001/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/favorites/${id}`);
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className='w-full h-screen text-white px-8'>
      <h2 className='text-3xl font-bold mb-8 text-center text-black'>Favorites</h2>
      <div className='flex flex-wrap justify-center gap-6'>
        {favorites.map((favorite, index) => (
          <FavoriteCard key={index} favorite={favorite} onRemove={removeFavorite} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
