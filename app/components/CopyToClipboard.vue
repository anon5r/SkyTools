<template>
  <div>
    <button @click="copyToClipboard" v-bind="$attrs">
      <slot></slot>
    </button>
    <div
      v-show="showToast"
      :class="[
        'flex items-center fixed z-50 ',
        toastPosition,
        toastTextColor,
        'px-4 py-2 rounded-md shadow-md bg-white dark:bg-gray-800',
      ]">
      <font-awesome-icon
        :icon="[
          'fa',
          success ? 'check-circle' : 'times-circle',
        ]"></font-awesome-icon>
      <span class="ml-2">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      copyText: String,
      successMessage: {
        type: String,
        default: 'Text copied successfully!',
      },
      errorMessage: {
        type: String,
        default: 'Failed to copy text.',
      },
      displayDuration: {
        type: Number,
        default: 3000,
      },
      position: {
        type: String,
        default: 'top-right', // possible values: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
      },
      buttonClass: {
        type: String,
        default:
          'text-blue-500 hover:text-blue-800 dark:text-blue-700 dark:hover:text-blue-300',
      },
    },
    data() {
      return {
        showToast: false,
        toastMessage: '',
        success: true,
      }
    },
    computed: {
      toastPosition() {
        switch (this.position) {
          case 'top-right':
            return 'top-4 right-4'
          case 'top-left':
            return 'top-4 left-4'
          case 'bottom-right':
            return 'bottom-4 right-4'
          case 'bottom-left':
            return 'bottom-4 left-4'
        }
      },
      toastTextColor() {
        return this.success ? 'text-green-600' : 'text-red-600'
      },
    },
    methods: {
      async copyToClipboard() {
        try {
          await navigator.clipboard.writeText(this.copyText)
          this.toastMessage = this.successMessage
          this.success = true
        } catch (err) {
          this.toastMessage = this.errorMessage
          this.success = false
        }
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, this.displayDuration)
      },
    },
  }
</script>
