module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userMessage = req.body.message;

    // FIX: This must be the GROQ URL, not OpenAI!
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Stable Groq model
        messages: [
          {
            role: "system",
            content: "You are the AI Assistant for SmileCare Dental. Help users with appointments and pricing."
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    // If Groq returns an error, pass it through so we can see it
    if (data.error) {
      console.error("Groq Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const botReply = data.choices[0].message.content;
    return res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Server crashed: " + error.message });
  }
};