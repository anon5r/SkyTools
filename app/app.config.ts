export default defineAppConfig({
  pages: true,
  productionTip: false,
  title: 'SkyTools' as string,
  defaultSuffix: process.env.DEFAULT_PDS_SUFFIX || ('bsky.social' as string),
  defaultPDS: process.env.PDS_DEFAULT || ('bsky.social' as string),
  defaultPDSEntrypoint:
    process.env.DEFAULT_PDS_ENDPOINT || ('https://bsky.social' as string),
  bskyAppURL: process.env.DEFAULT_APP_URL || ('https://bsky.app' as string),
  webmasterDid:
    process.env.WEBMASTER_DID || ('did:plc:c22jdrqhoajyj5ca7e56a3ke' as string),
  inviteCodeFreq:
    (() => {
      if (!process.env.INVITE_CODE_FREQ) return { weeks: 2 }
      try {
        return JSON.parse(process.env.INVITE_CODE_FREQ)
      } catch (e) {
        console.error("Error parsing INVITE_CODE_FREQ:", e)
        return { weeks: 2 }
      }
    })(),
  cdnPrefix: process.env.CDN_PREFIX || 'https://cdn-skytools.anon5r.com/proxy',
  prodURLPrefix: process.env.OGP_PREFIX || 'https://skytools.anon5r.com',
})
