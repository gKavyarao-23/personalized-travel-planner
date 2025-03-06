import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { destination, interests, budget, travelDates, duration } = req.body;

    const client = new GoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    try {
      const prompt = `Generate a personalized travel itinerary for ${destination} with interests in ${interests}, considering a ${budget} budget during ${travelDates} for ${duration} days. Include top attractions, dining options, and unique experiences.`;

      const result = await client.generateText({
        model: 'gemini-1.5-pro',
        prompt,
      });

      const generatedPlan = result.data.candidates[0]?.output || 'No plan generated.';

      res.status(200).json({ plan: generatedPlan });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      res.status(500).json({ message: 'Error generating travel plan', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

