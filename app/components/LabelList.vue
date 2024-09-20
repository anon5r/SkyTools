<template>
  <ul v-if="labels" class="flex flex-row flex-wrap">
    <li
      v-for="(label, index) in labels"
      :key="index"
      :id="`label-dismiss-${index}`"
      class="inline-flex items-center px-2 py-1 mr-2 my-1 text-xs font-light rounded select-all"
      :class="
        definedLabels.includes(label)
          ? // ? 'text-pink-800 bg-pink-100 dark:bg-pink-900 dark:text-pink-300'
            // : 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
            'text-pink-800 bg-pink-100 dark:bg-pink-900 dark:text-pink-300'
          : 'text-gray-800 bg-gray-300 dark:text-gray-200 dark:bg-slate-700'
      ">
      <ClientOnly>
        <FontAwesomeIcon :icon="['fas', 'tag']" class="mr-1" size="sm" />
      </ClientOnly>
      {{ label }}
      <button
        v-if="props.inEdit"
        type="button"
        class="inline-flex items-center p-0.5 ml-1 text-sm rounded-sm text-inherit bg-inherit border"
        :class="
          definedLabels.includes(label)
            ? ' border-pink-900 dark:border-pink-800 hover:bg-pink-300 hover:dark:bg-pink-700'
            : ' border-gray-400 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500'
        "
        :data-dismiss-target="
          definedLabels.includes(label)
            ? '#badge-dismiss-pink'
            : '#badge-dismiss-dark'
        "
        aria-label="Remove"
        @click="removeLabel(label)">
        <svg
          class="w-2 h-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span class="sr-only">Remove label</span>
      </button>
    </li>
    <li v-if="props.inEdit" class="mr-4 inline-flex items-center my-1">
      <!-- add new label field -->
      <AddLabelSimple />
    </li>
  </ul>
</template>

<script setup>
  import { onMounted, useState } from '#imports'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const props = defineProps({
    labels: {
      type: Array,
      default: () => [],
    },
    inEdit: {
      type: Boolean,
      default: false,
    },
  })

  const useLabels = () => useState('labels', () => props.labels ?? [])
  const labels = useLabels()

  // Official defined list of defined labels
  const useDefinedLabels = () => useState('definedLabels', () => [])
  const definedLabels = useDefinedLabels()

  onMounted(async () => {
    try {
      const res = await fetch('/labels.json', { method: 'get' })
      if (res.ok) {
        const data = await res.json()
        definedLabels.value = data.defined
      }
    } catch (err) {
      console.log(err)
    }
  })

  const removeLabel = text => {
    if (labels.value.findIndex(label => label === text) !== -1) {
      labels.value.splice(
        labels.value.findIndex(label => label === text),
        1
      )
    }
  }
</script>
