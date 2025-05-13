import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage.jsx";
import MainPage from "./Pages/MainPage.jsx";
import ChatWindow from "./Components/ChatWindow.jsx";
import ProfileInfo from "./Components/ProfileInfo.jsx";
import { useSelector } from "react-redux";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  let location = useLocation();
  let background = location.state?.background;
  const isAuth = useSelector((state) => state.tokenInfo);
  const user = useSelector((state) => state.userInfo);
  const darkMode = useSelector((state) => state.darkMode);
  document.documentElement.classList.toggle("dark", darkMode);
  return (
    <div className={"max-lg:block flex w-screen h-screen bg-gray-100 dark:bg-gray-800"}>
      <Routes location={background || location}>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={isAuth || user ? <MainPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/user"
          element={isAuth || user ? <ProfileInfo /> : <Navigate to={"/"} />}
        />
      </Routes>

      {background && (
        <>
          <Routes>
            <Route
              path="/chat/:chatId"
              element={isAuth || user ? <ChatWindow /> : <Navigate to={"/"} />}
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
