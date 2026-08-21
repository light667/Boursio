import { useEffect } from "react";
import { Landing } from "./routes/index";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/hooks/use-lang";
import { initFirebaseAnalytics } from "@/lib/firebase";

function App() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  return (
    <ThemeProvider>
      <LangProvider>
        <Landing />
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
