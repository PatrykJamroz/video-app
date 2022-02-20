import Card from "react-bootstrap/Card";
import { CardGroup, Row, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Header from "./components/Header";
import { useVideoContext } from "./VideoContextProvider";

function App() {
  const {
    videoData,
    deleteVideo,
    toggleFavourite,
    handleFilterChange,
    sortDataBy,
    deleteAllData,
    exportToJsonFile,
    handleJsonImport,
    handleVideoModalClose,
    handleVideoModalShow,
    showVideoModal,
    modalData,
    showWrongUrlModal,
    handleWrongUrlModalClose,
  } = useVideoContext();

  return (
    <div className="App">
      <Header />
      <Button onClick={() => handleFilterChange("YouTube")}>Youtube</Button>
      <Button onClick={() => handleFilterChange("Vimeo")}>Vimeo</Button>
      <Button onClick={() => handleFilterChange("")}>All</Button>
      <Button variant="success" onClick={() => sortDataBy("savedDate")}>
        By date
      </Button>
      <Button variant="success" onClick={() => sortDataBy("likeCount")}>
        By likes
      </Button>
      <Button variant="success" onClick={() => sortDataBy("favourite")}>
        Favourites
      </Button>
      <Button variant="danger" onClick={() => deleteAllData}>
        Remove all items
      </Button>
      <Button variant="danger" onClick={() => exportToJsonFile}>
        Export data
      </Button>
      <Modal
        show={showVideoModal}
        onHide={handleVideoModalClose}
        backdrop="static"
        keyboard
        size="lg"
        align="center"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalData?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            id="inlineFrameExample"
            title="Inline Frame Example"
            src={modalData?.src}
            width="640"
            height="360"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleVideoModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showWrongUrlModal}
        onHide={handleWrongUrlModalClose}
        backdrop="static"
        keyboard
        size="sm"
        align="center"
      >
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Incorrect video URL or ID!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleWrongUrlModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Form>
        <Form.Group>
          <Form.File
            id="exampleFormControlFile1"
            label="Import data"
            onChange={handleJsonImport}
          />
        </Form.Group>
      </Form>
      <CardGroup>
        <Row xs={1} md={3} className="g-4">
          {videoData.length === 0 ? (
            <p>Nothing to show here. Let`s add video!</p>
          ) : (
            videoData.map((item) => (
              <Card
                style={{ minWidth: "18rem", maxWidth: "300px " }}
                key={item.key}
              >
                <Card.Img
                  variant="top"
                  src={item.thumbnail}
                  onClick={() => handleVideoModalShow(item)}
                />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{`video ID: ${item.id}`}</Card.Text>
                  <Card.Text>{`saved date: ${item.savedDate}`}</Card.Text>
                  <Card.Text>{`views: ${item.viewCount}`}</Card.Text>
                  <Card.Text>{`likes: ${item.likeCount}`}</Card.Text>
                  <Card.Text>{`favourite: ${item.favourite}`}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => deleteVideo(item.key)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    Watch on {item.source}
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => toggleFavourite(item.key)}
                  >
                    {item.favourite
                      ? "Remove from favourites"
                      : "Add to favourites"}
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Row>
      </CardGroup>
    </div>
  );
}

export default App;
