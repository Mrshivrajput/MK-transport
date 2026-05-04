// AI Chat Widget JavaScript
(function() {
    // Configuration - Change these to connect to your preferred AI
    const AI_CONFIG = {
        // Options: 'ollama', 'custom'
        provider: 'ollama',
        
        // For Ollama (local AI) - Download from https://ollama.ai
        ollama: {
            endpoint: 'http://localhost:11434/api/generate',
            model: 'llama3' // or 'mistral', 'phi3', etc.
        },
        
        // For custom API endpoint
        custom: {
            endpoint: '',
            apiKey: ''
        },
        
        // Fallback responses when AI is unavailable
        fallbackResponses: [
            "I'd be happy to help you with MK Transports! You can book a truck by clicking the 'Book Truck' button on our homepage.",
            "For truck booking inquiries, call us at 9643943256. Our team is available 24/7.",
            "We provide transport services across Delhi, UP, Haryana, and Rajasthan. What would you like to know more about?",
            "MK Transports offers reliable cargo services with verified drivers. Would you like to know about our booking process?",
            "You can become a partner driver by registering through our Driver Panel. Visit the driver login page to get started."
        ]
    };

    // Create the chat widget HTML
    function createChatWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <div class="ai-chat-container" id="aiChatContainer">
                <div class="ai-chat-header">
                    <div>
                        <h3><i class="fas fa-robot"></i> AI Assistant</h3>
                        <span class="ai-chat-status">Online • Free to use</span>
                    </div>
                    <button class="ai-chat-minimize" onclick="toggleAIChat()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">−</button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message bot">
                        <i class="fas fa-robot"></i> Hi! I'm your AI assistant for MK Transports. 
                        <br><br>Ask me about:
                        <br>• Truck booking
                        <br>• Transport services
                        <br>• Driver partnership
                        <br>• Pricing & routes
                    </div>
                </div>
                <div class="ai-chat-input-area">
                    <input type="text" id="aiChatInput" placeholder="Type your message..." onkeypress="handleAIChatKey(event)">
                    <button id="aiChatSend" onclick="sendAIChatMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="ai-chat-toggle" onclick="toggleAIChat()">
                <i class="fas fa-comments chat-icon"></i>
                <i class="fas fa-times close-icon"></i>
            </button>
        `;
        document.body.appendChild(widget);
    }

    // Toggle chat window
    window.toggleAIChat = function() {
        const container = document.getElementById('aiChatContainer');
        const toggle = document.querySelector('.ai-chat-toggle');
        const chatIcon = toggle.querySelector('.chat-icon');
        const closeIcon = toggle.querySelector('.close-icon');
        
        if (container.classList.contains('active')) {
            container.classList.remove('active');
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        } else {
            container.classList.add('active');
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    };

    // Handle Enter key
    window.handleAIChatKey = function(event) {
        if (event.key === 'Enter') {
            sendAIChatMessage();
        }
    };

    // Send message
    window.sendAIChatMessage = async function() {
        const input = document.getElementById('aiChatInput');
        const messages = document.getElementById('aiChatMessages');
        const sendBtn = document.getElementById('aiChatSend');
        
        const userMessage = input.value.trim();
        if (!userMessage) return;

        // Add user message
        addMessage(userMessage, 'user');
        input.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;

        try {
            // Try to get AI response
            const response = await getAIResponse(userMessage);
            removeTypingIndicator();
            addMessage(response, 'bot');
        } catch (error) {
            console.log('AI unavailable, using fallback');
            removeTypingIndicator();
            const fallback = getFallbackResponse();
            addMessage(fallback, 'bot');
        }
    };

    // Get AI response from Ollama
    async function getAIResponse(message) {
        if (AI_CONFIG.provider === 'ollama') {
            const response = await fetch(AI_CONFIG.ollama.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: AI_CONFIG.ollama.model,
                    prompt: `You are a helpful AI assistant for MK Transports, a truck booking company in India. 
Answer questions about truck booking, transport services, driver partnerships, pricing, and routes.
Keep responses brief and helpful. Current question: ${message}`,
                    stream: false
                })
            });
            
            if (!response.ok) throw new Error('AI unavailable');
            
            const data = await response.json();
            return data.response;
        }
        
        throw new Error('No provider configured');
    }

    // Fallback responses
    function getFallbackResponse() {
        const responses = AI_CONFIG.fallbackResponses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messages = document.getElementById('aiChatMessages');
        const div = document.createElement('div');
        div.className = `ai-message ${sender}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatWidget);
    } else {
        createChatWidget();
    }
})();