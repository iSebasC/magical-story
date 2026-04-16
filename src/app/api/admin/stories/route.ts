import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { storyService } from '@/modules/story/story.service';

// GET /api/admin/stories — Listar todas las stories
export async function GET() {
  try {
    const stories = await storyService.getAllStories();
    return NextResponse.json({
      success: true,
      data: stories,
      message: 'Stories obtenidas correctamente',
    });
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener stories' },
      { status: 500 }
    );
  }
}

async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// POST /api/admin/stories — Subir imágenes y crear story
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado. Inicia sesión.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const title = formData.get('title') as string | null;
    const accessLevel = (formData.get('access_level') as string) || 'free';
    const description = formData.get('description') as string | null;
    const bannerColor = formData.get('banner_color') as string | null;

    // Obtener archivos
    const pageImages = formData.getAll('images') as File[];
    const coverFile = formData.get('cover') as File | null;
    const resourceFiles = formData.getAll('resources') as File[];

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'El título es requerido' },
        { status: 400 }
      );
    }

    if (pageImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debes subir al menos una imagen de página' },
        { status: 400 }
      );
    }

    if (pageImages.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Máximo 100 páginas por historia' },
        { status: 400 }
      );
    }

    // Validar imágenes de páginas
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    for (const file of pageImages) {
      if (!allowedImageTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `"${file.name}" no es válido. Solo JPG, PNG o WEBP` },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, error: `"${file.name}" excede el límite de 5MB` },
          { status: 400 }
        );
      }
    }

    // Validar cover si existe
    if (coverFile) {
      if (!allowedImageTypes.includes(coverFile.type)) {
        return NextResponse.json(
          { success: false, error: 'La portada debe ser JPG, PNG o WEBP' },
          { status: 400 }
        );
      }
      if (coverFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'La portada excede el límite de 5MB' },
          { status: 400 }
        );
      }
    }

    // Validar recursos
    const MAX_RESOURCE_SIZE = 20 * 1024 * 1024;
    for (const file of resourceFiles) {
      if (file.size > MAX_RESOURCE_SIZE) {
        return NextResponse.json(
          { success: false, error: `Recurso "${file.name}" excede el límite de 20MB` },
          { status: 400 }
        );
      }
    }

    // Convertir páginas a buffers
    const images = await Promise.all(
      pageImages.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        fileName: file.name,
        contentType: file.type,
      }))
    );

    // Convertir cover a buffer
    let cover;
    if (coverFile) {
      cover = {
        buffer: Buffer.from(await coverFile.arrayBuffer()),
        fileName: coverFile.name,
        contentType: coverFile.type,
      };
    }

    // Convertir recursos a buffers
    let resources;
    if (resourceFiles.length > 0) {
      resources = await Promise.all(
        resourceFiles.map(async (file) => ({
          buffer: Buffer.from(await file.arrayBuffer()),
          fileName: file.name,
          contentType: file.type,
          displayName: file.name,
        }))
      );
    }

    const story = await storyService.createStoryWithImages(
      images,
      title.trim(),
      accessLevel as 'free' | 'premium',
      user.id,
      description?.trim() || undefined,
      cover,
      resources,
      bannerColor?.trim() || undefined,
    );

    return NextResponse.json(
      {
        success: true,
        data: story,
        message: `Story "${story.title}" creada con ${story.total_pages} páginas${resources ? ` y ${resources.length} recurso(s)` : ''}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear la story' },
      { status: 500 }
    );
  }
}
