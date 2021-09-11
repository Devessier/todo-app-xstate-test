import { render } from "@testing-library/vue";
import App from "../src/App.vue";

test("User can add a todo", () => {
  const screen = render(App);

  const title = screen.getByText(/xtodo/i);
  expect(title).toBeVisible();
});
