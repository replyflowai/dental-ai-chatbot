const messagesContainer = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;
  div.innerHTML = `<div class="bubble">${text}</div>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  sendBtn.disabled = true;

  const typingDiv = addMessage('Assistant is typing...', 'bot');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }) // Must match 'req.body.message' in backend
    });

    const data = await response.json();
    typingDiv.remove();

    if (data.reply) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('Sorry, I am having trouble. Please try again.', 'bot');
    }
  } catch (error) {
    typingDiv.remove();
    addMessage('Connection error. Please try again.', 'bot');
  }

  sendBtn.disabled = false;
  userInput.focus();
}

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});