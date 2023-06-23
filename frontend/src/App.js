import { Route, Routes, HashRouter} from "react-router-dom"

import CreateApi from "./pages/CreateApi";
import CreatedApiKeys from "./pages/CreatedApiKeys";

function App() {
  return (
    <HashRouter>
      <Routes path='/' element={<CreateApi />} >
        <Route index element={<CreateApi />} />
        <Route path='/createdapikeys' element={<CreatedApiKeys />} />
      </Routes>
    </HashRouter>
  );
}

export default App;


