import "./App.css";
import Header from "./components/Header";
import { useVideo } from "./hooks/useVideo";

function App() {
  const data = useVideo();

  return (
    <div className="App">
      <Header />
      {data.inputURL}
    </div>
  );
}

export default App;
