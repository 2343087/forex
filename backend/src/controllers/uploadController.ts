import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response): Promise<void> => {
  return new Promise((resolve) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nggak ada file gambar yang diupload nih bos.' });
        return resolve();
      }

      // Bangunin URL lengkap dari host server, misalnya: http://localhost:5000/uploads/file-123.jpg
      const protocol = req.protocol;
      const host = req.get('host');
      const filePath = `/uploads/${req.file.filename}`;
      const fullUrl = `${protocol}://${host}${filePath}`;

      res.status(200).json({
        message: 'Gambar sukses diupload',
        url: fullUrl
      });
      resolve();
    } catch (error) {
      console.error('[Upload Error]', error);
      res.status(500).json({ error: 'Gagal nge-save gambar.' });
      resolve();
    }
  });
};
