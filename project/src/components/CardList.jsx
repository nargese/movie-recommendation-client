import React, { useEffect, useState } from "react";
import {Swiper,SwiperSlide} from "swiper/react";
import "swiper/css";
import  {Link} from "react-router"


const CardList = ({title, category, userId}) => {
    const [data, setData] = useState([]);
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGYzZWFlNzM2YTZmM2ZlY2Q5MjdiYjFhZTA0MWE0NyIsIm5iZiI6MTc1NTYwNTA2My4zMTIsInN1YiI6IjY4YTQ2ODQ3NzM5ZDdjODUzZDQ0Yjk3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bHMmnzg3Daf1aXJjKPb2WCkx8Yxz73Zo8oe2UvOC-OQ'
  },
};

useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("🔍 DEBUG CardList =>", { title, category, userId });
        let result = [];
        if (category === "recently_added") {
          //console.log("➡️ Fetch admin movies from backend");
          const response = await fetch(
            `https://localhost:7174/api/Movie/GetMovie`
          );
          result = await response.json();
        } else if (category === "added_by_me") {
          //console.log("➡️ Fetch admin movies from backend");
          const response = await fetch(
            `https://localhost:7174/api/Movie/GetMovieByCompte?id=${userId}`
          );
          result = await response.json();
        } else if (category === "liked_by_me") {
          //console.log("➡️ Fetch liked movies from backend");
          const response = await fetch(
            `https://localhost:7174/api/Movie/GetMoviesLikedByUser/${userId}`
          );
          result = await response.json();
        } else {
          //console.log("➡️ Fetch movies from TMDB");
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
            options
          );
          const json = await response.json();
          result = json.results;
        }

        //console.log("✅ Data received:", result);
        setData(result);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };
    fetchData();
  }, [category, userId]);
    //console.log("🔍 DEBUG CardList props:", { title, category, userId });

  return (
    
    <div className="text-white md:px-4">
      <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
        {data.map((item, index) => (
          <SwiperSlide key={index} className="max-w-72">
            <Link to={`/movie/${item.id || item.idMovie}`}>
              <img
  src={
    item.posterUrl || `https://image.tmdb.org/t/p/w500/${item.backdrop_path || item.posterPath}`
  }
  alt={item.original_title || item.title}
  className="h-44 w-full object-center object-cover"
/>
              <p className="text-center pt-2">
                {item.original_title || item.title}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;

