<script lang="ts" setup>
const props = defineProps<{
  items: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  onCheckboxChange: (id: string, checked: boolean) => void;
}>();

function handleCheckboxChangeEvent(id: string, event: Event) {
  const target = event.target;
  if (target === null) {
    return;
  }
  const inputTarget = target as HTMLInputElement;

  props.onCheckboxChange(id, inputTarget.checked);
}
</script>

<template>
  <fieldset>
    <legend class="text-lg font-medium leading-6 text-gray-900">
      <slot name="title" />
    </legend>

    <ul class="mt-4 space-y-2">
      <li
        v-for="{ id, label, checked } in props.items"
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
            @change="handleCheckboxChangeEvent(id, $event)"
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
      </li>
    </ul>
  </fieldset>
</template>
