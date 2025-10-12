import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createBrowserSupabaseClient } from './supabase/client';

export type ImageUploadAccess = 'public' | 'signed';

export type UploadContext =
  | {
      type: 'project';
      projectId: string;
      namespace?: string;
    }
  | {
      type: 'user';
      userId: string;
      namespace?: string;
      fileName?: string;
    };

export type UploadImageToStorageOptions = {
  file: File;
  context: UploadContext;
  bucket?: string;
  access?: ImageUploadAccess;
  cacheControl?: string;
  expireInSeconds?: number;
  supabase?: SupabaseClient;
};

export type UploadImageResult = {
  url: string;
  path: string;
};

const DEFAULT_BUCKET = 'assets';
const DEFAULT_CACHE_CONTROL = '3600';
const DEFAULT_SIGNED_EXPIRY = 60 * 60 * 24 * 7; // 7 days
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

type SupabaseStorageClient = SupabaseClient['storage'];

const sanitizePathSegment = (segment: string) => segment.replace(/[^a-zA-Z0-9-_]/gu, '');

const getFileExtension = (file: File) => file.name.split('.').pop()?.toLowerCase() || file.type.split('/').pop() || 'png';

const buildStoragePath = (file: File, context: UploadContext) => {
  const extension = getFileExtension(file);

  if (context.type === 'project') {
    if (!context.projectId) {
      throw new Error('Project ID is required to upload project assets');
    }

    const namespace = sanitizePathSegment(context.namespace ?? 'assets');
    const projectSegment = sanitizePathSegment(context.projectId);
    return `projects/${projectSegment}/${namespace}/${crypto.randomUUID()}.${extension}`;
  }

  const namespace = sanitizePathSegment(context.namespace ?? 'avatars');
  const userSegment = sanitizePathSegment(context.userId);
  const fileStem = context.fileName ? sanitizePathSegment(context.fileName) : crypto.randomUUID();

  return `users/${userSegment}/${namespace}/${fileStem}.${extension}`;
};

const ensureSupabaseClient = (client?: SupabaseClient) => {
  if (client) {
    return client;
  }

  return createBrowserSupabaseClient();
};

const getPublicUrl = (storage: SupabaseStorageClient, bucket: string, path: string) => {
  const { data } = storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

const getSignedUrl = async (
  storage: SupabaseStorageClient,
  bucket: string,
  path: string,
  expireInSeconds: number,
) => {
  const { data, error } = await storage.from(bucket).createSignedUrl(path, expireInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Failed to generate signed URL');
  }

  return data.signedUrl;
};

export const uploadImageToStorage = async ({
  file,
  context,
  bucket = DEFAULT_BUCKET,
  access = 'public',
  cacheControl = DEFAULT_CACHE_CONTROL,
  expireInSeconds = DEFAULT_SIGNED_EXPIRY,
  supabase,
}: UploadImageToStorageOptions): Promise<UploadImageResult> => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the 5MB limit');
  }

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a PNG, JPG, WebP, GIF, or SVG image.');
  }

  const supabaseClient = ensureSupabaseClient(supabase);
  const storage = supabaseClient.storage;
  const path = buildStoragePath(file, context);

  const { error: uploadError } = await storage
    .from(bucket)
    .upload(path, file, {
      cacheControl,
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload image');
  }

  const url = access === 'public'
    ? getPublicUrl(storage, bucket, path)
    : await getSignedUrl(storage, bucket, path, expireInSeconds ?? DEFAULT_SIGNED_EXPIRY);

  if (!url) {
    throw new Error('Unable to generate a URL for the uploaded image');
  }

  return {
    url,
    path,
  };
};
