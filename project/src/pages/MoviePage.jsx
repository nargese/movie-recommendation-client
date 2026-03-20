import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router";
import { MessageCircle, User } from "lucide-react";
import { Star } from "lucide-react";
import UpdateMovieForm from "./UpdateMovieForm";

const MoviePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [movieComments, setMovieComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  // Avant ton return()
const [title, setTitle] = useState(movie?.title || "");
const [overview, setOverview] = useState(movie?.overview || "");
const [releaseYear, setReleaseYear] = useState(movie?.releaseYear || "");
const [posterUrl, setPosterUrl] = useState(movie?.posterUrl || "");
const [selectedGenres, setSelectedGenres] = useState(movie?.genreIds || []);

  const [averageRating, setAverageRating] = useState("");
  //const [selectedGenres, setSelectedGenres] = useState([]);
// Add state for form fields
const [formData, setFormData] = useState({
  title: "",
  description: "",
  releaseDate: "",
  posterUrl: ""
});
const genresList = [
  { idGenre: "aa027388-6f54-4769-e462-08dde48c657b", name: "Comedy" },
  { idGenre: "04da5649-ce4b-438f-41a6-08dde618d5b8", name: "Horror" },
  { idGenre: "9c474d2f-222b-439c-41a7-08dde618d5b8", name: "Romance" },
  { idGenre: "c98ef1f2-bccd-4962-41a8-08dde618d5b8", name: "Fantasy" },
  { idGenre: "14a72eee-d821-4528-41a9-08dde618d5b8", name: "Drama" },
  { idGenre: "07bbc0f6-ef22-484c-41aa-08dde618d5b8", name: "Mystery" },
  { idGenre: "57f7c5a3-dbb5-45cf-41ab-08dde618d5b8", name: "Thriller" },
  { idGenre: "0e36fb12-7203-4482-41ac-08dde618d5b8", name: "Animation" },
]

// Récupération de l’utilisateur connecté
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

// Pre-fill when movie is loaded
useEffect(() => {
  if (movie) {
    setFormData({
      title: movie.title || "",
      description: movie.description || movie.overview || "",
      releaseDate: movie.releaseDate || movie.releaseYear || "",
      posterUrl: movie.posterUrl || movie.posterPath || ""
    });
  }
}, [movie]);


// Handle changes
const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// Submit update
// const handleUpdateSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await fetch(
//       `https://localhost:7174/api/Movie/PutMovie/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json-patch+json",
//           accept: "*/*"
//         },
//         body: JSON.stringify({
//           idMovie: id,
//           title: formData.title,
//           description: formData.description,
//           releaseDate: formData.releaseDate,
//           posterUrl: formData.posterUrl,
//           fK_Compte: user.idCompte,
//           genreIds: movie.genreIds || []
//         })
//       }
//     );

//     if (!response.ok) throw new Error("Update failed");

//     alert("Movie updated successfully!");
//     setShowUpdateForm(false);
//     // refresh movie
//     const updated = await response.json();
//     setMovie(updated);
//   } catch (err) {
//     console.error("Update error:", err);
//     alert("Error updating movie");
//   }
// };
const handleUpdateSubmit = async (updatedMovie) => {
  try {
    const response = await fetch(`https://localhost:7174/api/Movie/PutMovie/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...movie, // garde les autres champs existants
        title: updatedMovie.title,
        overview: updatedMovie.description,
        releaseYear: Number(updatedMovie.releaseDate?.slice(0, 4)),
        posterUrl: updatedMovie.imageUrl,
      }),
    });

    if (!response.ok) throw new Error("Failed to update movie");

    // Récupère la réponse (texte ou JSON)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      await response.json();
    } else {
      await response.text(); // ignore le message
    }

    // Mets à jour le state local pour refléter les changements
    setMovie((prev) => ({
      ...prev,
      title: updatedMovie.title,
      overview: updatedMovie.description,
      releaseYear: Number(updatedMovie.releaseDate?.slice(0, 4)),
      posterUrl: updatedMovie.imageUrl,
    }));

    // Masquer le formulaire
    setShowUpdateForm(false);

    alert("Movie updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update movie");
  }
};

  
  const isTMDB = /^[0-9]+$/.test(id);
  // Charger les données du film quand la page charge
useEffect(() => {
  if (movie) {
    setTitle(movie.title || "");
    setOverview(movie.overview || "");
    setReleaseYear(movie.releaseYear || "");
    setPosterUrl(movie.posterPath || ""); // ou movie.posterPath selon ton API
  }
}, [movie]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGYzZWFlNzM2YTZmM2ZlY2Q5MjdiYjFhZTA0MWE0NyIsIm5iZiI6MTc1NTYwNTA2My4zMTIsInN1YiI6IjY4YTQ2ODQ3NzM5ZDdjODUzZDQ0Yjk3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bHMmnzg3Daf1aXJjKPb2WCkx8Yxz73Zo8oe2UvOC-OQ'
    },
  };




useEffect(() => {
  if (!movie) return;
  fetch(`https://localhost:7174/api/Movie/${id}/comments`)
    .then((res) => res.json())
    .then((res) => setMovieComments(res))
    .catch((err) => console.error(err));
}, [movie, id]);


  

  // Chargement du film
  useEffect(() => {
    if (isTMDB) {
      // TMDB
      fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
        .then((res) => res.json())
        .then((res) => setMovie(res))
        .catch((err) => console.error(err));

      fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
        options
      )
        .then((res) => res.json())
        .then((res) => setRecommendations(res.results || []))
        .catch((err) => console.error(err));

      fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      )
        .then((res) => res.json())
        .then((res) => {
          const trailer = res.results?.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          );
          setTrailerKey(trailer?.key || null);
        })
        .catch((err) => console.error(err));
    } else {
      // Local
      fetch(`https://localhost:7174/api/Movie/GetMovieById/${id}`)
        .then((res) => res.json())
        .then((res) => setMovie(res))
        .catch((err) => console.error(err));
    }
  }, [id, isTMDB]);

  // Vérifie au chargement si l'utilisateur a déjà liké le film
