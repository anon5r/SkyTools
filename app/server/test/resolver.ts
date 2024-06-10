import { DidResolver, HandleResolver } from '@atproto/identity'

// テスト用の関数
async function testDidResolver(actor: string) {
  try {
    const resolver = new DidResolver({})
    const handle = await resolver.resolve(actor)
    console.log('Resolved handle:', handle)
  } catch (error) {
    console.error('Error resolving DID:', error)
  }
}

async function testHandleResolver(actor: string) {
  try {
    const resolver = new HandleResolver({})
    const did = await resolver.resolve(actor)
    console.log('Resolved DID:', did)
  } catch (error) {
    console.error('Error resolving handle:', error)
  }
}

// テストの実行
const actor = 'anon5r.com' // テストするアクターを指定
if (actor.startsWith('did:')) {
  testDidResolver(actor)
} else {
  testHandleResolver(actor)
}
