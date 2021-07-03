import Header from "./components/Header";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Context } from "./Context";
import { useContext } from "react";

function App() {
  const { videoData, deleteVideo } = useContext(Context);

  return (
    <div className="App">
      <Header />
      {videoData.map((item) => (
        <Card style={{ width: "18rem" }} key={`${item.id}${Math.random()}`}>
          <Card.Img variant="top" src={item.thumbnail} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{`video ID: ${item.id}`}</Card.Text>
            <Card.Text>{`saved date: ${item.savedDate}`}</Card.Text>
            <Button variant="primary" onClick={(e) => deleteVideo(item.id, e)}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default App;
