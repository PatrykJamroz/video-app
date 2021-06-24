import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

export default function Header() {
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand href="#home">Video App</Navbar.Brand>
      <Form inline>
        <FormControl type="text" placeholder="Paste url" className="mr-sm-2" />
        <Button variant="outline-success">Add!</Button>
      </Form>
    </Navbar>
  );
}
