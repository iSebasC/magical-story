import { storyRepository } from './story.repository';
import type {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  StoryWithPages,
} from './story.types';

interface UploadedFile {
  buffer: Buffer;
  fileName: string;
  contentType: string;
}

interface UploadedResource extends UploadedFile {
  displayName: string;
}

class StoryService {
  async getAllStories(): Promise<Document[]> {
    return await storyRepository.findAll();
  }

  async getStoryById(id: string): Promise<StoryWithPages | null> {
    const doc = await storyRepository.findById(id);
    if (!doc) return null;

    const pages = await storyRepository.findPagesByDocumentId(id);
    const resources = await storyRepository.findResourcesByDocumentId(id);
    return { ...doc, pages, resources };
  }

  async createStoryWithImages(
    images: UploadedFile[],
    title: string,
    accessLevel: 'free' | 'premium',
    userId: string,
    description?: string,
    cover?: UploadedFile,
    resources?: UploadedResource[],
    bannerColor?: string,
  ): Promise<Document> {
    if (images.length === 0) {
      throw new Error('At least one image is required');
    }

    if (images.length > 100) {
      throw new Error('Maximum 100 pages per story');
    }

    // Validar tipos de imagen
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const img of images) {
      if (!allowedImageTypes.includes(img.contentType)) {
        throw new Error(`Invalid file type: ${img.contentType}. Allowed: JPG, PNG, WEBP`);
      }
    }

