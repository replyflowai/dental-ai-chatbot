module.exports = async function handler(req, res) {
  try {
    // 1. Get the user's message from the frontend request
    const userMessage = req.body.message || "Hello"; 

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are the AI Assistant for SmileCare Dental. Your goal is to answer questions about dentistry and help users book appointments."
          },
          {
            role: "user",
            content: userMessage, // Using the real message from your chatbox!
          },
        ],
      }),
    });

    const data = await response.json();

    // 2. Check for Groq errors (like an invalid API key)
    if (data.error) {
      console.error("GROQ API ERROR:", data.error);
      return res.status(400).json({ reply: "API Error: " + data.error.message });
    }

    // 3. Send ONLY the text back to your script.js 'data.reply'
    const botReply = data.choices[0].message.content;
    return res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};