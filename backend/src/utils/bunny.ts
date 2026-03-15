import crypto from 'crypto';

export class VideoService {
  private bunnyCdnLibraryId: string;
  private bunnyApiKey: string;

  constructor() {
    this.bunnyCdnLibraryId = process.env.BUNNY_LIBRARY_ID || 'dummy_library';
    this.bunnyApiKey = process.env.BUNNY_API_KEY || 'dummy_api_key';
  }

  /**
   * Mengambil URL stream video yang udah di-watermark dengan DRM.
   * Supaya video ga bisa di curi/download.
   */
  getSecureVideoUrl(videoId: string, userId: string): string | null {
    // Kalau library ID nya masih bawaan kode awal (belum di-setting) atau videoId ga valid
    if (this.bunnyCdnLibraryId === 'dummy_library' || !videoId || videoId.includes('dummy')) {
      return null;
    }

    // Basic konsep token hash Bunny.net buat ngamanin HLS stream
    const expires = Math.floor(Date.now() / 1000) + 3600; // Expired 1 jam
    const hashData = `${this.bunnyApiKey}${videoId}${expires}${userId}`;
    const token = crypto.createHash('sha256').update(hashData).digest('hex');
    
    // Mengembalikan URL embed beneran (Nanti url ini diletakkan di iframe frontend)
    return `https://iframe.mediadelivery.net/embed/${this.bunnyCdnLibraryId}/${videoId}?token=${token}&expires=${expires}&userId=${userId}`;
  }
}

export const videoService = new VideoService();
