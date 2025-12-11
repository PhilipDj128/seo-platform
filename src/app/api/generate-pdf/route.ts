import { NextRequest, NextResponse } from 'next/server';

interface PDFData {
  domain: string;
  industry: string;
  cities: string[];
  keywords: string[];
  package: string;
  estimatedPages: number;
  estimatedLinks: number;
  estimatedMonths: number;
  email: string;
  phone: string;
  date: string;
}

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

export async function POST(request: NextRequest) {
  try {
    console.log('📄 API: POST /api/generate-pdf - Starting...');

    const body: PDFData = await request.json();

    console.log('🎨 Building HTML content...');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1f2937;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #1f2937;
            font-size: 28px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section h2 {
            background-color: #f3f4f6;
            padding: 10px 15px;
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #1f2937;
            border-left: 4px solid #3b82f6;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-item {
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 5px;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
          }
          .info-value {
            color: #1f2937;
            font-size: 14px;
            margin-top: 5px;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }
          .tag {
            background-color: #dbeafe;
            color: #1e40af;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
          }
          .package-section {
            background-color: #f0f9ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .package-title {
            font-size: 22px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .price {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 15px;
          }
          .features {
            list-style: none;
            padding: 0;
            margin: 15px 0;
          }
          .features li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            color: #444;
          }
          .features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #10b981;
          }
          .estimate-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
          }
          .estimate-item {
            background-color: #fff;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SEO PLATFORM</h1>
          <p>Professionell SEO-optimering</p>
        </div>

        <div class="section">
          <h2>OFFERT INFORMATION</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Domän</div>
              <div class="info-value">${body.domain}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Bransch</div>
              <div class="info-value">${body.industry}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>FOKUSOMRÅDEN</h2>
          <div class="tags">
            ${body.cities.map((city) => `<span class="tag">${city}</span>`).join('')}
          </div>
        </div>

        <div class="section">
          <h2>MÅLSÖKORD</h2>
          <div class="tags">
            ${body.keywords.map((kw) => `<span class="tag">${kw}</span>`).join('')}
          </div>
        </div>

        <div class="package-section">
          <div class="package-title">${body.package.toUpperCase()} PAKET</div>
          <div class="price">${PACKAGE_PRICES[body.package]?.toLocaleString()} kr/månad</div>
          <ul class="features">
            ${PACKAGE_DESCRIPTIONS[body.package]
              .split(',')
              .map((f) => `<li>${f.trim()}</li>`)
              .join('')}
          </ul>
        </div>

        <div class="footer">
          <p>SEO Platform - Professional SEO Services</p>
          <p>Offert genererad: ${body.date}</p>
        </div>
      </body>
      </html>
    `;

    console.log('✅ HTML content built');

    // Return HTML - client will convert to PDF using html2pdf.js
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating PDF:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

