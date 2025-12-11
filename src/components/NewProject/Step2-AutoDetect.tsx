'use client';

import { Card } from '@/components/ui/card';

interface AutoDetectData {
  url: string;
  industry: string;
  cities: string[];
  competitors: string[];
}

interface Step2Props {
  data: AutoDetectData;
}

export default function Step2AutoDetect({ data }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Steg 2: Automatisk analys</h2>
        <p className="text-gray-400">Vi har analyserat din hemsida</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="text-sm text-gray-400 mb-2">Bransch</div>
          <div className="text-xl font-bold">{data.industry}</div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="text-sm text-gray-400 mb-2">Hemsida</div>
          <div className="text-lg font-mono truncate">{data.url}</div>
        </Card>
      </div>

      <div>
        <h3 className="font-bold mb-3">Städer vi hittat</h3>
        <div className="flex flex-wrap gap-2">
          {data.cities.map((city) => (
            <div
              key={city}
              className="bg-blue-600 bg-opacity-20 text-blue-300 px-3 py-1 rounded-full text-sm"
            >
              {city}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Topkoncurrenter</h3>
        <div className="space-y-2">
          {data.competitors.map((competitor, i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 p-3 rounded"
            >
              {competitor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

