import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  bucket: string = 'users',
  folder: string = 'avatars'
): Promise<UploadResult> {
  try {
    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      return { url: '', path: '', error: 'Apenas arquivos de imagem são permitidos' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return { url: '', path: '', error: 'Arquivo deve ter no máximo 5MB' };
    }

    // Gerar nome único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: 'Erro ao fazer upload da imagem' };
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: '', path: '', error: 'Erro ao processar upload' };
  }
}

export async function deleteImage(
  path: string,
  bucket: string = 'users'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: 'Erro ao deletar imagem' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Erro ao processar deleção' };
  }
}

export async function getImageUrl(
  path: string,
  bucket: string = 'users'
): Promise<string> {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Get URL error:', error);
    return '';
  }
}
