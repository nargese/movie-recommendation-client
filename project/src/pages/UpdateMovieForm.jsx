import React, { useState } from 'react';

const UpdateMovieForm = ({ showUpdateForm, setShowUpdateForm, movie, genresList, userProp }) => {
  const [formData, setFormData] = useState({
    idMovie: movie?.idMovie || '',
    movieApiId: movie?.movieApiId || 0,
    title: movie?.title || '',
    overview: movie?.overview || '',
    releaseDate: movie?.releaseDate || '',
    description: movie?.description || '',
    releaseYear: movie?.releaseYear || 0,
    posterUrl: movie?.posterUrl || '',
    averageRating: movie?.averageRating || 0,
    createdAt: movie?.createdAt || '',
    fK_Compte: movie?.fK_Compte || '',
    genreIds: movie?.genreIds || [],
  });
  const [selectedGenres, setSelectedGenres] = useState(movie?.genreIds || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'averageRating' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, posterUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (idGenre) => {
    if (selectedGenres.includes(idGenre)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== idGenre));
    } else {
      setSelectedGenres([...selectedGenres, idGenre]);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedFormData = { ...formData, genreIds: selectedGenres };
      const response = await fetch(`https://localhost:7174/api/Movie/PutMovie/${formData.idMovie}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        alert('Movie updated successfully');
        setShowUpdateForm(false);
        window.location.reload(); 
      } else {
        alert('Failed to update movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('An error occurred while updating the movie');
    }
  };

  if (!showUpdateForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Update Movie</h2>
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded text-black"
            required
          />
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Overview"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            placeholder="Release Year (e.g., 2017)"
            className="w-full p-2 border border-gray-300 rounded text-black"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          {formData.posterUrl && (
            <img
              src={formData.posterUrl}
              alt="Poster Preview"
              className="w-full h-auto rounded mb-3"
            />
          )}
          <input
            type="number"
            name="averageRating"
            value={formData.averageRating}
            onChange={handleChange}
            placeholder="Average Rating (e.g., 4.5)"
            step="0.1"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <div className="mb-3">
            <p className="font-semibold mb-2 text-black">Genres:</p>
            {genresList.map((genre) => (
              <label key={genre.idGenre} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.idGenre)}
                  onChange={() => toggleGenre(genre.idGenre)}
                />
                <span className="text-black">{genre.name}</span>
              </label>
            ))}
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={() => setShowUpdateForm(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default UpdateMovieForm;