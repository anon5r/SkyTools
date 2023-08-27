<template>
  <div
    class="p-0 flex flex-row justify-between items-center">
    <div class="mr-4 max-w-fit relative">
      <input
        v-model="inputLabel"
        type="text"
        id="label"
        class="
        px-1 text-xs leading-none border-gray-300 hover:text-gray-600 dark:border-gray-600 focus:ring-gray-300 dark:focus:ring-gray-200 border border-dashed hover:border-solid rounded-md
        inline-block w-20 h-6 text-gray-900 dark:text-gray-200 bg-transparent border-1  appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        :class="duplicate ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : ''"
        placeholder=""
        list="definedLabels"
        @keyup.enter="addLabel"/>
        <datalist v-if="definedLabels" id="definedLabels">
          <option v-for="label in definedLabels" :key="label" :value="label"></option>
        </datalist>
      <label
        for="label"
        class="absolute text-xs text-gray-400 dark:text-slate-700 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent peer-focus:bg-gray-100 peer-focus:dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
        {{ props.placeholder }}
      </label>
    </div>
  </div>
</template>

<script setup>
  import { useState } from 'nuxt/app';
  import { ref, defineProps } from 'vue'
  let inputLabel = ref('')
  const useLabels = () => useState('labels', () => { return [] })
  const duplicate = ref(false)

  // Official defined list of defined labels
  const useDefinedLabels = () => useState('definedLabels', () => { return [] })
  const definedLabels = useDefinedLabels()

  const props = defineProps({
    placeholder: {
      type: String,
      default: 'Add label'
    }
  })


  const addLabel =() =>{
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
