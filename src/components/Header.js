import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { useVideo } from "../hooks/useVideo";

export default function Header() {
  const data = useVideo();
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand href="#home">Video App</Navbar.Brand>
      <Form onSubmit={data.handleVideoAdd} inline>
        <FormControl
          type="text"
          name="url"
          placeholder="Paste url"
          value={data.inputURL}
          onChange={data.handleInputURLChange}
          className="mr-sm-2"
        />
        <Button type="submit" variant="outline-success">
          Add
        </Button>
      </Form>
    </Navbar>
  );
}
