import { Container, Input, Button, Title } from "./styles/header";

export default function Header({ children }) {
  return <Container>{children}</Container>;
}

Header.Input = function HeaderInput({ ...restProps }) {
  return <Input placeholder="paste video link" />;
};

Header.Button = function HeaderButton({ ...restProps }) {
  return <Button>Add</Button>;
};

Header.Title = function HeaderTitle() {
  return <Title>VIDEO APP</Title>;
};
