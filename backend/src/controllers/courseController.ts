import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { videoService } from '../utils/bunny';

// Buat course baru (Cuma Admin aja yang bisa, Role dicek di middleware)
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, description, price, isPremium, videoProviderId, thumbnailUrl, order } = req.body;

    // Validasi Field Penting
    if (!title || !slug) {
      res.status(400).json({ error: 'Title sama Slug jangan kosong bos.' });
      return;
    }

    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (existingCourse) {
      res.status(400).json({ error: 'Slug udah kepake buat course lain. Cari slug lain bro.' });
      return;
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        price,
        isPremium: isPremium ?? true,
        order: order ?? 1,
        videoProviderId,
        thumbnailUrl
      }
    });

    res.status(201).json({
      message: 'Mantap, Course baru udah rilis!',
      course: newCourse
    });

  } catch (error) {
    console.error('[Course Error]', error);
    res.status(500).json({ error: 'Ada error pas bikin course.' });
  }
};

// Ambil semua daftar course (Katalog) - Bisa dipanggil siapa aja
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        isPremium: true,
        order: true,
        thumbnailUrl: true
        // Sengaja gak di selct videoProviderId biar ga bocor ke publik
      }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('[Course Error]', error);
    res.status(500).json({ error: 'Gagal muat daftar course.' });
  }
};

// Ambil detail 1 course, sekaligus nyiapin Video Stream URL kalau user-nya berhak (VIP/Purchased)
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    const course = await prisma.course.findUnique({ where: { slug } });

    if (!course) {
      res.status(404).json({ error: 'Data course ga ketemu bos.' });
      return;
    }

    let secureVideoUrl = null;
    let hasAccess = false;

    // Cek Akses: Super Admin/Analyst langsung gas. Kalau VIP dapet akses premium gratis.
    // Atau kalau user biasa udah pernah beli (ada CourseAccess)
    if (['SUPER_ADMIN', 'ANALYST'].includes(userRole || '')) {
      hasAccess = true;
    } else if (course.isPremium && userRole === 'VIP_MEMBER') {
      hasAccess = true;
    } else if (!course.isPremium) {
      hasAccess = true; // Course gratis, open for all
    } else if (userId) {
      // Pengecekan beli / nggak
      const purchaseCheck = await prisma.courseAccess.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: course.id
          }
        }
      });
      if (purchaseCheck) hasAccess = true;
    }

    if (hasAccess && course.videoProviderId) {
      // Generate URL anti bajak via Bunny.net (Pake ID fake kalau dummy)
      secureVideoUrl = videoService.getSecureVideoUrl(course.videoProviderId, userId || 'GUEST');
    }

    res.status(200).json({
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        isPremium: course.isPremium,
        thumbnailUrl: course.thumbnailUrl,
        videoProviderId: hasAccess ? course.videoProviderId : null,
      },
      hasAccess,
      secureVideoUrl // Bakal NULL kalau user ga berhak (ngunci video playernya)
    });

  } catch (error) {
    console.error('[Course Error]', error);
    res.status(500).json({ error: 'Gagal muat detail subject ini.' });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id as string;
    await prisma.course.delete({ where: { id: courseId } });
    res.status(200).json({ message: 'Course berhasil dihapus dari muka bumi.' });
  } catch (error) {
    console.error('[Course Delete Error]', error);
    res.status(500).json({ error: 'Gagal ngehapus course.' });
  }
};

export const getCourseByIdForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id as string;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ error: 'Course ga ketemu.' });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('[Course Admin Get Error]', error);
    res.status(500).json({ error: 'Gagal ngambil data course.' });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id as string;
    const { title, slug, description, price, isPremium, videoProviderId, thumbnailUrl, order } = req.body;
    
    // Validasi singkat
    if (!title || !slug) {
      res.status(400).json({ error: 'Title sama Slug jangan kosong bos.' });
      return;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title, slug, description, price, 
        isPremium: isPremium ?? true, 
        order: order ?? 1, 
        videoProviderId, thumbnailUrl
      }
    });

    res.status(200).json({ message: 'Modul sukses di-update!', course: updatedCourse });
  } catch (error) {
    console.error('[Course Update Error]', error);
    res.status(500).json({ error: 'Gagal update course.' });
  }
};
