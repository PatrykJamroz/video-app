import Header from "./components/Header";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Context } from "./Context";
import { useContext } from "react";

function App() {
  const { videoData, deleteVideo, toggleFavourite, handleFilterChange } =
    useContext(Context);

  return (
    <div className="App">
      <Header />
      <Button onClick={(e) => handleFilterChange("YouTube")}>Youtube</Button>
      <Button onClick={(e) => handleFilterChange("Vimeo")}>Vimeo</Button>
      <Button onClick={(e) => handleFilterChange("")}>All</Button>
      {videoData.length === 0 ? (
        <p>Nothing to show here. Let's add video!</p>
      ) : (
        videoData.map((item) => (
          <Card style={{ width: "18rem" }} key={item.key}>
            <Card.Img variant="top" src={item.thumbnail} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{`video ID: ${item.id}`}</Card.Text>
              <Card.Text>{`saved date: ${item.savedDate}`}</Card.Text>
              <Card.Text>{`views: ${item.viewCount}`}</Card.Text>
              <Card.Text>{`likes: ${item.likeCount}`}</Card.Text>
              <Card.Text>{`favourite: ${item.favourite}`}</Card.Text>
              <Button
                variant="danger"
                onClick={(e) => deleteVideo(item.key, e)}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={(e) => window.open(item.url, "_blank")}
              >
                Watch on {item.source}
              </Button>
              <Button
                variant="success"
                onClick={(e) => toggleFavourite(item.key, e)}
              >
                {item.favourite
                  ? "Remove from favourites"
                  : "Add to favourites"}
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default App;
