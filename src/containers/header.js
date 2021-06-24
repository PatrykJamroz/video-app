import { Header } from "../components/index";

export function HeaderContainer() {
  return (
    <Header>
      <Header.Title />
      <Header.Input />
      <Header.Button />
    </Header>
  );
}
