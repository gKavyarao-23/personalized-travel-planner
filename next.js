import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Loader } from 'lucide-react';
import { saveAs } from 'file-saver';

const PersonalizedTravelPlanner = () => {
  const [destination, setDestination] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [duration, setDuration] = useState(3);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generatePlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, interests, budget, travelDates, duration })
      });
      const data = await response.json();
      setPlan(data.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPlan = () => {
    const blob = new Blob([plan], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'Travel_Plan.txt');
  };

  return (
    <div className='p-4 space-y-4'>
      <motion.h1 className='text-2xl font-bold' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Personalized Travel Planner
      </motion.h1>
      <Input placeholder='Destination' value={destination} onChange={e => setDestination(e.target.value)} />
      <Input placeholder='Interests (e.g., adventure, culture, relaxation)' value={interests} onChange={e => setInterests(e.target.value)} />
      <Input placeholder='Budget (e.g., low, medium, high)' value={budget} onChange={e => setBudget(e.target.value)} />
      <Input placeholder='Travel Dates' value={travelDates} onChange={e => setTravelDates(e.target.value)} />
      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Duration (days)</label>
        <Slider min={1} max={14} step={1} value={[duration]} onValueChange={(val) => setDuration(val[0])} />
        <p>Duration: {duration} days</p>
      </div>
      <Button onClick={generatePlan} disabled={loading}>
        {loading ? <Loader className='animate-spin' /> : 'Generate Travel Plan'}
      </Button>
      {plan && (
        <Card className='mt-4'>
          <CardContent>
            <h2 className='text-xl font-semibold'>Your Travel Plan</h2>
            <p>{plan}</p>
            <Button className='mt-2' onClick={downloadPlan}>Download as TXT</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedTravelPlanner;

// Backend API using Google Gemini API
// Example: Next.js API route (/pages/api/generatePlan.js)
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { destination, interests, budget, travelDates, duration } = req.body;
    try {
      const response = await axios.post('https://gemini.googleapis.com/v1/generate', {
        prompt: `Generate a personalized travel itinerary for ${destination} with interests in ${interests}, considering a ${budget} budget during ${travelDates} for ${duration} days. Include top attractions, dining options, and unique experiences.`
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const generatedPlan = response.data.generated_text;
      res.status(200).json({ plan: generatedPlan });
    } catch (error) {
      res.status(500).json({ message: 'Error generating travel plan', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
