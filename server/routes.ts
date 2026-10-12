import express, { Request, Response } from 'express';
import { db } from './db';
import { RentalDuration } from '../src/types';

export const apiRouter = express.Router();

// 1. Get properties with full search & filtering
apiRouter.get('/properties', (req: Request, res: Response) => {
  try {
    const {
      city,
      neighborhood,
      category,
      duration,
      minPrice,
      maxPrice,
      rooms,
      guests,
      amenities,
      sortBy,
      query,
    } = req.query;

    const amenitiesArray = amenities
      ? typeof amenities === 'string'
        ? amenities.split(',')
        : (amenities as string[])
      : undefined;

    const properties = db.getProperties({
      city: city as string,
      neighborhood: neighborhood as string,
      category: category as string,
      duration: duration as RentalDuration,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rooms: rooms ? Number(rooms) : undefined,
      guests: guests ? Number(guests) : undefined,
      amenities: amenitiesArray,
      sortBy: sortBy as string,
      query: query as string,
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در بازیابی اقامتگاه‌ها.' });
  }
});

// 2. Get property by ID
apiRouter.get('/properties/:id', (req: Request, res: Response) => {
  try {
    const property = db.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'اقامتگاه مورد نظر یافت نشد.' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطای سرور در دریافت اطلاعات اقامتگاه.' });
  }
});

// 3. Authoritative server-side price calculation
apiRouter.post('/pricing/calculate', (req: Request, res: Response) => {
  try {
    const { propertyId, rentalDuration, unitsCount } = req.body;

    if (!propertyId || !rentalDuration || !unitsCount || unitsCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی برای محاسبه قیمت ناقص است.',
      });
    }

    const pricing = db.calculatePrice(propertyId, rentalDuration as RentalDuration, Number(unitsCount));
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'اقامتگاه یافت نشد.',
      });
    }

    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در محاسبه قیمت.' });
  }
});

// 4. Create booking with server-side validation
apiRouter.post('/bookings', (req: Request, res: Response) => {
  try {
    const { propertyId, guestInfo, rentalDuration, startDate, endDate, unitsCount, guestsCount } =
      req.body;

    if (!propertyId || !guestInfo?.fullName || !guestInfo?.phone || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'لطفا کلیه مشخصات تحویل‌گیرنده و تاریخ اقامت را تکمیل نمایید.',
      });
    }

    const result = db.createBooking({
      propertyId,
      guestInfo,
      rentalDuration: rentalDuration || 'daily',
      startDate,
      endDate,
      unitsCount: Number(unitsCount) || 1,
      guestsCount: Number(guestsCount) || 1,
    });

    if ('error' in result) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ثبت رزرو اقامتگاه.' });
  }
});

// 5. Get all bookings for current user
apiRouter.get('/bookings', (_req: Request, res: Response) => {
  try {
    const bookings = db.getBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست رزروها.' });
  }
});

// 6. Get single booking
apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'رزرو یافت نشد.' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت مشخصات رزرو.' });
  }
});

// 7. Cancel booking
apiRouter.post('/bookings/:id/cancel', (req: Request, res: Response) => {
  try {
    const result = db.cancelBooking(req.params.id);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    res.json({ success: true, message: 'رزرو با موفقیت لغو شد.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در لغو رزرو.' });
  }
});

// 8. Payment initiation & verification
apiRouter.post('/payments/verify', (req: Request, res: Response) => {
  try {
    const { bookingId, gateway, cardRef } = req.body;
    if (!bookingId || !gateway) {
      return res.status(400).json({ success: false, message: 'شناسه رزرو و درگاه نامعتبر است.' });
    }

    const result = db.verifyPayment(bookingId, gateway, cardRef);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: 'تراکنش شاپرک با موفقیت تایید شد و رزرو قطعی گردید.',
      data: result.booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در تایید تراکنش درگاه بانکی.' });
  }
});

// 9. Favorites
apiRouter.get('/favorites', (_req: Request, res: Response) => {
  try {
    const favIds = db.getFavorites();
    const favProperties = favIds
      .map((id) => db.getPropertyById(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
    res.json({ success: true, data: favProperties, ids: favIds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت نشان‌شده‌ها.' });
  }
});

apiRouter.post('/favorites/toggle', (req: Request, res: Response) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'شناسه اقامتگاه الزامی است.' });
    }
    const isAdded = db.toggleFavorite(propertyId);
    res.json({ success: true, isFavorited: isAdded, favorites: db.getFavorites() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی نشان‌شده‌ها.' });
  }
});

// 10. Reviews
apiRouter.get('/reviews', (req: Request, res: Response) => {
  try {
    const propertyId = req.query.propertyId as string | undefined;
    const reviews = db.getReviews(propertyId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت دیدگاه‌ها.' });
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const { propertyId, rating, comment } = req.body;
    if (!propertyId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'امتیاز و متن دیدگاه الزامی است.' });
    }

    const newReview = db.addReview({ propertyId, rating: Number(rating), comment });
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ثبت دیدگاه.' });
  }
});

// 11. Notifications
apiRouter.get('/notifications', (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: db.getNotifications() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت اعلان‌ها.' });
  }
});

apiRouter.post('/notifications/read-all', (_req: Request, res: Response) => {
  try {
    db.markAllNotificationsAsRead();
    res.json({ success: true, data: db.getNotifications() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در علامت‌گذاری اعلان‌ها.' });
  }
});

// 12. User Profile
apiRouter.get('/user/profile', (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: db.getUserProfile() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت مشخصات کاربر.' });
  }
});

apiRouter.put('/user/profile', (req: Request, res: Response) => {
  try {
    const updated = db.updateUserProfile(req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی مشخصات کاربر.' });
  }
});
