import { Navbar, Button, Form, FormControl } from "react-bootstrap";
import { useVideoContext } from "../VideoContextProvider";

export default function Header() {
  const { handleVideoAdd, inputURL, handleInputURLChange } = useVideoContext();
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Video App</Navbar.Brand>
      <Form onSubmit={handleVideoAdd} inline>
        <FormControl
          type="text"
          name="url"
          placeholder="Paste url"
          value={inputURL}
          onChange={(e) =>
            handleInputURLChange(e as React.FormEvent<HTMLInputElement>)
          }
          className="mr-sm-2"
        />
        <Button type="submit" variant="outline-success">
          Add
        </Button>
      </Form>
    </Navbar>
  );
}
