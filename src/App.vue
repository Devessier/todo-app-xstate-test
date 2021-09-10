<script lang="ts" setup>
import { computed } from "vue";
import { PlusIcon } from "@heroicons/vue/solid";
import { createModel } from "xstate/lib/model";
import { useMachine } from "@xstate/vue";

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

function handleAddTodoButtonClick() {
  send({
    type: "CREATE_TODO",
  });
}
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
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
            <fieldset class="">
              <legend class="text-lg font-medium leading-6 text-gray-900">
                Things to do
              </legend>

              <div class="mt-4 space-y-2">
                <div
                  v-for="{ id, label, checked } in thingsToDo"
                  :key="label"
                  class="relative flex items-start"
                >
                  <div class="flex items-center h-5">
                    <input
                      :value="checked"
                      :aria-describedby="`todo-${id}-description`"
                      :name="`todo-${id}`"
                      type="checkbox"
                      class="w-4 h-4 text-yellow-600 border-gray-300 rounded  focus:ring-yellow-500"
                    />
                  </div>

                  <div class="ml-3 text-sm">
                    <span
                      :id="`todo-${id}-description`"
                      class="font-medium text-gray-700"
                    >
                      {{ label }}
                    </span>
                  </div>
                </div>
              </div>
            </fieldset>

            <div>
              <p v-if="showTodoCreationForm">LOL</p>

              <button
                v-else
                type="button"
                class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-yellow-500 border border-transparent rounded-full shadow-sm  hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                @click="handleAddTodoButtonClick"
              >
                <PlusIcon class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />

                Add a todo
              </button>
            </div>

            <fieldset class="">
              <legend class="text-lg font-medium leading-6 text-gray-900">
                Things done
              </legend>

              <div class="mt-4 space-y-2">
                <div
                  v-for="{ id, label, checked } in thingsDone"
                  :key="label"
                  class="relative flex items-start"
                >
                  <div class="flex items-center h-5">
                    <input
                      :checked="checked"
                      :aria-describedby="`todo-${id}-description`"
                      :name="`todo-${id}`"
                      type="checkbox"
                      class="w-4 h-4 text-yellow-600 border-gray-300 rounded  focus:ring-yellow-500"
                    />
                  </div>

                  <div class="ml-3 text-sm">
                    <span
                      :id="`todo-${id}-description`"
                      class="font-medium text-gray-700"
                    >
                      {{ label }}
                    </span>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
