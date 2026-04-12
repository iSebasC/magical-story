export interface Document {
  id: string;
  user_id: string;
  title: string;
  bucket: string;
  total_pages: number;
  access_level: 'free' | 'premium';
  cover_image: string | null;
  description: string | null;
  created_at: string;
}

export interface DocumentPage {
  id: string;
  document_id: string;
  page_number: number;
  content: string | null;
  image_path: string | null;
  created_at: string;
}

export interface DocumentResource {
  id: string;
  document_id: string;
  name: string;
  file_path: string;
  created_at: string;
}

export interface CreateDocumentDto {
  title: string;
  access_level: 'free' | 'premium';
  bucket: string;
  total_pages: number;
  user_id: string;
  cover_image?: string;
  description?: string;
}

export interface UpdateDocumentDto {
  title?: string;
  access_level?: 'free' | 'premium';
  description?: string;
  cover_image?: string;
}

export interface CreateDocumentPageDto {
  document_id: string;
  page_number: number;
  content?: string;
  image_path?: string;
}

export interface CreateDocumentResourceDto {
  document_id: string;
  name: string;
  file_path: string;
}

export interface StoryWithPages extends Document {
  pages: DocumentPage[];
  resources: DocumentResource[];
}
