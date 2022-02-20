import { Context } from "../VideoContextProvider";
import React, { useContext } from "react";
import { Navbar, Button, Form, FormControl } from "react-bootstrap";

export default function Header() {
  const { handleVideoAdd, inputURL, handleInputURLChange } =
    useContext(Context);
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
