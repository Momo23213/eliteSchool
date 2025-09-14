import { BrowserRouter} from "react-router-dom";
import { SchoolProvider } from "./context/SchoolContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./ToastProvider";
import Loyout from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";
// import { SchoolProvider } from './contexts/SchoolContext';




function App() {
  return (
    <BrowserRouter>
    <SchoolProvider>
    <AuthProvider>
    <ThemeProvider>
        {/* <Navbar/> */}
    <Loyout/>
      <ToastProvider/>
    </ThemeProvider>
    </AuthProvider>
    </SchoolProvider>
    </BrowserRouter>

  )
}

export default App