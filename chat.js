module.exports = async function handler(req, res) {
  // 1. Safety Check: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userMessage = req.body.message;

    // 2. Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are the AI Assistant for SmileCare Dental. Be helpful and professional."
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    // 3. Handle potential API errors from Groq
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // 4. Send back the reply
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Something went wrong on the server." });
  }
};