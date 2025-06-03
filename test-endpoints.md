# API Endpoints テスト用URL

デプロイ後、以下のURLでAPIが正常に動作するかテストできます：

## 1. Routes

### getrepocar

```
https://your-project.vercel.app/routes/getrepocar?repo=did:plc:example123
```

## 2. API Functions

### resolver-functions

```
https://your-project.vercel.app/api/resolver-functions?actor=bsky.app
https://your-project.vercel.app/api/resolver-functions?actor=did:plc:z72i7hdynmk6r22z27h6tvur
```

### handle-resolve

```
https://your-project.vercel.app/api/handle-resolve?query=bsky.app
https://your-project.vercel.app/api/handle-resolve?query=did:plc:z72i7hdynmk6r22z27h6tvur
```

### resolver

```
https://your-project.vercel.app/api/resolver?query=bsky.app
https://your-project.vercel.app/api/resolver?query=did:plc:z72i7hdynmk6r22z27h6tvur
```

### resolve-handle

```
https://your-project.vercel.app/api/resolve-handle?handle=bsky.app
```

## テスト用DIDとハンドル

- ハンドル: `bsky.app`
- DID: `did:plc:z72i7hdynmk6r22z27h6tvur`

これらはBlueskyの公式アカウントなので、テストに使用できます。
