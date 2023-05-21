<template>    
    <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
            <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
                Enter your identifier and passwords
            </div>
            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required>
            </div> 
            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password (Enter YOUR APP PASSWORD, No use real password)</label>
                <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required>
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
