// import { create } from "zustand";
// import axios from "axios";

// axios.defaults.withCredentials = false; // no cookies, we use JWT

// const API_URL = "http://localhost:7174/api/Comptes"; // your backend

// export const useAuthStore = create((set) => ({
//   // states
//   user: null,
//   token: null,
//   isLoading: false,
//   error: null,
//   message: null,
//   fetchingUser: false,

//   // 🔹 SignUp
//   signup: async ({ cin, nom, email, motdepasse, roleId }) => {
//     set({ isLoading: true, message: null, error: null });
//     try {
//       const response = await axios.post(`${API_URL}`, {
//         cin,
//         nom,
//         email,
//         motdepasse,
//         access: true,
//         fK_Role: roleId, // must be passed from UI
//       });

//       set({ message: "Signup successful", isLoading: false });
//       return response.data;
//     } catch (error) {
//       set({
//         isLoading: false,
//         error: error.response?.data?.message || "Error Signing up",
//       });
//       throw error;
//     }
//   },

//   // 🔹 Login
//   login: async (cin, motdepasse) => {
//     set({ isLoading: true, message: null, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/login`, { cin, motdepasse });
//       const { token } = response.data;

//       // Store token locally
//       localStorage.setItem("token", token);

//       set({
//         token,
//         user: { cin }, // you can decode token if you want full info
//         isLoading: false,
//         message: "Login successful",
//       });

//       return { token };
//     } catch (error) {
//       set({
//         isLoading: false,
//         error: error.response?.data?.message || "Error logging in",
//       });
//       throw error;
//     }
//   },

//   // 🔹 Fetch User (decode token)
//   fetchUser: async () => {
//     set({ fetchingUser: true });
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         set({ fetchingUser: false, user: null });
//         return null;
//       }

//       // decode token payload (without extra request)
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const user = {
//         cin: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
//         role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
//       };

//       set({ user, token, fetchingUser: false });
//       return user;
//     } catch (error) {
//       set({ fetchingUser: false, user: null, error: "Invalid token" });
//     }
//   },

//   // 🔹 Logout
//   logout: () => {
//     localStorage.removeItem("token");
//     set({ user: null, token: null, message: "Logged out" });
//   },
// }));
