'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Step1URLInput from '@/components/NewProject/Step1-URLInput';
import Step2AutoDetect from '@/components/NewProject/Step2-AutoDetect';
import Step3Keywords from '@/components/NewProject/Step3-Keywords';
import Step4Package from '@/components/NewProject/Step4-Package';
import Step5Offer from '@/components/NewProject/Step5-Offer';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const INDUSTRIES = ['Städtjänster', 'Flyttfirma', 'Måleri', 'Byggentreprenör'];
const CITIES = ['Luleå', 'Västra Skellefteå', 'Arvidsjaur', 'Piteå', 'Boden'];
const COMPETITORS = ['CleanPro AB', 'Urban Städ', 'City Services'];

const generateKeywords = (industry: string) => {
  const keywords = [
    `${industry} Luleå`,
    `${industry} Västra Skellefteå`,
    `Billig ${industry}`,
    `${industry} snabbt`,
    `${industry} tjänst`,
    `Professionell ${industry}`,
    `${industry} pris`,
    `${industry} online`,
    `${industry} städer`,
    `${industry} offert`
  ];

  return keywords.slice(0, 10).map((kw, i) => ({
    id: `kw-${i}`,
    keyword: kw,
    volume: Math.floor(Math.random() * 5000) + 100,
    competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as any,
    ranking_potential: Math.floor(Math.random() * 40) + 60,
    time_estimate: Math.floor(Math.random() * 40) + 3
  }));
};

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState('pro');
  const [loading, setLoading] = useState(false);

  const cities = CITIES.slice(0, 3);
  const competitors = COMPETITORS;

  const handleStep1Next = (inputUrl: string) => {
    setUrl(inputUrl);
    const detectedIndustry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
    setIndustry(detectedIndustry);
    setKeywords(generateKeywords(detectedIndustry));
    setStep(2);
  };

  const handleStep5Submit = async (email: string, phone: string, message: string) => {
    setLoading(true);
    try {
      console.log('🔑 Getting session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📌 Session:', session?.user?.email);
      
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      console.log('🚀 Submitting project data...');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          domain_url: url,
          industry,
          cities,
          selected_keywords: selectedKeywords.map(id => 
            keywords.find(k => k.id === id)?.keyword
          ).filter(Boolean),
          selected_package: selectedPackage,
          customer_email: email,
          customer_phone: phone,
          customer_message: message
        })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `Failed to save`);
      }

      const data = await response.json();
      console.log('✅ Success:', data);
      setStep(6);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      alert('Fel vid skickning: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Tillbaka
        </Button>
        
        {step <= 5 && (
          <div className="w-full bg-slate-800 rounded h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        <div className="text-sm text-gray-400 mb-4">
          Steg {step} av 5
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-8 mb-8">
        {step === 1 && <Step1URLInput onNext={handleStep1Next} />}
        {step === 2 && (
          <Step2AutoDetect
            data={{
              url,
              industry,
              cities,
              competitors
            }}
          />
        )}
        {step === 3 && (
          <Step3Keywords
            keywords={keywords}
            onSelect={setSelectedKeywords}
          />
        )}
        {step === 4 && (
          <Step4Package
            selected={selectedPackage}
            onSelect={setSelectedPackage}
          />
        )}
        {step === 5 && (
          <Step5Offer
            data={{
              domain: url,
              industry,
              cities,
              keywords: selectedKeywords.map(id =>
                keywords.find(k => k.id === id)?.keyword
              ).filter(Boolean) as string[],
              package: selectedPackage,
              estimatedPages: Math.floor(Math.random() * 10) + 3,
              estimatedLinks: Math.floor(Math.random() * 15) + 5,
              estimatedMonths: Math.floor(Math.random() * 36) + 12
            }}
            onSubmit={handleStep5Submit}
          />
        )}
        {step === 6 && (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold">Offert skickad!</h2>
            <p className="text-gray-400">Vi omdirigerar till dashboard...</p>
          </div>
        )}
      </Card>

      {step <= 5 && (
        <div className="flex gap-4 justify-between">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            variant="secondary"
            disabled={step === 1}
          >
            ← Tillbaka
          </Button>

          {step < 5 && (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                (step === 3 && selectedKeywords.length === 0) ||
                (step === 4 && !selectedPackage)
              }
            >
              Nästa →
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
