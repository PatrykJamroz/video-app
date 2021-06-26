import "./App.css";
import Header from "./components/Header";
import { useVideo } from "./hooks/useVideo";

function App() {
  const data = useVideo();

  return (
    <div className="App">
      <Header />
      {data.videoData === undefined ? (
        <h1>Empty data</h1>
      ) : (
        data.videoData.map((item) => {
          <h1 key={item.id}>{item.name}</h1>;
        })
      )}
    </div>
  );
}

export default App;
