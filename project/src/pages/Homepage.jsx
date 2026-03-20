import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import Footer from '../components/Footer'
import { User, Plus } from 'lucide-react';
import axios from 'axios'

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

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false) // pour afficher le formulaire


  // Champs du formulaire
  const [title, setTitle] = useState("")
  const [overview, setOverview] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [posterUrl, setPosterUrl] = useState("")
  const [averageRating, setAverageRating] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const toggleGenre = (idGenre) => {
    if (selectedGenres.includes(idGenre)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== idGenre))
    } else {
      setSelectedGenres([...selectedGenres, idGenre])
    }
  }

  //console.log("🔍 DEBUG Homepage user:", user);
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newMovie = {
        movieApiId: 0,
        title,
        overview,
        posterPath: "string",
        releaseDate: releaseYear,
        description,
        releaseYear: parseInt(releaseYear),
        posterUrl,
        averageRating: parseFloat(averageRating),
        createdAt: new Date().toISOString(),
        fK_Compte: user.idCompte,
        genreIds: selectedGenres
      }

      await axios.post("https://localhost:7174/api/Movie/PostMovie", newMovie, {
        headers: {
          "Content-Type": "application/json-patch+json"
        }
      })

      alert("✅ Film ajouté avec succès !")
      setShowForm(false)

      // Reset form
      setTitle("")
      setOverview("")
      setDescription("")
      setReleaseYear("")
      setPosterUrl("")
      setAverageRating("")
      setSelectedGenres([])

    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du film :", error.response || error)
      alert("Erreur lors de l'ajout du film")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  const handleFileChange = async (e) => {
  if (e.target.files && e.target.files[0]) {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const response = await fetch("https://localhost:7174/api/Movie/upload-poster", {
      method: "POST",
      body: formData,
      credentials: "include"
    }).then(res => res.json())
      .then(data => {
        setPosterUrl(data.url); // URL du poster retournée par le backend
        console.log("Poster URL :", data.url);
      })
      .catch(err => console.error(err));
    }
};

  return (
    <div className='p-5'>
        <Hero />
        {/* Partie admin */}
      {user?.roleName === "admin" && user.idCompte && (
        <CardList
          title="My Movies"
          category="added_by_me"
          userId={user.idCompte}
        />
      )}

      {/* Partie user */}
      {user?.roleName === "user" && user.idCompte && (
        <CardList
          title="Movies I Liked"
          category="liked_by_me"
          userId={user.idCompte}
        />
      )}
        {/* Cards générales visibles pour tous */}
        <CardList title="Recently Added" category={"recently_added"} />
        <CardList title="Now Playing" category={"now_playing"} />
        <CardList title="Top Rated" category={"top_rated"} />
        <CardList title="Popular" category={"popular"} />
        <CardList title="Upcoming" category={"upcoming"} />
        
        {/* Floating Action Button pour admin */}
      {user?.roleName === "admin" && (
        <div
          className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg z-50"
          onClick={() => setShowForm(true)}
        >
          <Plus size={32} />
        </div>
      )}

       {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ajouter un film</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3"
                required
              />
              <textarea
                placeholder="Overview"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              <input
                type="number"
                placeholder="Année de sortie (ex: 2017)"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />
              {/* ← Put the preview image here */}
  {posterUrl && (
    <img
      src={posterUrl}
      alt="Poster Preview"
      className="w-full h-auto rounded mb-3"
    />
  )}

              <input
                type="number"
                step="0.1"
                placeholder="Note moyenne (ex: 4.5)"
                value={averageRating}
                onChange={(e) => setAverageRating(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3"
              />

              {/* Genres Checkboxes */}
              <div className="mb-3">
                <p className="font-semibold mb-2">Genres :</p>
                {genresList.map((genre) => (
                  <label key={genre.idGenre} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.idGenre)}
                      onChange={() => toggleGenre(genre.idGenre)}
                    />
                    <span>{genre.name}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
              >
                Ajouter
              </button>
            </form>
console.log("Poster URL:", posterUrl);

            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
        
        <Footer />
    </div>
  )
}

export default Homepage