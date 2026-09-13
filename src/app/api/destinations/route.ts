import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_DESTINATIONS } from '@/data/vadodaraStops';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('stop_number', { ascending: true });

      if (error) {
        console.error('Supabase query error, falling back to local dataset:', error);
        return NextResponse.json({
          success: true,
          data: INITIAL_DESTINATIONS,
          source: 'local_fallback',
        });
      }

      // If Supabase table is currently empty, return initial stops
      if (!data || data.length === 0) {
        return NextResponse.json({
          success: true,
          data: INITIAL_DESTINATIONS,
          source: 'initial_seeded',
        });
      }

      return NextResponse.json({
        success: true,
        data,
        source: 'supabase',
      });
    }

    // Default fallback when Supabase keys not set yet
    return NextResponse.json({
      success: true,
      data: INITIAL_DESTINATIONS,
      source: 'local_dataset',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.location || body.latitude === undefined || body.longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, location, latitude, and longitude are required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .insert([
          {
            stop_number: Number(body.stop_number) || 1,
            name: body.name.trim(),
            location: body.location.trim(),
            distance: body.distance ? body.distance.trim() : '',
            description: body.description ? body.description.trim() : '',
            latitude: parseFloat(body.latitude),
            longitude: parseFloat(body.longitude),
            image_url: body.image_url ? body.image_url.trim() : '',
            category: body.category || 'other',
            visited: Boolean(body.visited),
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data }, { status: 201 });
    }

    // When Supabase is not connected, create a local mock object
    const newStop = {
      id: 'local-' + Date.now(),
      ...body,
      stop_number: Number(body.stop_number) || 1,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newStop }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error creating destination' },
      { status: 500 }
    );
  }
}
