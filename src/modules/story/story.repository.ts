import { supabaseAdmin } from '@/lib/supabase-admin';
import type {
  Document,
  DocumentPage,
  DocumentResource,
  CreateDocumentDto,
  UpdateDocumentDto,
  CreateDocumentPageDto,
  CreateDocumentResourceDto,
} from './story.types';

const STORAGE_BUCKET = 'stories';

let bucketReady = false;

class StoryRepository {
  private async ensureBucket(): Promise<void> {
    if (bucketReady) return;
    const { data } = await supabaseAdmin.storage.getBucket(STORAGE_BUCKET);
    if (!data) {
      await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024, // 20MB
      });
    }
    bucketReady = true;
  }
  async findAll(): Promise<Document[]> {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Document | null> {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findPagesByDocumentId(documentId: string): Promise<DocumentPage[]> {
    const { data, error } = await supabaseAdmin
      .from('document_pages')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findResourcesByDocumentId(documentId: string): Promise<DocumentResource[]> {
    const { data, error } = await supabaseAdmin
      .from('document_resources')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async create(dto: CreateDocumentDto): Promise<Document> {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: dto.user_id,
        title: dto.title,
        bucket: dto.bucket,
        total_pages: dto.total_pages,
        access_level: dto.access_level,
        cover_image: dto.cover_image || null,
        description: dto.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createPage(dto: CreateDocumentPageDto): Promise<DocumentPage> {
    const { data, error } = await supabaseAdmin
      .from('document_pages')
      .insert({
        document_id: dto.document_id,
        page_number: dto.page_number,
        content: dto.content || null,
        image_path: dto.image_path || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createPages(pages: CreateDocumentPageDto[]): Promise<DocumentPage[]> {
    const { data, error } = await supabaseAdmin
      .from('document_pages')
      .insert(
        pages.map((p) => ({
          document_id: p.document_id,
          page_number: p.page_number,
          content: p.content || null,
          image_path: p.image_path || null,
        }))
      )
      .select();

    if (error) throw error;
    return data || [];
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<boolean> {
    // Eliminar recursos asociados
    await supabaseAdmin
      .from('document_resources')
      .delete()
      .eq('document_id', id);

    // Eliminar páginas asociadas
    await supabaseAdmin
      .from('document_pages')
      .delete()
      .eq('document_id', id);

    // Eliminar documento
    const { error } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // === Resources ===

  async createResource(dto: CreateDocumentResourceDto): Promise<DocumentResource> {
    const { data, error } = await supabaseAdmin
      .from('document_resources')
      .insert({
        document_id: dto.document_id,
        name: dto.name,
        file_path: dto.file_path,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createResources(resources: CreateDocumentResourceDto[]): Promise<DocumentResource[]> {
    if (resources.length === 0) return [];
    const { data, error } = await supabaseAdmin
      .from('document_resources')
      .insert(
        resources.map((r) => ({
          document_id: r.document_id,
          name: r.name,
          file_path: r.file_path,
        }))
      )
      .select();

    if (error) throw error;
    return data || [];
  }

  // === Storage ===

  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    await this.ensureBucket();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `pages/${Date.now()}_${safeName}`;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType,
        upsert: false,
      });

    if (error) throw error;
    return path;
  }

  async uploadCover(file: Buffer, fileName: string, contentType: string): Promise<string> {
    await this.ensureBucket();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `covers/${Date.now()}_${safeName}`;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType,
        upsert: false,
      });

    if (error) throw error;
    return path;
  }

  async uploadResource(file: Buffer, fileName: string, contentType: string): Promise<string> {
    await this.ensureBucket();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `resources/${Date.now()}_${safeName}`;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType,
        upsert: false,
      });

    if (error) throw error;
    return path;
  }

  async deleteStorageFile(path: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) throw error;
  }

  async deleteStorageFiles(paths: string[]): Promise<void> {
    if (paths.length === 0) return;
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove(paths);

    if (error) throw error;
  }

  getPublicUrl(path: string): string {
    const { data } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}

export const storyRepository = new StoryRepository();
