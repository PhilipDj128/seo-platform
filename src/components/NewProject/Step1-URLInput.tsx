'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Step1Props {
  onNext: (url: string) => void;
}

export default function Step1URLInput({ onNext }: Step1Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      setError('Ange en hemsida URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL måste börja med http:// eller https://');
      return;
    }

    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    onNext(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Steg 1: Din hemsida</h2>
        <p className="text-gray-400">Ange URL för hemsidan vi ska optimera</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hemsidans URL</label>
          <Input
            placeholder="https://example.se"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            disabled={loading}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Analyserar...' : 'Analysera hemsida'}
        </Button>
      </div>
    </div>
  );
}

