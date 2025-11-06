import { create } from 'zustand'

const useChatStore = create(set => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  totalCost: 0,
  totalTokens: 0,

  toggleChat: () => set(state => ({ isOpen: !state.isOpen })),

  openChat: () => set({ isOpen: true }),

  closeChat: () => set({ isOpen: false }),

  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),

  setLoading: isLoading => set({ isLoading }),

  updateCost: cost =>
    set(state => ({
      totalCost: state.totalCost + cost,
    })),

  updateTokens: tokens =>
    set(state => ({
      totalTokens: state.totalTokens + tokens,
    })),

  clearMessages: () =>
    set({
      messages: [],
      totalCost: 0,
      totalTokens: 0,
    }),
}))

export default useChatStore
