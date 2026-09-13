import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_DESTINATIONS } from '@/data/vadodaraStops';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: false,
        message: 'Supabase environment variables not configured. Using local dataset.',
      });
    }

    const payload = INITIAL_DESTINATIONS.map((dest) => ({
      stop_number: dest.stop_number,
      name: dest.name,
      location: dest.location,
      distance: dest.distance,
      description: dest.description,
      latitude: dest.latitude,
      longitude: dest.longitude,
      image_url: dest.image_url,
      category: dest.category,
      visited: dest.visited,
    }));

    const { data, error } = await supabase
      .from('destinations')
      .upsert(payload, { onConflict: 'stop_number' })
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded 11 Vadodara tour stops into Supabase!',
      count: data?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
