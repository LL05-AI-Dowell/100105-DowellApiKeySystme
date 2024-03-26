import { Route, Routes } from "react-router-dom";

/////////pages
import ConstructionPage from "./pages/ConstructionPage";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import FeedbackPage from "./pages/FeedbackPage";
import Profile from "./pages/Profile";
import ModuleServicePage from "./pages/ModuleServicePage";
import ProductServicePage from "./pages/ProductServicePage";
import FlutterServicePage from "./pages/FlutterServicePage";
import PythonServicePage from "./pages/PythonServicePage";
import WpPluginServicePage from "./pages/WpPluginServicePage";
import ReactComponentServicePage from "./pages/ReactComponentServicePage";
import AddService from "./pages/AddService";
import Settings from "./pages/Settings";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import AdminPage from "./pages/AdminPage";

import useDowellLogin from "./hooks/useDowellLogin";
import { useUserContext } from "./contexts/UserContext";

function App() {
  const { appLoading } = useUserContext();

  useDowellLogin();

  if (appLoading)
    return (
      // you can replace this with a loading page
      <Routes>
        <Route path="*" element={<>Please wait...</>}></Route>
      </Routes>
    );

  return (
    <Routes path="/" element={<Dashboard />}>
      <Route index element={<Dashboard />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/moduleService" element={<ModuleServicePage />} />
      <Route path="/productService" element={<ProductServicePage />} />
      <Route path="/flutterService" element={<FlutterServicePage />} />
      <Route path="/pythonService" element={<PythonServicePage />} />
      <Route path="/wpPluginService" element={<WpPluginServicePage />} />
      <Route path="/reactService" element={<ReactComponentServicePage />} />
      <Route path="/addService" element={<AddService />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/checkPayment" element={<PaymentStatusPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
