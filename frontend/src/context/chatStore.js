import { create } from 'zustand'
import api from '../utils/api'

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  selectedModel: 'gemini-1.5-flash',
  error: null,

  setModel: (model) => set({ selectedModel: model }),

  loadConversations: async () => {
    try {
      const res = await api.get('/api/conversations')
      set({ conversations: res.data })
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  },

  loadConversation: async (id) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/api/conversations/${id}`)
      set({
        activeConversationId: id,
        messages: res.data.messages || [],
        isLoading: false
      })
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load conversation' })
    }
  },

  createConversation: async () => {
    try {
      const model = get().selectedModel
      const res = await api.post('/api/conversations', {
        title: 'New Chat',
        modelName: model
      })
      const newConv = res.data
      set(state => ({
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
        messages: []
      }))
      return newConv.id
    } catch (err) {
      console.error('Failed to create conversation:', err)
      return null
    }
  },

  deleteConversation: async (id) => {
    try {
      await api.delete(`/api/conversations/${id}`)
      set(state => {
        const newConvs = state.conversations.filter(c => c.id !== id)
        const newActiveId = state.activeConversationId === id
          ? (newConvs[0]?.id || null)
          : state.activeConversationId
        return {
          conversations: newConvs,
          activeConversationId: newActiveId,
          messages: state.activeConversationId === id ? [] : state.messages
        }
      })
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  },

  renameConversation: async (id, title) => {
    try {
      await api.patch(`/api/conversations/${id}`, { title })
      set(state => ({
        conversations: state.conversations.map(c =>
          c.id === id ? { ...c, title } : c
        )
      }))
    } catch (err) {
      console.error('Failed to rename:', err)
    }
  },

  sendMessage: async (content, fileData = null) => {
    const { activeConversationId, selectedModel, messages } = get()

    // Add user message optimistically
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      temp: true
    }
    set(state => ({ messages: [...state.messages, userMsg], isTyping: true, error: null }))

    try {
      const payload = {
        message: content,
        conversationId: activeConversationId,
        model: selectedModel,
        ...(fileData && {
          fileContent: fileData.content,
          fileName: fileData.name,
          fileType: fileData.type
        })
      }

      const res = await api.post('/api/chat', payload)
      const { response, conversationId, messageId } = res.data

      // AI response message
      const aiMsg = {
        id: messageId || Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel
      }

      set(state => ({
        messages: [...state.messages.filter(m => !m.temp), aiMsg],
        isTyping: false,
        activeConversationId: conversationId,
      }))

      // Update conversation list
      await get().loadConversations()

      // If new conversation, set active
      if (!activeConversationId) {
        set({ activeConversationId: conversationId })
      }

    } catch (err) {
      set(state => ({
        messages: state.messages.filter(m => !m.temp),
        isTyping: false,
        error: err.response?.data?.error || 'Failed to send message'
      }))
    }
  },

  regenerateMessage: async () => {
    const { messages } = get()
    if (messages.length < 2) return

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMsg) return

    // Remove last AI message
    set(state => ({
      messages: state.messages.slice(0, -1)
    }))

    await get().sendMessage(lastUserMsg.content)
  },

  deleteMessage: (id) => {
    set(state => ({ messages: state.messages.filter(m => m.id !== id) }))
  },

  clearError: () => set({ error: null }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  clearMessages: () => set({ messages: [], activeConversationId: null }),
}))

export default useChatStore