useEffect(() => {
  const fetchUserLike = async () => {
    if (!user) return;

    try {
      const response = await fetch(`https://localhost:7174/api/Like/GetUserLike?movieId=${id}&userId=${user.idCompte}`);
      if (!response.ok) throw new Error('Failed to fetch like');

      const result = await response.json();
      if (result) {
        setLiked(true);
        setLikeId(result.idLike); // récupère l'ID du like existant
      }
    } catch (error) {
      console.error('Error fetching user like:', error);
    }
  };

  fetchUserLike();
}, [user, id]);



useEffect(() => {
  const fetchRating = async () => {
    try {
      const response = await fetch(`https://localhost:7174/api/Rating/GetRatingByMovie?movieId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch rating');

      const result = await response.json();
      // result peut être la note moyenne ou la note de l'utilisateur
      setRating(result); 
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  fetchRating();
}, [id]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-[#FFFC00]">Loading...</span>
      </div>
    );
  }
const fetchComments = async () => {
  try {
    const response = await fetch(`https://localhost:7174/api/Movie/${id}/comments`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();
    setMovieComments(data); // movieComments est ton state des commentaires
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};


  // Détection de source
  const isFromTMDB =
    movie.movieApiId !== undefined && movie.movieApiId !== null;

  // Champs communs
  const movieTitle = movie.title;
  const movieOverview =
    isFromTMDB
      ? movie.overview
      : movie.description || movie.overview || "No description available";

   const moviePoster = isTMDB
  ? movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : ""
  : movie.posterUrl || movie.posterPath || "";

const movieBackdrop = isTMDB
  ? movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : ""
  : movie.posterUrl || movie.posterPath || ""; // fallback si tu n’as pas de backdrop local

  // const movieGenres = isFromTMDB
  //   ? (movie.genres || []).map((g) => ({ id: g.id, name: g.name }))
  //   : (movie.genres || []).map((g, index) => ({ id: index, name: g }));

  const movieRating = isFromTMDB
    ? Number(movie.vote_average) || 0
    : Number(movie.AverageRating) || 0;

  const movieRelease = isFromTMDB
    ? movie.release_date
    : movie.releaseYear?.toString() || "N/A";

  // =====================
  // Handlers (like/rate/comment)
  // =====================
  const getApiUrl = (action) => {
    if (isFromTMDB) {
      return `https://localhost:7174/api/TMDB/${id}/${action}`;
    } else {
      return `https://localhost:7174/api/Movie/${id}/${action}`;
    }
  };

 // true si l'utilisateur a déjà liké

const handleLike = async () => {
  if (!user) return; // Vérifie que l'utilisateur est connecté

  try {
    if (!liked) {
      // Ajouter un like
      const likeData = {
        fK_Compte: user.idCompte,
        fK_Movie: id,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('https://localhost:7174/api/Like/PostLike', {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(likeData),
      });

      if (!response.ok) throw new Error('Failed to post like');

      // const result = await response.text();
      // console.log('Like posted successfully:', result);
      // setLikes(prev => prev + 1);
      // setLiked(true); 

      const result = await response.json(); // récupère l'objet du like avec idLike
      setLikes(prev => prev + 1);
      setLiked(true);
      setLikeId(result.idLike); // stocke l'ID pour pouvoir supprimer plus tard
      console.log('Like added', result);

    } else {
      // Supprimer le like
      if (!likeId) throw new Error('likeId not defined');
       // Supprimer le like
      const response = await fetch(`https://localhost:7174/api/Like/DeleteLike?id=${likeId}`, {
        method: 'DELETE',
        headers: { 'accept': 'text/plain' },
      });

      if (!response.ok) throw new Error('Failed to remove like');

      setLikes(prev => prev - 1);
      setLiked(false);
      setLikeId(null);
      console.log('Like removed');
    }
  } catch (error) {
    console.error('Error handling like:', error);
  }
};

const handleRate = async (value) => {
  if (!user) return;

  try {
    await fetch(`https://localhost:7174/api/Rating/PostRating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        fK_Compte: user.idCompte,
        fK_Movie: id,
        ratingValue: value,
        createdAt: new Date().toISOString(),
      }),
    });

    setRating(value); // met à jour localement pour que les étoiles restent colorées
  } catch (err) {
    console.error(err);
  }
};


const handleComment = async () => {
  if (!newComment.trim()) return; // Prevent empty comments

  const commentData = {
    fK_Compte: user?.idCompte,
    fK_Movie: id,
    content: newComment,
    createdAt: new Date().toISOString(), // Current timestamp in ISO format
  };

  try {
    const response = await fetch('https://localhost:7174/api/Comment/PostComment', {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    const result = await response.json();
    console.log('Comment posted successfully:', result);

    setMovieComments(prev => [result, ...prev]);
    setNewComment('');
    
  } catch (error) {
    console.error('Error posting comment:', error);
  }
};

const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const response = await fetch("https://localhost:7174/api/Movie/upload-poster", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await response.json();
        setPosterUrl(data.url || data.posterUrl || "");
        console.log("Poster URL:", data.url || data.posterUrl);
      } catch (err) {
        console.error("Error uploading poster:", err);
      }
    }
  };

  
  

  
  return (
    <div className="relative min-h-screen bg-[#010f1d] text-white">
      {/* Header */}
      <div
        className="relative h-[60vh] flex items-end"
        style={{
          backgroundImage: `url(${movieBackdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#010f1d] via-transparent to-transparent"></div>
        <div className="relative z-10 flex items-end p-8 gap-8">
          {moviePoster && (
            <img
              src={moviePoster}
              className="rounded-lg shadow-lg w-48 hidden md:block"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{movieTitle}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {(rating ?? 0).toFixed(1)}</span>
              <span>{movieRelease}</span>
            </div>
            {/* <div className="flex flex-wrap gap-2 mb-4">
              {movieGenres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div> */}
            <p className="max-w-2xl text-gray-200">{movieOverview}</p>
            {trailerKey && (
              <Link
                to={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
              >
                <button className="flex justify-center items-center bg-[#e50914] text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base mt-2 md:mt-4">
                  <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      {user?.roleName === "admin" && (
        <div className="fixed bottom-6 right-6 flex gap-4 z-50">
          <div
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg"
            onClick={() => setShowUpdateForm(true)}
          >
            ✎
          </div>
          <div
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg"
            onClick={async () => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this movie?"
              );
              if (!confirmDelete) return;

              try {
                const response = await fetch(
                  `https://localhost:7174/api/Movie/DeleteMovie?MovieId=${id}`,
                  {
                    method: "DELETE",
                    headers: {
                      accept: "text/plain",
                      Authorization: `Bearer ${user.token}`,
                    },
                  }
                );

                if (!response.ok) throw new Error("Failed to delete movie");

                alert("Movie deleted successfully!");
                navigate("/");
              } catch (err) {
                console.error("Error deleting movie:", err);
                alert("Error deleting movie");
              }
            }}
          >
            🗑️
          </div>
        </div>
      )}


  <UpdateMovieForm
  showUpdateForm={showUpdateForm}
  setShowUpdateForm={setShowUpdateForm}
  movie={movie} // Pass the movie object to prefill the form
  genresList={genresList}
/>


      {/* Interactions User */}
      {user?.roleName === "user" && (
        <div className="p-8">
  {/* Like + Rating */}
  <div className="flex justify-between items-center mb-4">
    {/* Like */}
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded text-white transition-colors duration-200 ${
  liked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400 hover:bg-gray-500'
}`}

    >
      ❤️ Like 
    </button>

    {/* Rating */}
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRate(star)}
          className={`cursor-pointer text-2xl ${
            rating >= star ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  </div>

  {/* Comments Section */}
<div className="border border-gray-600 p-4 rounded-none">
  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
    <MessageCircle className="w-5 h-5" />
    <span>Comments ({movieComments.length})</span>
  </h3>

  {user  && (
    <form onSubmit={(e) => {
    e.preventDefault(); // empêche le rechargement de la page
    handleComment();
  }} className="mb-6">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Share your thoughts about this movie..."
        className="w-full bg-gray-800 text-white p-3 border border-gray-700 rounded-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
        rows={3}
      />
      <button
        type="submit"
disabled={!newComment.trim()}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-none hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Post Comment
      </button>
    </form>
  )}

  <div className="space-y-4 max-h-64 overflow-y-auto">
    {movieComments.length > 0 ? (
      movieComments.map((comment) => (
        <div key={comment.IdComment} className="bg-gray-800 p-4 rounded-none">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white">{comment.content}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center py-8">
        No comments yet. Be the first to share your thoughts!
      </p>
    )}
  </div>
</div>


</div>

      )}

      {/* Details */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="LateXbg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Ajouté par: </span>
                <span className="ml-2">{movie.nom || "N/A"}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Release Date: </span>
                <span className="ml-2">{movieRelease || movie.releaseYear}</span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Original Language:{" "}
                </span>
                <span className="ml-2">
                  {movie.original_language?.toUpperCase() || "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Budget: </span>
                <span className="ml-2">
                  {movie.budget
                    ? `$${movie.budget.toLocaleString()}`
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Revenue: </span>
                <span className="ml-2">
                  {movie.revenue
                    ? `$${movie.revenue.toLocaleString()}`
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Production Companies:{" "}
                </span>
                <span className="ml-2">
                  {movie.production_companies?.length > 0
                    ? movie.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Countries: </span>
                <span className="ml-2">
                  {movie.production_countries?.length > 0
                    ? movie.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Spoken Languages:{" "}
                </span>
                <span className="ml-2">
                  {movie.spoken_languages?.length > 0
                    ? movie.spoken_languages
                        .map((l) => l.english_name)
                        .join(", ")
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {movie.tagline || "No tagline available."}
            </p>

            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movieOverview}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">You might also like...</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => {
              const recPoster =
                rec.poster_path || rec.posterUrl || rec.posterPath || "";
              const recTitle = rec.title;
              const recRelease =
                rec.release_date || rec.releaseDate || rec.releaseYear || "";
              return (
                <div
                  key={rec.id || rec.idMovie}
                  className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
                >
                  <Link to={`/movie/${rec.id || rec.idMovie}`}>
                    {recPoster && (
                      <img
                        src={
                          isTMDB
                            ? `https://image.tmdb.org/t/p/w300${recPoster}`
                            : recPoster
                        }
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-2">
                      <h3 className="text-sm font-semibold">{recTitle}</h3>
                      <span className="text-xs text-gray-400">
                        {recRelease?.toString().slice(0, 4)}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
