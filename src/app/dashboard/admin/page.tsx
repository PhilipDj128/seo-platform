'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Offer {
  id: string;
  project_id: string;
  customer_email: string;
  customer_phone: string;
  estimated_pages: number;
  estimated_links: number;
  estimated_months: number;
  package: string;
  status: string;
  created_at: string;
  project?: {
    domain_url: string;
    industry: string;
    cities: string[];
    selected_keywords: string[];
  };
}

interface Statistics {
  total_offers: number;
  pending_offers: number;
  total_value: number;
  conversion_rate: number;
}

export default function AdminDashboard() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<Statistics>({
    total_offers: 0,
    pending_offers: 0,
    total_value: 0,
    conversion_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const PACKAGE_PRICES: Record<string, number> = {
    bas: 1995,
    pro: 3995,
    elite: 6995,
    empire: 12000,
  };

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [searchTerm, filterStatus, offers]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading offers...');

      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      console.log('✅ Offers loaded:', offersData?.length);

      const projectIds = (offersData || []).map((o) => o.project_id);
      if (projectIds.length === 0) {
        setOffers([]);
        setStats({
          total_offers: 0,
          pending_offers: 0,
          total_value: 0,
          conversion_rate: 0,
        });
        setLoading(false);
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds);

      if (projectsError) throw projectsError;

      const projectMap = (projectsData || []).reduce(
        (map, p) => ({ ...map, [p.id]: p }),
        {}
      );

      const enrichedOffers = (offersData || []).map((offer) => ({
        ...offer,
        project: projectMap[offer.project_id],
      }));

      setOffers(enrichedOffers);

      // Calculate stats
      const total = enrichedOffers.length;
      const pending = enrichedOffers.filter((o) => o.status === 'pending').length;
      const totalValue = enrichedOffers.reduce(
        (sum, o) => sum + (PACKAGE_PRICES[o.package] || 0),
        0
      );

      setStats({
        total_offers: total,
        pending_offers: pending,
        total_value: totalValue,
        conversion_rate: total > 0 ? Math.round(((total - pending) / total) * 100) : 0,
      });
    } catch (error) {
      console.error('❌ Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = offers;

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.project?.domain_url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }

    setFilteredOffers(filtered);
  };

  const updateOfferStatus = async (offerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) throw error;
      console.log('✅ Offer status updated');
      loadOffers();
    } catch (error) {
      console.error('❌ Error updating offer:', error);
    }
  };

  const downloadPDF = async (offer: Offer) => {
    try {
      console.log('📄 Generating PDF...');
      
      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      
      const PACKAGE_PRICES: Record<string, number> = {
        bas: 1995,
        pro: 3995,
        elite: 6995,
        empire: 12000,
      };

      const PACKAGE_DESCRIPTIONS: Record<string, string> = {
        bas: 'On-page optimering, 1 nytt sökord/månad, Hastighetsfix, Grundläggande rapporter',
        pro: 'Allt i Bas + 2-4 nya sidor/månad, 2 backlinks/månad, Google My Maps, Veckovisa rapporter',
        elite: 'Allt i Pro + 4-8 backlinks/månad, Expansion till nya städer, EAT-uppbyggnad, Dedicerad support',
        empire: 'Dominans i regionen, 10+ backlinks/månad, Full webbyggnation, Content-strategi, VIP-support',
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1f2937; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #1f2937; font-size: 28px; }
            .section { margin-bottom: 25px; }
            .section h2 { background-color: #f3f4f6; padding: 10px 15px; margin: 0 0 15px 0; font-size: 16px; color: #1f2937; border-left: 4px solid #3b82f6; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
            .info-item { padding: 10px; background-color: #f9fafb; border-radius: 5px; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; }
            .info-value { color: #1f2937; font-size: 14px; margin-top: 5px; }
            .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
            .tag { background-color: #dbeafe; color: #1e40af; padding: 5px 12px; border-radius: 20px; font-size: 12px; }
            .package-section { background-color: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .package-title { font-size: 22px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .price { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 15px; }
            .features { list-style: none; padding: 0; margin: 15px 0; }
            .features li { padding: 8px 0; padding-left: 25px; position: relative; color: #444; }
            .features li:before { content: "✓"; position: absolute; left: 0; font-weight: bold; color: #10b981; }
            .estimate-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px; }
            .estimate-item { background-color: #fff; border: 1px solid #e5e7eb; padding: 12px; border-radius: 5px; text-align: center; }
            .estimate-label { font-size: 12px; color: #666; }
            .estimate-value { font-size: 18px; font-weight: bold; color: #3b82f6; margin-top: 5px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SEO PLATFORM</h1>
            <p>Professionell SEO-optimering för din webbplats</p>
          </div>
          <div class="section">
            <h2>OFFERT INFORMATION</h2>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Domän</div><div class="info-value">${offer.project?.domain_url || 'N/A'}</div></div>
              <div class="info-item"><div class="info-label">Bransch</div><div class="info-value">${offer.project?.industry || 'N/A'}</div></div>
              <div class="info-item"><div class="info-label">Email</div><div class="info-value">${offer.customer_email}</div></div>
              <div class="info-item"><div class="info-label">Telefon</div><div class="info-value">${offer.customer_phone || 'N/A'}</div></div>
            </div>
          </div>
          <div class="section">
            <h2>FOKUSOMRÅDEN</h2>
            <div class="tags">
              ${(offer.project?.cities || []).map((city: string) => `<span class="tag">${city}</span>`).join('')}
            </div>
          </div>
          <div class="section">
            <h2>MÅLSÖKORD</h2>
            <div class="tags">
              ${(offer.project?.selected_keywords || []).map((kw: string) => `<span class="tag">${kw}</span>`).join('')}
            </div>
          </div>
          <div class="package-section">
            <div class="package-title">${offer.package.toUpperCase()} PAKET</div>
            <div class="price">${PACKAGE_PRICES[offer.package]?.toLocaleString()} kr/månad</div>
            <ul class="features">
              ${PACKAGE_DESCRIPTIONS[offer.package]?.split(',').map((f: string) => `<li>${f.trim()}</li>`).join('')}
            </ul>
            <div class="estimate-grid">
              <div class="estimate-item"><div class="estimate-label">Nya sidor</div><div class="estimate-value">${offer.estimated_pages}</div></div>
              <div class="estimate-item"><div class="estimate-label">Backlinks</div><div class="estimate-value">${offer.estimated_links}</div></div>
              <div class="estimate-item"><div class="estimate-label">Tidsestimat</div><div class="estimate-value">${offer.estimated_months} mån</div></div>
            </div>
          </div>
          <div class="footer">
            <p>SEO Platform - Professional SEO Services</p>
            <p>Offert genererad: ${new Date().toLocaleDateString('sv-SE')}</p>
          </div>
        </body>
        </html>
      `;

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const options = {
        margin: 10,
        filename: `offert-${offer.project?.domain_url?.replace(/[^a-z0-9]/gi, '-') || 'offer'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' as const },
      };

      await html2pdf().set(options).from(element).save();
      document.body.removeChild(element);
      
      console.log('✅ PDF downloaded');
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Fel vid PDF-generering');
    }
  };

  const sendReminderEmail = async (offer: Offer) => {
    try {
      console.log('📧 Sending reminder email...');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reminder',
          to: offer.customer_email,
          offerId: offer.id,
          domain: offer.project?.domain_url,
          package: offer.package,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');
      console.log('✅ Reminder email sent');
      alert('Email skickat! ✅');
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('Fel vid skickning av email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Laddar admin-dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Hantera alla offerta och customers</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-sm text-gray-400 mb-2">Totala offerta</div>
            <div className="text-4xl font-bold">{stats.total_offers}</div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-sm text-gray-400 mb-2">Väntande</div>
            <div className="text-4xl font-bold text-yellow-400">{stats.pending_offers}</div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-sm text-gray-400 mb-2">Total värde</div>
            <div className="text-4xl font-bold text-green-400">
              {(stats.total_value / 1000).toFixed(0)}k kr
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-sm text-gray-400 mb-2">Konvertering</div>
            <div className="text-4xl font-bold text-blue-400">{stats.conversion_rate}%</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-col md:flex-row">
          <Input
            placeholder="Sök email eller domän..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-700 flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white"
          >
            <option value="all">Alla status</option>
            <option value="pending">Väntande</option>
            <option value="accepted">Accepterade</option>
            <option value="rejected">Avslagna</option>
          </select>
          <Button
            onClick={loadOffers}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Uppdatera
          </Button>
        </div>

        {/* Offers Table */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-900">
                <tr>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Domän</th>
                  <th className="text-left p-4">Paket</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Datum</th>
                  <th className="text-left p-4">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b border-slate-700 hover:bg-slate-700 transition cursor-pointer"
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <td className="p-4 font-mono text-xs">{offer.customer_email}</td>
                    <td className="p-4 text-sm">{offer.project?.domain_url || 'N/A'}</td>
                    <td className="p-4 capitalize font-bold">{offer.package}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          offer.status === 'pending'
                            ? 'bg-yellow-600 bg-opacity-30 text-yellow-300'
                            : offer.status === 'accepted'
                              ? 'bg-green-600 bg-opacity-30 text-green-300'
                              : 'bg-red-600 bg-opacity-30 text-red-300'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(offer.created_at).toLocaleDateString('sv-SE')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="text-sm px-3 py-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(offer);
                          }}
                          title="Download PDF"
                        >
                          📄
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-sm px-3 py-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendReminderEmail(offer);
                          }}
                          title="Send Email"
                        >
                          📧
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Inga offerta hittades
          </div>
        )}

        {/* Detail Modal */}
        {selectedOffer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOffer(null)}
          >
            <Card
              className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Offert Detaljer</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="font-mono">{selectedOffer.customer_email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Telefon</div>
                    <div className="font-mono">{selectedOffer.customer_phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Domän</div>
                    <div>{selectedOffer.project?.domain_url}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Bransch</div>
                    <div>{selectedOffer.project?.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Paket</div>
                    <div className="font-bold capitalize">{selectedOffer.package}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Pris/mån</div>
                    <div className="font-bold">
                      {PACKAGE_PRICES[selectedOffer.package]?.toLocaleString()} kr
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">Sökord</div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedOffer.project?.selected_keywords || []).map((kw) => (
                      <span
                        key={kw}
                        className="bg-blue-600 bg-opacity-20 text-blue-300 px-2 py-1 rounded text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      updateOfferStatus(selectedOffer.id, 'accepted');
                      setSelectedOffer(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    ✅ Acceptera
                  </Button>
                  <Button
                    onClick={() => {
                      updateOfferStatus(selectedOffer.id, 'rejected');
                      setSelectedOffer(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 flex-1"
                  >
                    ❌ Avslå
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedOffer(null)}
                >
                  Stäng
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

