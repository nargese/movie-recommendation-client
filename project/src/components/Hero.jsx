import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const Hero = () => {
  const [movie, setMovies] = useState(null);
  const options = {
    method: 'GET',
    headers: {accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGYzZWFlNzM2YTZmM2ZlY2Q5MjdiYjFhZTA0MWE0NyIsIm5iZiI6MTc1NTYwNTA2My4zMTIsInN1YiI6IjY4YTQ2ODQ3NzM5ZDdjODUzZDQ0Yjk3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bHMmnzg3Daf1aXJjKPb2WCkx8Yxz73Zo8oe2UvOC-OQ'

    }};
useEffect(() => {
fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
  .then(res => res.json())
  .then((res) => {
    if (res.results && res.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * res.results.length);
      setMovies(res.results[randomIndex]);
    }
  })
  .catch(err => console.error(err));
}, []);
  if (!movie){
     return <p>Loading...</p>;
    }
  return (
    <div className="text-white relative">
        <img 
        src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`} 
        alt='bg-img' 
        className="w-full rounded-2xl h-[480px] object-center object-cover"></img>
        
        <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
          <Link to={`/movie/${movie.id}`}>  
            <button className="flex justify-center items-center bg-white  hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
                <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
            </button>
          </Link>
        </div>
    </div>
  )
}

export default Hero