import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configurable path for the play icon
const DEFAULT_PLAY_ICON_PATH = path.join(process.cwd(), 'public', 'play-icon.png');

interface GenerateThumbnailOptions {
    input: string | Buffer;
    /** Standard output width, defaults to 1280 (720p 16:9) */
    width?: number;
    /** Standard output height, defaults to 720 */
    height?: number;
    /** Custom path to play icon, otherwise defaults to public/play-icon.png */
    /** Custom path to play icon, otherwise defaults to public/play-icon.png */
    playIconPath?: string;
    /** Percentage of duration to seek to (0.0 to 1.0), default 0.2 */
    seekPercentage?: number;
}

/**
 * Robustly generates a thumbnail from a video file/buffer.
 * 
 * Process:
 * 1. Probes video to find duration.
 * 2. Seeks to 20% of duration to avoid black frames.
 * 3. Extracts a frame using FFmpeg.
 * 4. Resizes to 16:9 (1280x720) using Sharp.
 * 5. Overlays a centered Play icon.
 * 6. Converts to optimized WebP format.
 */
export async function generateThumbnail(options: GenerateThumbnailOptions): Promise<Buffer> {
    const {
        input,
        width = 1280,
        height = 720,
        playIconPath = DEFAULT_PLAY_ICON_PATH,
        seekPercentage = 0.2
    } = options;

    let tempInputPath: string | null = null;
    const tempScreenshotPath = path.join(os.tmpdir(), `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.png`);

    try {
        // 1. Handle Input: Validate and ensure file path
        let inputPath = '';
        if (Buffer.isBuffer(input)) {
            tempInputPath = path.join(os.tmpdir(), `video_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
            await fs.promises.writeFile(tempInputPath, input);
            inputPath = tempInputPath;
        } else {
            if (!fs.existsSync(input)) {
                throw new Error(`Input file not found: ${input}`);
            }
            inputPath = input;
        }

        // 2. Probe Video Duration
        const duration = await new Promise<number>((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) return reject(new Error(`FFprobe failed: ${err.message}`));
                const durationSec = metadata.format.duration || 0;
                resolve(durationSec);
            });
        });

        if (!duration) {
            throw new Error('Could not determine video duration.');
        }

        // 3. Calculate Seek Time
        const seekTimestamp = duration * seekPercentage;

        // 4. Extract Frame using FFmpeg
        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .screenshots({
                    timestamps: [seekTimestamp],
                    filename: path.basename(tempScreenshotPath),
                    folder: path.dirname(tempScreenshotPath),
                    size: `${width}x${height}` // Let ffmpeg handle initial resize/aspect retrieval
                })
                .on('end', () => resolve())
                .on('error', (err) => reject(new Error(`FFmpeg screenshot failed: ${err.message}`)));
        });

        // 5. Process Image with Sharp (Overlay + WebP conversion)
        const frameBuffer = await fs.promises.readFile(tempScreenshotPath);
        let pipeline = sharp(frameBuffer)
            .resize(width, height, { fit: 'cover', position: 'center' }); // Ensure solid 16:9 fill

        // Overlay Play Icon if exists
        if (fs.existsSync(playIconPath)) {
            // We can resize the play icon relative to the thumbnail if needed, 
            // but for now we assume the PNG is sized appropriately or we let Sharp center it.
            // Let's create a composite input.
            // Optionally we could resize the play icon to be say 20% of height.
            // But user said "Assume local play-icon.png", simplistic overlay.
            pipeline = pipeline.composite([{
                input: playIconPath,
                gravity: 'center'
                // Note: If you need transparency adjustment on an opaque PNG, 
                // you'd need to process the icon separately.
                // We assume the PNG has the desired opacity/alpha.
            }]);
        } else {
            console.warn(`[generateThumbnail] Play icon not found at ${playIconPath}. Skipping overlay.`);
        }

        const outputBuffer = await pipeline
            .webp({ quality: 80, effort: 4 }) // Effort 4 is balanced
            .toBuffer();

        return outputBuffer;

    } catch (error: any) {
        console.error('[generateThumbnail] Error:', error);
        throw new Error(`Thumbnail generation failed: ${error.message}`);
    } finally {
        // Cleanup Temp Files
        const cleanup = async (p: string) => {
            try {
                if (fs.existsSync(p)) await fs.promises.unlink(p);
            } catch (e) { /* ignore */ }
        };

        if (tempInputPath) await cleanup(tempInputPath);
        await cleanup(tempScreenshotPath);
    }
}
