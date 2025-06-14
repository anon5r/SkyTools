import { beforeEach, describe, expect, it } from 'vitest'
import {
  formatIdentifier,
  getConfig,
  parseAtUri,
  parseDID,
  setConfig,
} from '@/utils/bskyutils'

describe('bskyutils', () => {
  beforeEach(() => {
    // Reset the config before each test
    setConfig({
      defaultPDS: 'bsky.social',
      defaultSuffix: 'bsky.social',
      defaultPDSEntrypoint: 'https://bsky.social',
      bskyAppURL: 'https://bsky.app',
      webmasterDid: 'did:bsky:webmaster',
    })
  })

  describe('formatIdentifier', () => {
    it('should return empty string if input is empty', () => {
      expect(formatIdentifier('')).toBe('')
    })

    it('should remove at:// prefix', () => {
      expect(formatIdentifier('at://user.bsky.social')).toBe('user.bsky.social')
    })

    it('should remove @ prefix', () => {
      expect(formatIdentifier('@user.bsky.social')).toBe('user.bsky.social')
    })

    it('should not modify DIDs', () => {
      expect(formatIdentifier('did:plc:abcdef')).toBe('did:plc:abcdef')
    })

    it('should add default suffix if not present', () => {
      expect(formatIdentifier('user')).toBe('user.bsky.social')
    })

    it('should not add default suffix if already has a domain', () => {
      expect(formatIdentifier('user.example.com')).toBe('user.example.com')
    })
  })

  describe('parseDID', () => {
    it('should parse a valid DID', () => {
      const result = parseDID('did:plc:abcdef123456')
      expect(result).toEqual({
        method: 'plc',
        identifier: 'abcdef123456',
      })
    })

    it('should parse a web DID', () => {
      const result = parseDID('did:web:example.com')
      expect(result).toEqual({
        method: 'web',
        identifier: 'example.com',
      })
    })

    it('should throw an error for invalid DID format', () => {
      expect(() => parseDID('invalid-did')).toThrow('Invalid DID format')
    })
  })

  describe('parseAtUri', () => {
    it('should parse a valid at URI', () => {
      const result = parseAtUri('at://did:plc:abcdef/app.bsky.feed.post/12345')
      expect(result).toEqual({
        actor: 'did:plc:abcdef',
        collection: 'app.bsky.feed.post',
        rkey: '12345',
      })
    })
  })

  describe('getConfig', () => {
    it('should return the default config', () => {
      const config = getConfig()
      expect(config).toEqual({
        defaultPDS: 'bsky.social',
        defaultSuffix: 'bsky.social',
        defaultPDSEntrypoint: 'https://bsky.social',
        bskyAppURL: 'https://bsky.app',
        webmasterDid: 'did:bsky:webmaster',
      })
    })

    it('should return updated config after setConfig', () => {
      setConfig({
        defaultPDS: 'test.social',
        defaultSuffix: 'test.social',
        defaultPDSEntrypoint: 'https://test.social',
        bskyAppURL: 'https://test.app',
        webmasterDid: 'did:test:webmaster',
      })

      const config = getConfig()
      expect(config).toEqual({
        defaultPDS: 'test.social',
        defaultSuffix: 'test.social',
        defaultPDSEntrypoint: 'https://test.social',
        bskyAppURL: 'https://test.app',
        webmasterDid: 'did:test:webmaster',
      })
    })
  })
})
