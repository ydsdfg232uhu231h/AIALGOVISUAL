import { ThemeProvider } from "./context/ThemeProvider.jsx";
import FrontRoute from "./Routes/FrontRoute";

function App(){
  return(<>
  <ThemeProvider>
      <FrontRoute/>
  </ThemeProvider>
  </>)
}
export default App;