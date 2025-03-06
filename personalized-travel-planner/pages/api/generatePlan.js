import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { destination, interests, budget, travelDates, duration } = req.body;
    try {
      const response = await axios.post(
        'https://gemini.googleapis.com/v1/generate',
        {
          prompt: `Generate a personalized travel itinerary for ${destination} with interests in ${interests}, considering a ${budget} budget during ${travelDates} for ${duration} days. Include top attractions, dining options, and unique experiences.`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedPlan = response.data.generated_text;
      res.status(200).json({ plan: generatedPlan });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      res.status(500).json({ message: 'Error generating travel plan', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
