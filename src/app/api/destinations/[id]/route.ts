import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (isSupabaseConfigured && supabase) {
      const updatePayload: Record<string, any> = {};
      if (body.name !== undefined) updatePayload.name = body.name.trim();
      if (body.location !== undefined) updatePayload.location = body.location.trim();
      if (body.distance !== undefined) updatePayload.distance = body.distance.trim();
      if (body.description !== undefined) updatePayload.description = body.description.trim();
      if (body.latitude !== undefined) updatePayload.latitude = parseFloat(body.latitude);
      if (body.longitude !== undefined) updatePayload.longitude = parseFloat(body.longitude);
      if (body.image_url !== undefined) updatePayload.image_url = body.image_url.trim();
      if (body.category !== undefined) updatePayload.category = body.category;
      if (body.visited !== undefined) updatePayload.visited = Boolean(body.visited);
      if (body.stop_number !== undefined) updatePayload.stop_number = Number(body.stop_number);

      const { data, error } = await supabase
        .from('destinations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // Local fallback response
    return NextResponse.json({
      success: true,
      data: { id, ...body },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error updating destination' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Stop removed from tour' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error deleting destination' },
      { status: 500 }
    );
  }
}
