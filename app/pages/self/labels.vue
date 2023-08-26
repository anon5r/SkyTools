<template>
  <div
    class="flex flex-col items-center min-h-screen md:pt-30 sm:pt-30 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200 px-4">
    <div class="w-full max-w-3xl">
        <AddLabelForm />
        Ediatable labels
        <LabelList inEdit="true" :labels="labels" />

        <div>Listed labels
          <LabelList :labels="labels" />
        </div>
    </div>
  </div>
</template>

<script setup>
  const useLabels = () => useState('labels', () => [])
  const labels = useLabels()
</script>


