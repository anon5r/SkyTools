<template>
  <div class="max-w-fit relative">
    <input
      v-model="inputLabel"
      type="text"
      id="label"
      class="px-1.5 text-xs leading-none border-gray-300 hover:text-gray-600 dark:border-gray-600 focus:ring-gray-300 dark:focus:ring-gray-200 border border-dashed hover:border-solid rounded-md inline-block w-24 h-6 text-gray-900 dark:text-gray-200 bg-transparent border-1 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      :class="
        duplicate
          ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
          : ''
      "
      :placeholder="props.placeholder"
      :aria-label="props.placeholder"
      autocomplete="off"
      list="definedLabels"
      @keyup.enter="addLabel" />
    <datalist v-if="definedLabels" id="definedLabels">
      <option
        v-for="label in definedLabels"
        :key="label"
        :value="label"></option>
    </datalist>
    <button
      v-if="inputLabel.length > 0"
      type="button"
      class="m-0 p-1 text-xs min-w-fit md:invisible sm:visible bg-blue-400 dark:bg-blue-700 hover:bg-blue-500 hover:dark:bg-blue-600 text-white dark:text-slate-200 rounded-md"
      @click.prevent="addLabel">
      Add
    </button>
  </div>
</template>

<script setup>
  import { useState, ref } from '#imports'
  import { defineProps } from 'vue'

  const inputLabel = ref('')
  const useLabels = () =>
    useState('labels', () => {
      return []
    })
  const duplicate = ref(false)

  // Official defined list of defined labels
  const useDefinedLabels = () =>
    useState('definedLabels', () => {
      return []
    })
  const definedLabels = useDefinedLabels()

  const props = defineProps({
    placeholder: {
      type: String,
      default: '+ Add label',
    },
  })

  const addLabel = () => {
    const labels = useLabels()
    const label = inputLabel.value.trim()
    if (label && label.length > 0) {
      if (labels.value.includes(label)) {
        if (isDev()) console.info('label duplicated!: ' + label)
        duplicate.value = true
      } else {
        labels.value.push(label)
        duplicate.value = false
        inputLabel.value = ''
      }
    }
  }
</script>
