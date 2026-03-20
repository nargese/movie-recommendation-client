import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { idCompte } = useParams();
  const [userData, setUserData] = useState({
    idCompte: "",
    cin: "",
    nom: "",
    email: "",
    motdepasse: "",
    access: true,
    fK_Role: "",
    roleName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      navigate("/signIn");
      return;
    }

    const fetchUserData = async () => {
      const fetchId = idCompte || currentUser.idCompte;
      try {
        const response = await fetch(
          `https://localhost:7174/api/Comptes/GetCompte/${fetchId}`,
          {
            headers: {
              Accept: "text/plain",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [idCompte, currentUser?.idCompte, navigate]); // Only re-fetch when idCompte or currentUser.idCompte changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "https://localhost:7174/api/Comptes/PutCompte",
        {
          method: "PUT",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            ...userData,
            movies: [],
            ratings: [],
            likes: [],
            comments: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update localStorage if updating current user's own profile
      if (!idCompte || idCompte === currentUser.idCompte) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            idCompte: userData.idCompte,
            cin: userData.cin,
            nom: userData.nom,
            email: userData.email,
            fK_Role: userData.fK_Role,
            roleName: userData.roleName,
          })
        );
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Redirect based on role
        navigate(currentUser.roleName === "admin" ? "/accounts-management" : "/");
      }, 2000); // Redirect after showing success message
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <div className="bg-[#232323] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">CIN</label>
            <input
              type="text"
              name="cin"
              value={userData.cin || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium">Name</label>
            <input
              type="text"
              name="nom"
              value={userData.nom || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <input
              type="password"
              name="motdepasse"
              value={userData.motdepasse || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e50914] hover:bg-red-700 text-white py-3 rounded-lg font-medium"
          >
            Save Changes
          </button>
          {success && (
            <div className="text-green-500 text-center mt-2">
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mt-2">
              Error: {error}
            </div>
          )}
        </form>
        <Link
          to={currentUser.roleName === "admin" ? "/accounts-management" : "/"}
          className="block text-center mt-4 text-gray-400 hover:text-white"
        >
          Back to {currentUser.roleName === "admin" ? "Accounts Management" : "Home"}
        </Link>
      </div>
    </div>
  );
}