import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const navigate = useNavigate();
  const [cin, setCin] = useState("");
  const [motdepasse, setMotdepasse] = useState("");

  // const handleLogin =(e) => {
  //   e.preventDefault();
  //   const data={
  //     cin: cin,
  //     motdepasse: motdepasse
  //   }
  //   axios.post("https://localhost:7174/api/Comptes/login", data, {
  //     headers: { "Content-Type": "application/json" },
  //     withCredentials: true
  //   }).then((response) => {
  //   const token = response.data.token;  // <-- access token here
  //   localStorage.setItem("token", token); // save token
  //   console.log("Token:", token);
  //   //alert("Login successful! Token: " + token);

  //   // Optional: store token in localStorage for future requests
  //   localStorage.setItem("token", token);

  //   // Redirect after login
  //   navigate("/");

  // })
  // .catch((error) => {
  //   console.error("Erreur lors de la connexion:", error);
  //   alert("Erreur de connexion");
  // });
  // };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = {
      cin: cin,
      motdepasse: motdepasse
    };

    const response = await axios.post("https://localhost:7174/api/Comptes/login", data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    const token = response.data.token;
    console.log("Token:", token);

    // Decode token to get CIN
    const decoded = jwtDecode(token);
    const userCin = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    // Fetch user profile
    const res = await axios.get(`https://localhost:7174/api/Comptes/GetCompteByCin?cin=${userCin}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Store user and token in localStorage
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("token", token);

    // Refresh Navbar and redirect
    
    navigate("/");
    window.location.reload();

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    alert("Erreur de connexion");
  }
};
 
  const handleCin = (value) => {
    setCin(value);
  };

  const handleMotdepasse = (value) => {
    setMotdepasse(value);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
      }}
    >
      <div className="max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto mt-8">
        <h1 className="text-3xl font-medium text-white mb-7">Sign In</h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            value={cin}
            onChange={(e) => handleCin(e.target.value)}
            placeholder="CIN"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="password"
            value={motdepasse}
            onChange={(e) => handleMotdepasse(e.target.value)}
            placeholder="password"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />


          <button
            type="submit"
            className="w-full bg-[#e50914] text-white py-2 rounded text-base hover:opacity-90 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 text-[#737373] text-sm">
          <p>
            New to Choufli Film?{" "}
            <span
                onClick={() => navigate("/signup")}
              className="text-white font-medium cursor-pointer ml-2 hover:underline"
            >
              Sign Up Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