    // Validar tamaño individual (5MB por imagen)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    for (const img of images) {
      if (img.buffer.length > MAX_IMAGE_SIZE) {
        throw new Error(`Image "${img.fileName}" exceeds 5MB limit`);
      }
    }

    // Validar cover si existe
    if (cover) {
      if (!allowedImageTypes.includes(cover.contentType)) {
        throw new Error('Cover image must be JPG, PNG or WEBP');
      }
      if (cover.buffer.length > MAX_IMAGE_SIZE) {
        throw new Error('Cover image exceeds 5MB limit');
      }
    }

    // Validar recursos si existen
    const MAX_RESOURCE_SIZE = 50 * 1024 * 1024; // 50MB por recurso
    if (resources) {
      for (const res of resources) {
        if (res.buffer.length > MAX_RESOURCE_SIZE) {
          throw new Error(`Resource "${res.displayName}" exceeds 50MB limit`);
        }
      }
    }

    const allUploadedPaths: string[] = [];

    try {
      // 1. Subir cover si existe
      let coverPath: string | undefined;
      let coverUrl: string | undefined;
      if (cover) {
        coverPath = await storyRepository.uploadCover(cover.buffer, cover.fileName, cover.contentType);
        coverUrl = storyRepository.getPublicUrl(coverPath);
        allUploadedPaths.push(coverPath);
      }

      // 2. Subir cada imagen de página a Storage
      const uploadedPagePaths: string[] = [];
      const uploadedPageUrls: string[] = [];
      for (const img of images) {
        const path = await storyRepository.uploadImage(img.buffer, img.fileName, img.contentType);
        uploadedPagePaths.push(path);
        uploadedPageUrls.push(storyRepository.getPublicUrl(path));
        allUploadedPaths.push(path);
      }

      // 3. Subir recursos si existen
      const uploadedResources: { name: string; path: string; url: string }[] = [];
      if (resources) {
        for (const res of resources) {
          const path = await storyRepository.uploadResource(res.buffer, res.fileName, res.contentType);
          uploadedResources.push({ name: res.displayName, path, url: storyRepository.getPublicUrl(path) });
          allUploadedPaths.push(path);
        }
      }

      // 4. Crear registro del documento
      const dto: CreateDocumentDto = {
        title,
        access_level: accessLevel,
        bucket: 'stories',
        total_pages: images.length,
        user_id: userId,
        cover_image: coverUrl,
        description: description || undefined,
        banner_color: bannerColor || undefined,
      };

      const document = await storyRepository.create(dto);

      // 5. Crear registros de páginas con sus image_path (URL pública)
      const pages = uploadedPageUrls.map((url, index) => ({
        document_id: document.id,
        page_number: index + 1,
        image_path: url,
      }));

      await storyRepository.createPages(pages);

      // 6. Crear registros de recursos (URL pública)
      if (uploadedResources.length > 0) {
        await storyRepository.createResources(
          uploadedResources.map((r) => ({
            document_id: document.id,
            name: r.name,
            file_path: r.url,
          }))
        );
      }

      return document;
    } catch (error) {
      // Limpiar todo lo subido si falla algo
      await storyRepository.deleteStorageFiles(allUploadedPaths);
      throw error;
    }
  }

  async updateStory(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const existing = await storyRepository.findById(id);
    if (!existing) {
      throw new Error('Story not found');
    }
    return await storyRepository.update(id, dto);
  }

  async updateStoryWithFiles(
    id: string,
    title: string,
    accessLevel: 'free' | 'premium',
    description?: string,
    newCover?: UploadedFile,
    newImages?: UploadedFile[],
    newResources?: UploadedResource[],
    deleteResourceIds?: string[],
    bannerColor?: string,
  ): Promise<Document> {
    const existing = await storyRepository.findById(id);
    if (!existing) {
      throw new Error('Story not found');
    }

    let coverUrl = existing.cover_image;
    // 1. Reemplazar cover si hay nuevo
    if (newCover) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedImageTypes.includes(newCover.contentType)) {
        throw new Error('Cover image must be JPG, PNG or WEBP');
      }
      if (newCover.buffer.length > 5 * 1024 * 1024) {
        throw new Error('Cover image exceeds 5MB limit');
      }

      const coverPath = await storyRepository.uploadCover(newCover.buffer, newCover.fileName, newCover.contentType);
      coverUrl = storyRepository.getPublicUrl(coverPath);

      if (existing.cover_image) {
        const oldP = this.extractStoragePath(existing.cover_image);
        if (oldP) {
          try { await storyRepository.deleteStorageFiles([oldP]); } catch {}
        }
      }
    }

    let totalPages = existing.total_pages;

    // 2. Reemplazar páginas si hay nuevas
    if (newImages && newImages.length > 0) {
      if (newImages.length > 100) {
        throw new Error('Maximum 100 pages per story');
      }

      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      for (const img of newImages) {
        if (!allowedImageTypes.includes(img.contentType)) {
          throw new Error(`Invalid file type: ${img.contentType}`);
        }
        if (img.buffer.length > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB limit');
      }

      const uploadedPageUrls: string[] = [];
      for (const img of newImages) {
        const path = await storyRepository.uploadImage(img.buffer, img.fileName, img.contentType);
        uploadedPageUrls.push(storyRepository.getPublicUrl(path));
      }

      const existingPages = await storyRepository.findPagesByDocumentId(id);
      const pathsToDelete = existingPages
        .map(p => p.image_path ? this.extractStoragePath(p.image_path) : null)
        .filter((p): p is string => p !== null);
      if (pathsToDelete.length > 0) {
        try { await storyRepository.deleteStorageFiles(pathsToDelete); } catch {}
      }

      await storyRepository.deletePages(id);

      const newPagesToInsert = uploadedPageUrls.map((url, index) => ({
        document_id: id,
        page_number: index + 1,
        image_path: url,
      }));
      await storyRepository.createPages(newPagesToInsert);
      totalPages = newImages.length;
    }

    // 3. Eliminar recursos marcados para borrar
    if (deleteResourceIds && deleteResourceIds.length > 0) {
      const existingResources = await storyRepository.findResourcesByDocumentId(id);
      const toDelete = existingResources.filter(r => deleteResourceIds.includes(r.id));
      const storagePaths = toDelete
        .map(r => r.file_path ? this.extractStoragePath(r.file_path) : null)
        .filter((p): p is string => p !== null);
      if (storagePaths.length > 0) {
        try { await storyRepository.deleteStorageFiles(storagePaths); } catch {}
      }
      await storyRepository.deleteResourcesByIds(deleteResourceIds);
    }

    // 4. Subir nuevos recursos
    if (newResources && newResources.length > 0) {
      const MAX_RESOURCE_SIZE = 50 * 1024 * 1024;
      for (const res of newResources) {
        if (res.buffer.length > MAX_RESOURCE_SIZE) {
          throw new Error(`Resource "${res.displayName}" exceeds 50MB limit`);
        }
      }
      const uploadedResources: { name: string; path: string; url: string }[] = [];
      for (const res of newResources) {
        const path = await storyRepository.uploadResource(res.buffer, res.fileName, res.contentType);
        uploadedResources.push({ name: res.displayName, path, url: storyRepository.getPublicUrl(path) });
      }
      if (uploadedResources.length > 0) {
        await storyRepository.createResources(
          uploadedResources.map((r) => ({
            document_id: id,
            name: r.name,
            file_path: r.url,
          }))
        );
      }
    }

    return await storyRepository.update(id, {
      title,
      access_level: accessLevel,
      description: description || undefined,
      cover_image: coverUrl ?? undefined,
      total_pages: totalPages,
      banner_color: bannerColor || undefined,
    });
  }

  /** Extrae el path de storage desde una URL pública de Supabase */
  private extractStoragePath(publicUrl: string): string | null {
    const marker = '/object/public/stories/';
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.substring(idx + marker.length);
  }

  async deleteStory(id: string): Promise<boolean> {
    const existing = await storyRepository.findById(id);
    if (!existing) {
      throw new Error('Story not found');
    }

    // Recopilar todos los paths de storage a eliminar
    const pathsToDelete: string[] = [];

    // Cover
    if (existing.cover_image) {
      const p = this.extractStoragePath(existing.cover_image);
      if (p) pathsToDelete.push(p);
    }

    // Páginas
    const pages = await storyRepository.findPagesByDocumentId(id);
    for (const pg of pages) {
      if (pg.image_path) {
        const p = this.extractStoragePath(pg.image_path);
        if (p) pathsToDelete.push(p);
      }
    }

    // Recursos
    const resources = await storyRepository.findResourcesByDocumentId(id);
    for (const r of resources) {
      if (r.file_path) {
        const p = this.extractStoragePath(r.file_path);
        if (p) pathsToDelete.push(p);
      }
    }

    if (pathsToDelete.length > 0) {
      try {
        await storyRepository.deleteStorageFiles(pathsToDelete);
      } catch {
        // Continuar si los archivos no existen en storage
      }
    }

    return await storyRepository.delete(id);
  }
}

export const storyService = new StoryService();
