import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  console.log('🚀 API: POST /api/projects - Starting...');
  
  try {
    console.log('🔑 Getting token from Authorization header...');
    const authHeader = request.headers.get('Authorization');
    console.log('📌 Auth header exists:', !!authHeader);
    
    if (!authHeader) {
      console.log('❌ No auth header found');
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('✅ Token extracted');

    console.log('🔌 Creating Supabase client with token...');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    console.log('✅ Supabase client created');

    console.log('🔐 Getting user from token...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('👤 User:', user?.email || 'No user');
    console.log('⚠️ Auth error:', authError);
    
    if (!user || authError) {
      console.log('❌ No user found or auth error');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📦 Parsing request body...');
    const body = await request.json();
    console.log('✅ Body received');

    console.log('💾 Inserting project...');
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        domain_url: body.domain_url,
        industry: body.industry,
        cities: body.cities,
        selected_keywords: body.selected_keywords,
        selected_package: body.selected_package,
        status: 'submitted'
      })
      .select()
      .single();

    console.log('📊 Project insert result:');
    console.log('  - Data:', projectData?.id || 'No data');
    console.log('  - Error:', projectError?.message);

    if (projectError) {
      console.log('❌ Project error:', projectError.message);
      throw projectError;
    }

    console.log('💾 Inserting offer...');
    const { error: offerError } = await supabase
      .from('offers')
      .insert({
        project_id: projectData.id,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        estimated_pages: Math.floor(Math.random() * 10) + 3,
        estimated_links: Math.floor(Math.random() * 15) + 5,
        estimated_months: Math.floor(Math.random() * 36) + 12,
        package: body.selected_package,
        status: 'pending'
      });

    console.log('📊 Offer insert result:');
    console.log('  - Error:', offerError?.message);

    if (offerError) {
      console.log('❌ Offer error:', offerError.message);
      throw offerError;
    }

    console.log('✅ SUCCESS - Both inserts completed');
    return NextResponse.json(
      { success: true, project: projectData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('🔴 CATCH ERROR:');
    console.error('  - Message:', error.message);
    console.error('  - Code:', error.code);
    
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
