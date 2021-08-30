import Header from "./components/Header.tsx";
import Card from "react-bootstrap/Card";
import { CardGroup } from "react-bootstrap";
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Context } from "./Context.tsx";
import { useContext } from "react";
import Form from "react-bootstrap/Form";
import { Modal } from "react-bootstrap";

function App() {
  const {
    videoData,
    deleteVideo,
    toggleFavourite,
    handleFilterChange,
    videoSources,
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
  } = useContext(Context);

  return (
    <div className="App">
      <Header />
      {videoSources.map((item) => (
        <p>{item}</p>
      ))}
      <Button onClick={(e) => handleFilterChange("YouTube")}>Youtube</Button>
      <Button onClick={(e) => handleFilterChange("Vimeo")}>Vimeo</Button>
      <Button onClick={(e) => handleFilterChange("")}>All</Button>
      <Button variant="success" onClick={(e) => sortDataBy("savedDate")}>
        By date
      </Button>
      <Button variant="success" onClick={(e) => sortDataBy("likeCount")}>
        By likes
      </Button>
      <Button variant="success" onClick={(e) => sortDataBy("favourite")}>
        Favourites
      </Button>
      <Button variant="danger" onClick={(e) => deleteAllData()}>
        Remove all items
      </Button>
      <Button variant="danger" onClick={(e) => exportToJsonFile()}>
        Export data
      </Button>
      <Modal
        show={showVideoModal}
        onHide={handleVideoModalClose}
        backdrop="static"
        keyboard={true}
        size="lg"
        align="center"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            id="inlineFrameExample"
            title="Inline Frame Example"
            src={modalData.src}
            width="640"
            height="360"
          ></iframe>
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
        keyboard={true}
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
            <p>Nothing to show here. Let's add video!</p>
          ) : (
            videoData.map((item) => (
              <Card
                style={{ minWidth: "18rem", maxWidth: "300px " }}
                key={item.key}
              >
                <Card.Img
                  variant="top"
                  src={item.thumbnail}
                  onClick={(e) => handleVideoModalShow(item)}
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
        </Row>
      </CardGroup>
    </div>
  );
}

export default App;
