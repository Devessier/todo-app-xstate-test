// @@@SNIPSTART todo-app-xstate-test-manual-tests
import { screen, render, within, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { lorem } from "faker";
import App from "../App.vue";

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

test("User can check a todo", async () => {
  render(App);

  const uncheckedTodosGroup = screen.getByRole("group", {
    name: /things.*to.*do/i,
  });
  expect(uncheckedTodosGroup).toBeVisible();
  const uncheckedTodos = within(uncheckedTodosGroup).getAllByRole("listitem");
  expect(uncheckedTodos.length).toBeGreaterThanOrEqual(1);
  const uncheckedTodoToCheck = uncheckedTodos[0];
  expect(uncheckedTodoToCheck).toBeVisible();
  const uncheckedTodoToCheckCheckbox =
    within(uncheckedTodoToCheck).getByRole("checkbox");
  expect(uncheckedTodoToCheckCheckbox).toBeVisible();

  userEvent.click(uncheckedTodoToCheckCheckbox);

  const checkedTodosGroup = screen.getByRole("group", {
    name: /things.*done/i,
  });
  expect(uncheckedTodosGroup).toBeVisible();

  await waitFor(() => {
    const checkedTodos = within(checkedTodosGroup).getAllByRole("listitem");

    const checkedTodoUnchecked = checkedTodos.find((todo) =>
      todo.textContent?.includes(uncheckedTodoToCheck.textContent!)
    );
    expect(checkedTodoUnchecked).toBeVisible();
  });
});

test("User can uncheck a todo", async () => {
  render(App);

  const checkedTodosGroup = screen.getByRole("group", {
    name: /things.*done/i,
  });
  expect(checkedTodosGroup).toBeVisible();
  const checkedTodos = within(checkedTodosGroup).getAllByRole("listitem");
  expect(checkedTodos.length).toBeGreaterThanOrEqual(1);
  const checkedTodoToUncheck = checkedTodos[0];
  expect(checkedTodoToUncheck).toBeVisible();
  const checkedTodoToUncheckCheckbox =
    within(checkedTodoToUncheck).getByRole("checkbox");
  expect(checkedTodoToUncheckCheckbox).toBeVisible();

  userEvent.click(checkedTodoToUncheckCheckbox);

  const uncheckedTodosGroup = screen.getByRole("group", {
    name: /things.*to.*do/i,
  });
  expect(uncheckedTodosGroup).toBeVisible();

  await waitFor(() => {
    const uncheckedTodos = within(uncheckedTodosGroup).getAllByRole("listitem");

    const uncheckedTodoChecked = uncheckedTodos.find((todo) =>
      todo.textContent?.includes(checkedTodoToUncheck.textContent!)
    );
    expect(uncheckedTodoChecked).toBeVisible();
  });
});
// @@@SNIPEND
