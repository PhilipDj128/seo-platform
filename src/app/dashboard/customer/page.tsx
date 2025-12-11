'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProjectWithOffer {
  project: {
    id: string;
    domain_url: string;
    industry: string;
    cities: string[];
    selected_keywords: string[];
    selected_package: string;
    status: string;
    created_at: string;
  };
  offer: {
    id: string;
    customer_email: string;
    customer_phone: string;
    estimated_pages: number;
    estimated_links: number;
    estimated_months: number;
    package: string;
    status: string;
    created_at: string;
  };
}

const PACKAGE_PRICES: Record<string, number> = {
  bas: 1995,
  pro: 3995,
  elite: 6995,
  empire: 12000,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-600 bg-opacity-30 text-yellow-300',
  accepted: 'bg-green-600 bg-opacity-30 text-green-300',
  rejected: 'bg-red-600 bg-opacity-30 text-red-300',
  draft: 'bg-gray-600 bg-opacity-30 text-gray-300',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Väntande på svar',
  accepted: 'Accepterad',
  rejected: 'Avslågen',
  draft: 'Utkast',
};

export default function CustomerPortal() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithOffer[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectWithOffer | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        console.log('No user logged in, redirecting to login');
        router.push('/login');
        return;
      }

      setUser(currentUser);
      console.log('✅ User:', currentUser.email);

      // Get user's offers
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('customer_email', currentUser.email);

      if (offersError) throw offersError;

      console.log('✅ Offers found:', offersData?.length);

      // Get projects for these offers
      const projectIds = (offersData || []).map((o) => o.project_id);
      
      if (projectIds.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds);

      if (projectsError) throw projectsError;

      // Combine projects and offers
      const combined = projectsData
        ?.map((project) => ({
          project,
          offer: offersData?.find((o) => o.project_id === project.id),
        }))
        .filter((item) => item.offer) as ProjectWithOffer[];

      setProjects(combined || []);
      console.log('✅ Projects with offers:', combined?.length);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (project: ProjectWithOffer) => {
    try {
      console.log('📄 Generating PDF...');
      
      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      
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
              <div class="info-item"><div class="info-label">Domän</div><div class="info-value">${project.project.domain_url}</div></div>
              <div class="info-item"><div class="info-label">Bransch</div><div class="info-value">${project.project.industry}</div></div>
              <div class="info-item"><div class="info-label">Email</div><div class="info-value">${project.offer.customer_email}</div></div>
              <div class="info-item"><div class="info-label">Telefon</div><div class="info-value">${project.offer.customer_phone || 'N/A'}</div></div>
            </div>
          </div>
          <div class="section">
            <h2>FOKUSOMRÅDEN</h2>
            <div class="tags">
              ${(project.project.cities || []).map((city: string) => `<span class="tag">${city}</span>`).join('')}
            </div>
          </div>
          <div class="section">
            <h2>MÅLSÖKORD</h2>
            <div class="tags">
              ${(project.project.selected_keywords || []).map((kw: string) => `<span class="tag">${kw}</span>`).join('')}
            </div>
          </div>
          <div class="package-section">
            <div class="package-title">${project.offer.package.toUpperCase()} PAKET</div>
            <div class="price">${PACKAGE_PRICES[project.offer.package]?.toLocaleString()} kr/månad</div>
            <ul class="features">
              ${PACKAGE_DESCRIPTIONS[project.offer.package]?.split(',').map((f: string) => `<li>${f.trim()}</li>`).join('')}
            </ul>
            <div class="estimate-grid">
              <div class="estimate-item"><div class="estimate-label">Nya sidor</div><div class="estimate-value">${project.offer.estimated_pages}</div></div>
              <div class="estimate-item"><div class="estimate-label">Backlinks</div><div class="estimate-value">${project.offer.estimated_links}</div></div>
              <div class="estimate-item"><div class="estimate-label">Tidsestimat</div><div class="estimate-value">${project.offer.estimated_months} mån</div></div>
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
        filename: `offert-${project.project.domain_url.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Laddar dina projekt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Min Portal</h1>
          <p className="text-gray-400">Dina SEO-projekt och offerta</p>
          <p className="text-sm text-gray-500 mt-2">📧 {user?.email}</p>
        </div>

        {projects.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-xl font-bold mb-2">Inga projekt ännu</h2>
            <p className="text-gray-400 mb-6">Du har inga aktiva projekt eller offerta.</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/dashboard/new-project')}
            >
              Skapa nytt projekt
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((item) => (
              <Card
                key={item.project.id}
                className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{item.project.domain_url}</h3>
                    <p className="text-gray-400 text-sm">{item.project.industry}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      STATUS_COLORS[item.offer.status] || STATUS_COLORS['pending']
                    }`}
                  >
                    {STATUS_LABELS[item.offer.status] || item.offer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Paket</div>
                    <div className="font-bold capitalize">{item.offer.package}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Pris/månad</div>
                    <div className="font-bold">
                      {PACKAGE_PRICES[item.offer.package]?.toLocaleString()} kr
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Tidsestimat</div>
                    <div className="font-bold">{item.offer.estimated_months} mån</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Datum</div>
                    <div className="text-sm">
                      {new Date(item.offer.created_at).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPDF(item);
                    }}
                  >
                    📄 Ladda ner offert
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-sm px-3 py-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(item);
                    }}
                  >
                    Detaljer →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <Card
              className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">{selectedProject.project.domain_url}</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Bransch</div>
                    <div className="font-bold">{selectedProject.project.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Paket</div>
                    <div className="font-bold capitalize">{selectedProject.offer.package}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">Fokusområden</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.project.cities.map((city) => (
                      <span
                        key={city}
                        className="bg-blue-600 bg-opacity-20 text-blue-300 px-3 py-1 rounded text-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">Målsökord</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.project.selected_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="bg-green-600 bg-opacity-20 text-green-300 px-3 py-1 rounded text-sm"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-xs text-gray-400">Nya sidor</div>
                    <div className="text-2xl font-bold">
                      {selectedProject.offer.estimated_pages}
                    </div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-xs text-gray-400">Backlinks</div>
                    <div className="text-2xl font-bold">
                      {selectedProject.offer.estimated_links}
                    </div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-xs text-gray-400">Månader</div>
                    <div className="text-2xl font-bold">
                      {selectedProject.offer.estimated_months}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="text-sm text-gray-400 mb-3">
                    Status: <span className="font-bold text-white capitalize">{selectedProject.offer.status}</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    Kontaktperson: {selectedProject.offer.customer_phone}
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 mb-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPDF(selectedProject);
                  }}
                >
                  📄 Ladda ner offert som PDF
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedProject(null)}
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

