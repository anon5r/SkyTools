<template>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div class="w-full max-w-md">
<!-- 
        <div class="bg-white shadow-md rounded-lg px-3 py-2 border-2" v-if="results.length > 0" :class="{'border-red-600': hasError, 'border-green-500': !hasError}">
          <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
            Handle history
          </div>
          <div class="py-2 px-2" :class="{'text-red-600 dark:text-red-400': hasError, 'text-gray-600 dark:text-gray-400': !hasError}">
            <div v-if="hasError">{{ results }}</div>
            <ul v-else class="relative border-l border-gray-200 dark:border-gray-700">
              <li v-for="record in results" :key="record.id" class="mb-4 ml-3">
                <font-awesome-icon :icon="record.icon" :style="record.iconStyle" class="absolute w-3 h-3 mt-1.5 -left-1.5" />
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{ record.createdAt }}</time>
                <p class="mb-4 text-base font-normal">{{ record.handle }}</p>
            </li>
            </ul>
          </div>
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div> -->
      </div>
    </div>
</template>


<script>
  import { defineComponent } from '@vue/composition-api'
  import { BskyAgent } from '@atproto/api'

  export default defineComponent({
    setup() {
        
    },

  })
</script>
