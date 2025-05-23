import { createApp, toWebHandler } from 'h3'
import resolveHandle from './api/resolve-handle'
import handleResolve from './api/handle-resolve'
import resolver from './api/resolver'
import getrepocar from './routes/getrepocar'

// Create a new h3 app
const app = createApp()

// Register API routes
app.use('/resolve-handle', resolveHandle)
app.use('/handle-resolve', handleResolve)
app.use('/resolver', resolver)
app.use('/getrepocar', getrepocar)

// Cloudflare Workers用のハンドラを作成
const handler = toWebHandler(app)

// Cloudflare Workers向けのエクスポート
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    return handler(request)
  },
}
