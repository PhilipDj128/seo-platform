'use client';

import { Card } from '@/components/ui/card';

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: 'bas',
    name: 'Bas',
    price: 1995,
    features: [
      'On-page optimering',
      '1 nytt sökord/månad',
      'Hastighetsfix',
      'Grundläggande rapporter'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 3995,
    features: [
      'Allt i Bas +',
      '2-4 nya sidor/månad',
      '2 backlinks/månad',
      'Google My Maps',
      'Veckovisa rapporter'
    ],
    recommended: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 6995,
    features: [
      'Allt i Pro +',
      '4-8 backlinks/månad',
      'Expansion till nya städer',
      'EAT-uppbyggnad',
      'Dedicerad support'
    ]
  },
  {
    id: 'empire',
    name: 'Empire',
    price: 12000,
    features: [
      'Dominans i regionen',
      '10+ backlinks/månad',
      'Full webbyggnation',
      'Content-strategi',
      'VIP-support'
    ]
  }
];

interface Step4Props {
  onSelect: (packageId: string) => void;
  selected?: string;
}

export default function Step4Package({ onSelect, selected }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Steg 4: Välj paket</h2>
        <p className="text-gray-400">Vilket paket passar din situation?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition border-2 p-6 ${
              selected === pkg.id
                ? 'border-blue-500 bg-blue-600 bg-opacity-10'
                : 'border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => onSelect(pkg.id)}
          >
            {pkg.recommended && (
              <div className="text-xs bg-blue-600 w-fit px-2 py-1 rounded mb-3">
                Rekommenderad
              </div>
            )}

            <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>

            <div className="text-2xl font-bold mb-4">
              {pkg.price.toLocaleString()} kr
              <span className="text-sm text-gray-400">/mån</span>
            </div>

            <ul className="space-y-2 text-sm text-gray-300">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

