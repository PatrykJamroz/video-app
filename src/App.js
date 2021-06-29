import Header from "./components/Header";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useVideo } from "./hooks/useVideo";

function App() {
  const data = useVideo();

  return (
    <div className="App">
      <Header />
      {data.videoData.map((item) => (
        <Card
          style={{ width: "18rem" }}
          key={`${item.id}${data.videoData.length}`}
        >
          <Card.Img variant="top" src={item.thumbnail} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.id}</Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default App;
