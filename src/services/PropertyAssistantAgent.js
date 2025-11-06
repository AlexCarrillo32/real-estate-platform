import Groq from 'groq-sdk'

// Pricing for Groq API (LLaMA models - FREE tier available)
const PRICING = {
  'llama-3.1-70b-versatile': {
    inputCost: 0.00000059, // per token
    outputCost: 0.00000079, // per token
  },
}

export class PropertyAssistantAgent {
  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY

    if (!apiKey) {
      console.warn('GROQ_API_KEY not found - AI features will be disabled')
      this.client = null
      return
    }

    this.client = new Groq({ apiKey, dangerouslyAllowBrowser: true })
    this.model = 'llama-3.1-70b-versatile'
    this.conversationHistory = []
  }

  // Calculate cost for a conversation
  calculateCost(promptTokens, completionTokens) {
    const pricing = PRICING[this.model]
    const inputCost = promptTokens * pricing.inputCost
    const outputCost = completionTokens * pricing.outputCost
    return inputCost + outputCost
  }

  // Parse natural language to property search filters
  async parseSearchQuery(userMessage) {
    if (!this.client) {
      return { error: 'AI service not configured' }
    }

    const systemPrompt = `You are a real estate search assistant. Extract property search criteria from user messages.
Return a JSON object with these fields (only include fields mentioned by user):
{
  "priceMin": number,
  "priceMax": number,
  "bedrooms": number,
  "bathrooms": number,
  "propertyType": "house" | "condo" | "apartment" | "townhouse",
  "location": string,
  "sqftMin": number,
  "sqftMax": number
}

Examples:
User: "3 bedroom house under 500k in Austin"
Response: {"bedrooms": 3, "priceMax": 500000, "propertyType": "house", "location": "Austin"}

User: "apartments near downtown with 2 baths"
Response: {"bathrooms": 2, "propertyType": "apartment", "location": "downtown"}

Only respond with valid JSON, no other text.`

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      const content = response.choices[0]?.message?.content
      const usage = response.usage

      // Calculate cost
      const cost = this.calculateCost(
        usage.prompt_tokens,
        usage.completion_tokens
      )

      // Parse JSON response
      const filters = JSON.parse(content)

      return {
        filters,
        cost,
        tokens: usage.total_tokens,
      }
    } catch (error) {
      console.error('Error parsing search query:', error)
      return { error: error.message }
    }
  }

  // Answer questions about a specific property
  async answerPropertyQuestion(property, question) {
    if (!this.client) {
      return { error: 'AI service not configured' }
    }

    const propertyContext = `Property Details:
- Address: ${property.address}
- Price: $${property.price.toLocaleString()}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Square Feet: ${property.sqft}
- Property Type: ${property.propertyType}
- Description: ${property.description || 'N/A'}`

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful real estate assistant. Answer questions about properties clearly and concisely.',
          },
          { role: 'user', content: propertyContext },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 300,
      })

      const answer = response.choices[0]?.message?.content
      const usage = response.usage
      const cost = this.calculateCost(
        usage.prompt_tokens,
        usage.completion_tokens
      )

      return {
        answer,
        cost,
        tokens: usage.total_tokens,
      }
    } catch (error) {
      console.error('Error answering question:', error)
      return { error: error.message }
    }
  }

  // General chat conversation
  async chat(userMessage, conversationId = null) {
    if (!this.client) {
      return {
        response: 'AI chat is currently unavailable. Please try again later.',
        error: 'AI service not configured',
      }
    }

    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: userMessage })

    const systemPrompt = `You are a friendly real estate assistant helping users find properties.
You can:
- Help search for properties
- Answer questions about real estate
- Provide neighborhood information
- Explain mortgage and financing options
- Schedule property viewings

Be helpful, concise, and professional.`

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const assistantMessage = response.choices[0]?.message?.content
      const usage = response.usage
      const cost = this.calculateCost(
        usage.prompt_tokens,
        usage.completion_tokens
      )

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      })

      return {
        response: assistantMessage,
        cost,
        tokens: usage.total_tokens,
        conversationId,
      }
    } catch (error) {
      console.error('Error in chat:', error)
      return {
        response: 'Sorry, I encountered an error. Please try again.',
        error: error.message,
      }
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = []
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory
  }
}

// Export singleton instance
export const propertyAssistant = new PropertyAssistantAgent()
