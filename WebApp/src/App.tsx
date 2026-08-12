import { useEffect } from "react";
import { Landing } from "./routes/index";
import { ThemeProvider } from "@/components/theme-provider";
import { initFirebaseAnalytics } from "@/lib/firebase";

function App() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  return (
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  );
}

export default App;
