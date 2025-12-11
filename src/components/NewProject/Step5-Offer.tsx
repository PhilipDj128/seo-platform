'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface OfferData {
  domain: string;
  industry: string;
  cities: string[];
  keywords: string[];
  package: string;
  estimatedPages: number;
  estimatedLinks: number;
  estimatedMonths: number;
}

interface Step5Props {
  data: OfferData;
  onSubmit: (email: string, phone: string, message: string) => Promise<void>;
}

const PACKAGE_PRICES: Record<string, number> = {
  bas: 1995,
  pro: 3995,
  elite: 6995,
  empire: 12000
};

export default function Step5Offer({ data, onSubmit }: Step5Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email || !phone) {
      alert('Fyll i email och telefon');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, phone, message);
      setSuccess(true);
    } catch (error) {
      console.error('❌ Step5 Offer error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Fel vid skickning av offert';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center py-12">
        <div className="text-5xl">✅</div>
        <h2 className="text-3xl font-bold">Tack!</h2>
        <p className="text-gray-400">Vi har mottagit din förfrågan.</p>
        <p className="text-gray-400">Vi kontaktar dig snart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Steg 5: Din offert</h2>
        <p className="text-gray-400">Granska din offert innan du skickar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="text-sm text-gray-400">Hemsida</div>
          <div className="font-mono text-sm truncate">{data.domain}</div>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="text-sm text-gray-400">Bransch</div>
          <div className="font-bold">{data.industry}</div>
        </Card>
      </div>

      <div>
        <h3 className="font-bold mb-2">Städer</h3>
        <div className="flex flex-wrap gap-2">
          {data.cities.map((city) => (
            <div
              key={city}
              className="bg-blue-600 bg-opacity-20 px-3 py-1 rounded text-sm"
            >
              {city}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600 bg-opacity-10 border border-blue-600 border-opacity-30 p-4 rounded space-y-2">
        <div className="flex justify-between">
          <span>Nya sidor</span>
          <span className="font-bold">{data.estimatedPages}</span>
        </div>
        <div className="flex justify-between">
          <span>Backlinks</span>
          <span className="font-bold">{data.estimatedLinks}</span>
        </div>
        <div className="flex justify-between">
          <span>Tidsestimat</span>
          <span className="font-bold">{data.estimatedMonths} månader</span>
        </div>
        <div className="pt-3 border-t border-blue-600 border-opacity-30 flex justify-between">
          <span>Ungefärligt pris</span>
          <span className="font-bold">
            {PACKAGE_PRICES[data.package]?.toLocaleString()} kr/mån
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Din email</label>
          <Input
            type="email"
            placeholder="din@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefon</label>
          <Input
            type="tel"
            placeholder="+46 70 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meddelande (valfritt)</label>
          <textarea
            placeholder="Berätta mer om dina mål..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold"
        >
          {loading ? 'Skickar...' : 'Skicka offert'}
        </Button>
      </div>
    </div>
  );
}

