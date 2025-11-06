import { useState, useRef, useEffect } from 'react'
import useChatStore from '../../store/useChatStore'
import { propertyAssistant } from '../../services/PropertyAssistantAgent'

function ChatWidget() {
  const {
    messages,
    isOpen,
    isLoading,
    totalCost,
    toggleChat,
    addMessage,
    setLoading,
    updateCost,
    updateTokens,
    clearMessages,
  } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const result = await propertyAssistant.chat(input)

      if (result.error) {
        addMessage({
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
          isError: true,
        })
      } else {
        addMessage({
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
          cost: result.cost,
          tokens: result.tokens,
        })

        if (result.cost) updateCost(result.cost)
        if (result.tokens) updateTokens(result.tokens)
      }
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      })
    }

    setLoading(false)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 flex items-center justify-center text-2xl z-50"
        aria-label="Open chat"
      >
        💬
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Property Assistant</h3>
          <p className="text-xs opacity-90">Ask me anything!</p>
        </div>
        <button
          onClick={toggleChat}
          className="text-white hover:bg-primary-700 rounded p-1"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">👋 Hi there!</p>
            <p className="text-sm">
              I can help you find properties, answer questions, and more.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : msg.isError
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.cost && (
                <p className="text-xs opacity-70 mt-1">
                  Cost: ${msg.cost.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer with stats */}
      {totalCost > 0 && (
        <div className="px-4 py-1 bg-gray-50 text-xs text-gray-600 flex justify-between border-t">
          <span>Total Cost: ${totalCost.toFixed(6)}</span>
          <button
            onClick={clearMessages}
            className="text-primary-600 hover:text-primary-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWidget
