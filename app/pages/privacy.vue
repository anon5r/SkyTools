<template>
  <div
    class="flex flex-col px-4 justify-center items-center min-h-screen md:min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200">
    <div class="w-full max-w-md md:pt-4 pb-4 text-right">
      Effective Date: 2024-04-24
    </div>
    <div class="w-full max-w-md min-h-max">
      <h1 class="text-3xl font-semibold mb-4">Privacy Policy</h1>
      <p class="mb-6">

        SkyTools ("we," "us," or "our") is committed to protecting the privacy of our website visitors and users. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of information that we receive through our website.
      </p>
      <h2 class="text-xl font-semibold mb-4">1. Information Collection</h2>
      <p class="mb-6">
        We use Google Analytics and Cloudflare Analytics to collect and analyze information about the behaviors of visitors to our website. This helps us understand user interactions, improve our website, and deliver a better user experience.
      </p>
      <h2 class="text-xl font-semibold mb-4">2. Types of Data Collected</h2>
      <p class="mb-6">
        The data collected by Google Analytics and Cloudflare Analytics includes, but is not limited to:
        <ul>
          <li>IP address (anonymized)</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Referring URLs</li>
          <li>Pages visited and the order of those pages</li>
          <li>Time spent on pages</li>
        </ul>

        All data collected through Google Analytics and Cloudflare Analytics is anonymized before it is stored. We do not collect any personal information (e.g., names, addresses, email addresses) through these analytics tools.
      </p>
      <h2 class="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
      <p class="mb-6">
        The information we collect is used solely for analytical purposes to:

        <ul class="list-disc">
          <li>Analyze trends and traffic patterns</li>
          <li>Improve website functionality and content</li>
          <li>Understand the effectiveness of our marketing campaigns</li>
        </ul>
      </p>
      <h2 class="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
      <p class="mb-6">
        We do not share or disclose any information collected through Google Analytics and Cloudflare Analytics with third parties except as necessary to meet legal requirements or enforce our policies.
      </p>
      <h2 class="text-xl font-semibold mb-4">5. Data Protection</h2>
      <p class="mb-6">
        We implement a variety of security measures to maintain the safety of your anonymized data. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
      </p>
      <h2 class="text-xl font-semibold mb-4">6. Your Choices and Rights</h2>
      <p class="mb-6">
        You have the right to opt out of data collection by Google Analytics and Cloudflare Analytics. To opt out of Google Analytics, you can install the <a href="https://tools.google.com/dlpage/gaoptout" class="text-blue-500 underline">Google Analytics Opt-out Browser Add-on</a>. For more information on how to opt out of Cloudflare Analytics, please visit <a href="https://www.cloudflare.com/privacypolicy/" class="text-blue-500 underline">Cloudflare privacy policy</a>.
      </p>
      <h2 class="text-xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
      <p class="mb-6">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>
      <h2 class="text-xl font-semibold mb-4">8. Contact Us</h2>
      <p class="mb-6">
        If you have any questions about this Privacy Policy, please contact us at privacy+skytools@anon5r.com.
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
  import { useAppConfig, useSeoMeta, onMounted, ref } from "#imports"
  const config = useAppConfig()
  onMounted(async () => {
    useSeoMeta({
      title: `Privacy Policy | ${config.title}`,
      ogTitle: `Privacy Policy | ${config.title}`,
      ogImage: `${config.prodURLPrefix}/images/ogp/default.png`,
      twitterCard: "summary",
    })
  })
</script>
