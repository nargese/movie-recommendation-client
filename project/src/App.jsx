import { Route, Routes } from "react-router"  
import Navbar from "./components/Navbar"
import Homepage from "./pages/Homepage"
import Moviepage from "./pages/MoviePage"
import SignIn from "./pages/Signin"
import SignUp from "./pages/SignUp"
import AIRecommendations from "./pages/AIRecommendations"
import UpdateProfile from "./components/UpdateProfile"
import AccountsManagement from "./components/AccountsManagement"
const App = () => {

  return (
      <div>
        <Navbar />
        <Routes>
<Route path="/update-profile" element={<UpdateProfile />} />
    <Route path="/update-profile/:idCompte" element={<UpdateProfile />} />
    <Route path="/accounts-management" element={<AccountsManagement />} />          <Route path={"/"} element={<Homepage />} />
          <Route path={"/movie/:id"} element={<Moviepage />} />
          <Route path={"/signIn"} element={<SignIn />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        </Routes>
      </div>
  )
}

export default App
