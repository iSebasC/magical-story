import { NextRequest, NextResponse } from 'next/server';
import { storyService } from '@/modules/story/story.service';

// GET /api/admin/stories/[id] — Obtener story por ID con páginas
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await storyService.getStoryById(id);

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: story,
      message: 'Story obtenida correctamente',
    });
  } catch (error: any) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener story' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/stories/[id] — Actualizar story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const story = await storyService.updateStory(id, {
      title: body.title,
      access_level: body.access_level,
    });

    return NextResponse.json({
      success: true,
      data: story,
      message: 'Story actualizada correctamente',
    });
  } catch (error: any) {
    console.error('Error updating story:', error);
    const status = error.message === 'Story not found' ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar story' },
      { status }
    );
  }
}

// DELETE /api/admin/stories/[id] — Eliminar story
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await storyService.deleteStory(id);

    return NextResponse.json({
      success: true,
      message: 'Story eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error deleting story:', error);
    const status = error.message === 'Story not found' ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar story' },
      { status }
    );
  }
}
