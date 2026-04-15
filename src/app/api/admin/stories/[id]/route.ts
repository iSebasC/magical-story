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

// PUT /api/admin/stories/[id] — Actualizar story con posibles archivos
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let title: string;
    let access_level: 'free' | 'premium';
    let description: string | undefined;
    
    let coverFile: File | null = null;
    let pageImages: File[] = [];

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title') as string;
      access_level = (formData.get('access_level') as 'free' | 'premium') || 'free';
      description = (formData.get('description') as string) || undefined;
      coverFile = formData.get('cover') as File | null;
      pageImages = formData.getAll('images') as File[];
    } else {
      const body = await request.json();
      title = body.title;
      access_level = body.access_level;
      description = body.description;
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    // Convertir a buffers si hay archivos
    let cover;
    if (coverFile) {
      cover = {
        buffer: Buffer.from(await coverFile.arrayBuffer()),
        fileName: coverFile.name,
        contentType: coverFile.type,
      };
    }

    let images;
    if (pageImages && pageImages.length > 0) {
      images = await Promise.all(
        pageImages.map(async (file) => ({
          buffer: Buffer.from(await file.arrayBuffer()),
          fileName: file.name,
          contentType: file.type,
        }))
      );
    }

    const story = await storyService.updateStoryWithFiles(
      id,
      title.trim(),
      access_level,
      description?.trim(),
      cover,
      images
    );

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
