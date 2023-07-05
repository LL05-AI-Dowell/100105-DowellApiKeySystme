import { Route, Routes } from "react-router-dom"

import CreateApi from "./pages/CreateApi";
import CreatedApiKeys from "./pages/CreatedApiKeys";
import Profile from "./pages/Profile";
import ConstructionPage from "./pages/ConstructionPage";
import useDowellLogin from "./hooks/useDowellLogin";
import { useUserContext } from "./contexts/UserContext";

function App() {

  const { appLoading } = useUserContext();
  
  useDowellLogin();

  if (appLoading) return (
    // you can replace this with a loading page
    <Routes>
      <Route path="*" element={<>Please wait...</>}></Route>
    </Routes>
  )

  return (
    <Routes path='/' element={<CreateApi />} >
      <Route index element={<CreateApi />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/createdapikeys' element={<CreatedApiKeys />} />
    </Routes>
  );
}

export default App;


