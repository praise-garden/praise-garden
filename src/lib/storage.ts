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

export type UploadMediaOptions = {
  file: File;
  context: UploadContext;
  bucket?: string;
  access?: ImageUploadAccess;
  cacheControl?: string;
  expireInSeconds?: number;
  supabase?: SupabaseClient;
};

export type UploadResult = {
  url: string;
  path: string;
};

const DEFAULT_BUCKET = 'assets';
const DEFAULT_CACHE_CONTROL = '3600';
const DEFAULT_SIGNED_EXPIRY = 60 * 60 * 24 * 7; // 7 days

// File size limits
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;   // 5MB for images
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;  // 50MB for videos

// Valid file types
const VALID_IMAGE_TYPES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'
];
const VALID_VIDEO_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
];
const VALID_MEDIA_TYPES = [...VALID_IMAGE_TYPES, ...VALID_VIDEO_TYPES];

type SupabaseStorageClient = SupabaseClient['storage'];

const sanitizePathSegment = (segment: string) => segment.replace(/[^a-zA-Z0-9-_]/gu, '');

const getFileExtension = (file: File) => file.name.split('.').pop()?.toLowerCase() || file.type.split('/').pop() || 'png';

const buildStoragePath = (file: File, context: UploadContext) => {
  const extension = getFileExtension(file);

  if (context.type === 'project') {
    if (!context.projectId) {
      throw new Error('Project ID is required to upload project assets');
    }

    const namespaceParts = (context.namespace ?? 'assets')
      .split('/')
      .map(sanitizePathSegment)
      .filter(Boolean);

    const namespace = namespaceParts.join('/');
    const projectSegment = sanitizePathSegment(context.projectId);
    return `projects/${projectSegment}/${namespace}/${crypto.randomUUID()}.${extension}`;
  }

  const namespaceParts = (context.namespace ?? 'avatars')
    .split('/')
    .map(sanitizePathSegment)
    .filter(Boolean);

  const namespace = namespaceParts.join('/');
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

/**
 * Core upload function used by both image and video upload functions
 */
const uploadToStorage = async ({
  file,
  context,
  bucket = DEFAULT_BUCKET,
  access = 'public',
  cacheControl = DEFAULT_CACHE_CONTROL,
  expireInSeconds = DEFAULT_SIGNED_EXPIRY,
  supabase,
}: UploadMediaOptions): Promise<UploadResult> => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const supabaseClient = ensureSupabaseClient(supabase);
  console.info('[uploadToStorage] Ensured Supabase client instance');

  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  console.info('[uploadToStorage] Session inspection', {
    hasSession: Boolean(sessionData?.session),
    userId: sessionData?.session?.user?.id ?? null,
    sessionError: sessionError?.message ?? null,
  });

  const storage = supabaseClient.storage;
  const path = buildStoragePath(file, context);
  console.info('[uploadToStorage] Prepared upload payload', {
    bucket,
    path,
    access,
    cacheControl,
    expireInSeconds,
  });

  const { error: uploadError } = await storage
    .from(bucket)
    .upload(path, file, {
      cacheControl,
      upsert: true,
    });

  if (uploadError) {
    console.error('[uploadToStorage] Upload failed', {
      bucket,
      path,
      storageError: uploadError,
    });
    throw new Error(uploadError.message || 'Failed to upload file');
  }

  const url = access === 'public'
    ? getPublicUrl(storage, bucket, path)
    : await getSignedUrl(storage, bucket, path, expireInSeconds ?? DEFAULT_SIGNED_EXPIRY);

  console.info('[uploadToStorage] Upload succeeded', {
    bucket,
    path,
    access,
    url,
  });

  if (!url) {
    throw new Error('Unable to generate a URL for the uploaded file');
  }

  return {
    url,
    path,
  };
};

/**
 * Upload an image file to Supabase storage
 * Max file size: 5MB
 * Supported formats: PNG, JPEG, WebP, GIF, SVG
 */
export const uploadImageToStorage = async (options: UploadMediaOptions): Promise<UploadResult> => {
  const { file } = options;

  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image size exceeds the 5MB limit');
  }

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a valid image (PNG, JPG, WebP, GIF, or SVG).');
  }

  return uploadToStorage(options);
};

/**
 * Upload a video file to Supabase storage
 * Max file size: 50MB
 * Supported formats: MP4, MOV, AVI, WebM
 */
export const uploadVideoToStorage = async (options: UploadMediaOptions): Promise<UploadResult> => {
  const { file } = options;

  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error('Video size exceeds the 50MB limit');
  }

  if (!VALID_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a valid video (MP4, MOV, AVI, or WebM).');
  }

  return uploadToStorage(options);
};

/**
 * Legacy function - kept for backward compatibility
 * Automatically detects if file is image or video and applies appropriate limits
 * @deprecated Use uploadImageToStorage or uploadVideoToStorage instead
 */
export const uploadMediaToStorage = async (options: UploadMediaOptions): Promise<UploadResult> => {
  const { file } = options;

  if (!file) {
    throw new Error('No file provided for upload');
  }

  const isVideo = VALID_VIDEO_TYPES.includes(file.type);
  const isImage = VALID_IMAGE_TYPES.includes(file.type);

  if (!isVideo && !isImage) {
    throw new Error('Unsupported file type. Please upload a valid image or video.');
  }

  if (isVideo) {
    return uploadVideoToStorage(options);
  }

  return uploadImageToStorage(options);
};

// Type exports for backward compatibility
export type UploadImageToStorageOptions = UploadMediaOptions;
export type UploadImageResult = UploadResult;
