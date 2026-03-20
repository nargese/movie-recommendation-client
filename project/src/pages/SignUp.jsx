import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const roleMap = {
  admin: "b051422c-a34c-4ffd-3134-08dde48c1713",
  user: "ff29d166-8888-4208-85ad-08dde496a9fd"
};

export default function SignUp() {
  const navigate = useNavigate();
  const [cin, setCin] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    const data = {
      cin,
      nom,
      email,
      motdepasse,
      access: true,
      fK_Role: roleMap[role]
    };

    axios.post("https://localhost:7174/api/Comptes/PostCompte", data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }).then((response) => {
    alert("SignUp successful!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Erreur lors de l'inscription:", err);
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      });
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
        <h1 className="text-3xl font-medium text-white mb-7">Sign Up</h1>

        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          <input
            type="text"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            placeholder="CIN"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <input
            type="password"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
            placeholder="password"
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-[50px] bg-[#333] text-white rouded px-5 text-base"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>


          <button
            type="submit"
            className="w-full bg-[#e50914] text-white py-2 rounded text-base hover:opacity-90 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-[#737373] text-sm">
          <p>
            Already have an account?{" "}
            <span
                onClick={() => navigate("/signin")}
              className="text-white font-medium cursor-pointer ml-2 hover:underline"
            >
              Sign In Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

