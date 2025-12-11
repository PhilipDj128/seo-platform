'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  competition: 'Low' | 'Medium' | 'High';
  ranking_potential: number;
  time_estimate: number;
}

interface Step3Props {
  keywords: Keyword[];
  onSelect: (selected: string[]) => void;
}

export default function Step3Keywords({ keywords, onSelect }: Step3Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    setSelected(newSelected);
    onSelect(newSelected);
  };

  const competitionColor = (comp: string) => {
    if (comp === 'Low') return 'text-green-400';
    if (comp === 'Medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Steg 3: Välj sökord</h2>
        <p className="text-gray-400">Vi rekommenderar dessa 5 starkaste sökord</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-2">Välj</th>
              <th className="text-left py-3 px-2">Sökord</th>
              <th className="text-left py-3 px-2">Volym</th>
              <th className="text-left py-3 px-2">Konkurrens</th>
              <th className="text-left py-3 px-2">Potential</th>
              <th className="text-left py-3 px-2">Tid (mån)</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, i) => (
              <tr
                key={kw.id}
                className="border-b border-slate-700 hover:bg-slate-800 transition"
              >
                <td className="py-3 px-2">
                  <Checkbox
                    checked={selected.includes(kw.id)}
                    onCheckedChange={() => handleToggle(kw.id)}
                  />
                </td>
                <td className="py-3 px-2 font-medium">{kw.keyword}</td>
                <td className="py-3 px-2">{kw.volume.toLocaleString()}</td>
                <td className={`py-3 px-2 font-bold ${competitionColor(kw.competition)}`}>
                  {kw.competition}
                </td>
                <td className="py-3 px-2">{kw.ranking_potential}%</td>
                <td className="py-3 px-2">{kw.time_estimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-600 bg-opacity-10 border border-blue-600 border-opacity-30 p-4 rounded">
        <div className="text-sm">Valda sökord: <span className="font-bold">{selected.length}</span></div>
      </div>
    </div>
  );
}

