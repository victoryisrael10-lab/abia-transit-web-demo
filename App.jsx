import ForOperators from "./pages/ForOperators";
import Home from "./pages/Home";
import InspectorPage from "./pages/InspectorPage";
import MapPage from "./pages/MapPage";
import TicketPage from "./pages/TicketPage";
import WalletPage from "./pages/WalletPage";
import AuthModal from "./components/AuthModal";
import { AuthProvider } from "./context/AuthContext";

const pages = {
  "/": Home,
  "/map": MapPage,
  "/ticket": TicketPage,
  "/for-operators": ForOperators,
  "/wallet": WalletPage,
  "/inspector": InspectorPage,
};

export default function App() {
  const CurrentPage = pages[window.location.pathname] ?? Home;
  return (
    <AuthProvider>
      <CurrentPage />
      <AuthModal />
    </AuthProvider>
  );
}
