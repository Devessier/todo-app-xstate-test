<script lang="ts" setup>
import { computed } from "vue";
import { PlusIcon } from "@heroicons/vue/solid";
import { createModel } from "xstate/lib/model";
import { useMachine } from "@xstate/vue";
import CheckboxList from "./components/CheckboxList.vue";

interface TodoItem {
  id: string;
  checked: boolean;
  label: string;
}

const todoModel = createModel(
  {
    todos: [
      {
        id: "1",
        label: "Clean my computer",
        checked: false,
      },
      {
        id: "2",
        label: "Buy a keyboard",
        checked: false,
      },
      {
        id: "3",
        label: "Write an article about @xtate/test",
        checked: true,
      },
    ] as TodoItem[],
  },
  {
    events: {
      CREATE_TODO: () => ({}),

      CLOSE_TODO_CREATION: () => ({}),

      SAVE_TODO: (todo: string) => ({ todo }),
    },
  }
);

const todoMachine = todoModel.createMachine({
  context: todoModel.initialContext,

  initial: "idle",

  states: {
    idle: {
      on: {
        CREATE_TODO: {
          target: "creatingTodo",
        },
      },
    },

    creatingTodo: {
      tags: "showTodoCreationForm",

      on: {
        CLOSE_TODO_CREATION: {
          target: "idle",
        },

        SAVE_TODO: {
          target: "idle",

          actions: todoModel.assign({
            todos: ({ todos }, { todo }) => [
              ...todos,
              {
                id: todo,
                label: todo,
                checked: false,
              },
            ],
          }),
        },
      },
    },
  },
});

const { state, send } = useMachine(todoMachine);

const showTodoCreationForm = computed(() =>
  state.value.hasTag("showTodoCreationForm")
);
const thingsToDo = computed(() =>
  state.value.context.todos.filter(({ checked }) => checked === false)
);
const thingsDone = computed(() =>
  state.value.context.todos.filter(({ checked }) => checked === true)
);

function handleOpenTodoCreation() {
  send({
    type: "CREATE_TODO",
  });
}

function handleCloseTodoCreation() {
  send({
    type: "CLOSE_TODO_CREATION",
  });
}

function sanitizeNewTodo(todo: string): string {
  return todo.trim();
}

function handleSaveTodo({ target }: Event) {
  if (target === null) {
    return;
  }

  const formData = new FormData(target as HTMLFormElement);
  const newTodo = formData.get("new-todo");
  if (typeof newTodo !== "string") {
    return;
  }

  const sanitizedNewTodo = sanitizeNewTodo(newTodo);
  if (sanitizedNewTodo.length === 0) {
    return;
  }

  send({
    type: "SAVE_TODO",
    todo: newTodo,
  });
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="bg-white border-b border-gray-200">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <p class="text-xl font-medium leading-6 text-gray-900 sm:truncate">
            XTodo
          </p>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <header>
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Things to get done
          </h1>
        </div>
      </header>

      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="px-4 py-8 space-y-6 sm:px-0">
            <CheckboxList :items="thingsToDo">
              <template #title> Things to do </template>
            </CheckboxList>

            <div
              v-if="showTodoCreationForm"
              class="bg-white shadow sm:rounded-lg"
            >
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Create a todo
                </h3>

                <form class="mt-5" @submit.prevent="handleSaveTodo">
                  <div class="w-full sm:max-w-xs">
                    <label for="new-todo" class="sr-only">New Todo</label>

                    <input
                      type="text"
                      name="new-todo"
                      id="new-todo"
                      class="block w-full border-gray-300 rounded-md shadow-sm  focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder="Write an article about XState"
                    />
                  </div>

                  <div class="flex justify-start pt-5">
                    <button
                      type="submit"
                      class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-md shadow-sm  hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      class="px-4 py-2 ml-3 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm  text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      @click="handleCloseTodoCreation"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <button
              v-else
              type="button"
              class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-yellow-500 border border-transparent rounded-full shadow-sm  hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              @click="handleOpenTodoCreation"
            >
              <PlusIcon class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />

              Add a todo
            </button>

            <CheckboxList :items="thingsDone">
              <template #title> Things done </template>
            </CheckboxList>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
