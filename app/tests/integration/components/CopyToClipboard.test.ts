import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyToClipboard from '@/components/CopyToClipboard.vue'

// Mock FontAwesomeIcon component
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<span class="mock-icon"><slot /></span>',
    props: ['icon'],
  },
}))

describe('CopyToClipboard', () => {
  let wrapper: ReturnType<typeof mount<typeof CopyToClipboard>>
  const textToCopy = 'Test text to copy'

  // Mock clipboard API
  const mockClipboard = {
    writeText: vi.fn(() => Promise.resolve()),
  }

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    })

    // Mock setTimeout
    vi.useFakeTimers()

    // Mount component
    wrapper = mount(CopyToClipboard, {
      props: {
        copyText: textToCopy,
        successMessage: 'Custom success message',
        errorMessage: 'Custom error message',
        displayDuration: 2000,
        position: 'bottom-right',
      },
      slots: {
        default: 'Copy Text',
      },
    })
  })

  it('renders correctly with default slot', () => {
    expect(wrapper.text()).toContain('Copy Text')
  })

  it('copies text to clipboard when button is clicked', async () => {
    await wrapper.find('button').trigger('click')

    expect(mockClipboard.writeText).toHaveBeenCalledWith(textToCopy)
    expect(wrapper.vm.showToast).toBe(true)
    expect(wrapper.vm.toastMessage).toBe('Custom success message')
    expect(wrapper.vm.success).toBe(true)
  })

  it('shows success toast after copying', async () => {
    await wrapper.find('button').trigger('click')

    // Check the showToast property directly instead of using isVisible()
    expect(wrapper.vm.showToast).toBe(true)
    expect(wrapper.vm.toastMessage).toBe('Custom success message')

    // Find the toast element by its class and check if it exists
    const toastElement = wrapper.find('div.fixed.z-50')
    expect(toastElement.exists()).toBe(true)
  })

  it('hides toast after display duration', async () => {
    await wrapper.find('button').trigger('click')

    // Fast-forward time
    vi.advanceTimersByTime(2000)

    expect(wrapper.vm.showToast).toBe(false)
  })

  it('shows error toast when clipboard API fails', async () => {
    // Mock clipboard API to reject
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))

    await wrapper.find('button').trigger('click')

    expect(wrapper.vm.showToast).toBe(true)
    expect(wrapper.vm.toastMessage).toBe('Custom error message')
    expect(wrapper.vm.success).toBe(false)
  })

  it('applies correct position class based on position prop', async () => {
    expect(wrapper.vm.toastPosition).toBe('bottom-4 right-4')

    // Change position prop
    await wrapper.setProps({ position: 'top-left' })

    expect(wrapper.vm.toastPosition).toBe('top-4 left-4')
  })
})
