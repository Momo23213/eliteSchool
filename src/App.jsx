import { BrowserRouter} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./ToastProvider";
import Loyout from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";
// import { SchoolProvider } from './contexts/SchoolContext';




function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <ThemeProvider>
        {/* <Navbar/> */}
    <Loyout/>
      <ToastProvider/>
    </ThemeProvider>
    </AuthProvider>
    </BrowserRouter>

  )
}

export default App