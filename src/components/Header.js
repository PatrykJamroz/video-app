import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { Context } from "../Context";
import { useContext } from "react";

export default function Header() {
  const { handleVideoAdd, inputURL, handleInputURLChange } =
    useContext(Context);
  // console.log(`header: ${data.videoData}`);
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Video App</Navbar.Brand>
      <Form onSubmit={handleVideoAdd} inline>
        <FormControl
          type="text"
          name="url"
          placeholder="Paste url"
          value={inputURL}
          onChange={handleInputURLChange}
          className="mr-sm-2"
        />
        <Button type="submit" variant="outline-success">
          Add
        </Button>
      </Form>
    </Navbar>
  );
}
