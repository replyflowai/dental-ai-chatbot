module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const systemPrompt = `You are a friendly and professional AI assistant for SmileCare Dental Clinic.

Your job is to help patients with:
- Booking and rescheduling appointments
- Information about dental treatments
- Clinic hours
- Pricing information
- Location and contact details

Rules:
- Always be warm and professional
- Keep responses short and clear
- Never give medical diagnoses`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();

    console.log(data);

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: 'No reply from Groq' });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Failed to get response'
    });
  }
}