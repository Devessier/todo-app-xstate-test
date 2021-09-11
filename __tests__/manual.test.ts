import { screen, render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { lorem } from "faker";
import App from "../src/App.vue";

test("User can add a todo", async () => {
  render(App);
  const newTodo = lorem.sentence();

  const title = screen.getByText(/xtodo/i);
  expect(title).toBeVisible();

  const addTodoButton = screen.getByRole("button", { name: /add.*todo/i });
  expect(addTodoButton).toBeVisible();

  userEvent.click(addTodoButton);

  const newTodoInput = await screen.findByLabelText(/new.*todo/i);
  expect(newTodoInput).toBeVisible();

  userEvent.type(newTodoInput, newTodo);

  const submitTodoButton = screen.getByRole("button", { name: /save/i });
  expect(submitTodoButton).toBeVisible();

  userEvent.click(submitTodoButton);

  const newTodoItem = await screen.findByText(newTodo);
  expect(newTodoItem).toBeVisible();
});
