import { Property, Booking, Review, AppNotification, UserProfile, PricingBreakdown, RentalDuration } from '../src/types';

// In-memory persistent state (with initial seed data)
export class Database {
  private properties: Property[] = [];
  private bookings: Booking[] = [];
  private favorites: string[] = ['prop-1', 'prop-2']; // initial favorites
  private reviews: Review[] = [];
  private notifications: AppNotification[] = [];
  private currentUser: UserProfile = {
    id: 'user-default-1',
    fullName: 'سروش مهرابی',
    phone: '09123454567',
    nationalId: '0081234562',
    email: 'soroush.mehrabi@gmail.com',
    isVerified: true,
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    registeredDate: '۱۴۰۲/۰۷/۱۵',
  };

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    this.properties = [
      {
        id: 'prop-1',
        title: 'پنت‌هاوس نیاوران با دید البرز',
        subtitle: 'پنت‌هاوس دوبلکس با دید پانوراما به کوه‌های برفی البرز و شهر تهران',
        description: 'واحدی بی‌نظیر و استثنایی در طبقه دوازدهم برجی فاخر در نیاوران. دارای سالن پذیرایی مجلل با پنجره‌های قدی سرتاسری، آشپزخانه مجهز به تمامی لوازم مدرن، ۳ اتاق خواب کینگ مستر و تراس بزرگ با چشم‌انداز ۳۶۰ درجه البرز.',
        city: 'تهران',
        neighborhood: 'نیاوران',
        addressApprox: 'تهران، نیاوران (محدوده کاخ نیاوران)',
        category: 'penthouse',
        categoryLabel: 'پنت‌هاوس',
        rentalDurations: ['daily', 'monthly', 'yearly'],
        dailyPrice: 5800000,
        monthlyPrice: 145000000,
        yearlyDeposit: 1600000000,
        yearlyRent: 22000000,
        cleaningFee: 450000,
        stayDiscountPercent: 15,
        capacity: 6,
        bedrooms: 3,
        bedsDescription: '۳ تخت کینگ دونفره',
        bathrooms: 3,
        bathsDescription: '۲ مستر جکوزی‌دار + ۱ سرویس مهمان',
        area: 240,
        rating: 4.9,
        reviewsCount: 86,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MnUqpATaqFS4GK-vAYgwtCJ2oOBs1uYmPksxEBrP2VmlQRPBd6UAFuNYJcD7hU8rmbPdhca1VH11IHbRtx3JjwMLm3X4fvW92xUAs1u9QfGln7MVwXJMBxGP9C19hw1w0lqkedix4_ukVhvGLPlNBFvBKwrHYJl6_JeNryACSu8el6q0JB6U_e0ELRhY-7xXPJe8gle_ZbYFjrcKZmsySPiWqLH7gqCZI-80UEkvcFk3plOPhcu5',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXUC15wX4N5ttQOdhak16dPTn5kKiJScfnuEpkTtWmAjGnwUXfQeOlI76hDMWNaoUy0RhoqI-hP5J0WkJXq0c2LIBYJzFN5yEPQSQpF4kxoKEVItwGLihaDFmBc3D6tWlALQjhfPZZyKUjmm7-lLnJnAbn4Rn638mKKr5ZWRaGEOLM8WQBMW7Y9N0Dpyi0DcFBIJ86mRCkQybrz2Q50zswm5dAO-yzbhfwZ1nW0CKtC6qANOg0NAp',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBify-CjKdeAEQtmCNdEgTViVwz224NHpNDTRAY96yngWq1i2cifCKBYHSpmO81hU7Mex46_GaOVQ-LRTzl_bVRTHbBBEF-H4PruaZbzEdcFbEKTJycupX9d8VigYzkNjLeHcBca7EzIhCj4j-48zlvFiTFWjtVrinCWnE1tN46VeTxEKQqc4PgogTpO32pum_Yvlr8GhJPLEMgkp87vlVP8N8woAuezWBPxmUlrDsGnrCGMLgEr0Xc',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhZ5aiZ2tw61THIIZs7KqUhqSO7YNLCi5WD58xCBcsgKaXFZo5LPEdie0lVdeA0n-ubkwvTyUUmNF3dlfSgp0JKunQuKDyJRndBBcxMas61kiH8L38GICYbwdU8IcIogn4tHp3faFy_7rg4zHNzScGf6wxChcumx7Zoo7M3KMGD6mGoGvcmPZhwyMF5AWbmhvE6tQeWsuOfHnEOlwi5jxnyHwyrWK5LlqhoAgRMm237i0CZHvluNS',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBv0VY2Jptny-aRs1B6m5KTFveGA14p_uiCW5w2A8jGj_zXdw-9tQmgyFs38cRuZoiq_lqDLdJmaUwFIHvuzGerU4ASb7hfzHiK_5V5mvzeyEscD8ViLPoL4gg5LMS6w8A4v9teHBm7rksJYkgU96aTv0E837N0Qp9xENmtc89LHpsL_mPmns3iD3BZ6Ihus6dU9_pMjrJPl81lWZZUiN52m_yvMbtYQ2gu62Eac_kMfLe_-0_KPXBT',
        ],
        amenities: [
          { id: 'wifi', name: 'اینترنت پرسرعت فیبر نوری', icon: 'wifi' },
          { id: 'parking', name: '۲ پارکینگ سندی اختصاصی', icon: 'directions_car' },
          { id: 'pool', name: 'استخر آب‌گرم و سونا', icon: 'pool' },
          { id: 'hvac', name: 'تهویه چیلر مرکزی فن‌کوئل', icon: 'hvac' },
          { id: 'kitchen', name: 'آشپزخانه فول فرنیش بوش', icon: 'countertops' },
          { id: 'security', name: 'نگهبانی و لابی‌من ۲۴ ساعته', icon: 'security' },
        ],
        host: {
          id: 'host-1',
          name: 'مهندس علیرضا راد',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTicPOtW1fNbl2XOK_aa4zNvP5Q_gGLAogtp589HPHrxCGpDCDU5CUdonZASjJzsDWqn05wTDwB0c43qJY-X4G9kipFzNkMd5iqmXYvWnyDhUkpRPa60lD7wiPoJhLPigs2my76BS9DtXlZnTqDecIamjccj2mfHZwwPw2EJgKb2zuCbvdaSIG7FyMyEDiKAoQGWlvebX8vsThJLgmXAht0MSi8sxahFGBViGD6TGB3mApb4KtBGB1',
          isSuperhost: true,
          responseRate: '۱۰۰٪',
          phoneMasked: '۰۹۱۲***۸۸۹۹',
          propertiesCount: 4,
        },
        houseRules: {
          checkIn: '۱۴:۰۰',
          checkOut: '۱۲:۰۰',
          rules: [
            'استعمال دخانیات فقط در تراس مجاز است',
            'پذیرش حیوانات خانگی با هماهنگی قبلی',
            'لغو رایگان تا ۴۸ ساعت پیش از تحویل اقامتگاه',
            'برگزاری مهمانی و جشن با هماهنگی مدیریت ساختمان امکان‌پذیر است',
          ],
        },
        cancellationPolicy: 'لغو رایگان تا ۴۸ ساعت پیش از ورود؛ بازگشت ۱۰۰٪ وجه بدون کسر جریمه.',
        location: {
          lat: 35.8174,
          lng: 51.4728,
          approxAreaName: 'محدوده کاخ نیاوران، منطقه ۱ تهران',
        },
        blockedDates: ['2026-10-10', '2026-10-11', '2026-10-22'],
        isFeatured: true,
      },
      {
        id: 'prop-2',
        title: 'عمارت مبله نیاوران با استخر و جکوزی اختصاصی',
        subtitle: 'اقامتگاهی آرام، لوکس و دلباز با دیزاین معاصر و حیاط مشجر اختصاصی',
        description: 'اقامتگاهی آرام، لوکس و دلباز با دیزاین معاصر، دید کامل به رشته‌کوه‌های البرز و حیاط مشجر اختصاصی در یکی از اصیل‌ترین خیابان‌های نیاوران. دسترسی سریع به مراکز تجاری روشا و اطلس مال.',
        city: 'تهران',
        neighborhood: 'نیاوران',
        addressApprox: 'تهران، نیاوران (محدوده کاخ)',
        category: 'villa',
        categoryLabel: 'ویلا',
        rentalDurations: ['daily', 'monthly', 'yearly'],
        dailyPrice: 6500000,
        monthlyPrice: 155000000,
        yearlyDeposit: 1700000000,
        yearlyRent: 28000000,
        cleaningFee: 500000,
        stayDiscountPercent: 15,
        capacity: 6,
        bedrooms: 3,
        bedsDescription: '۳ تخت کینگ مستر',
        bathrooms: 2,
        bathsDescription: '۲ مستر جکوزی',
        area: 210,
        rating: 4.94,
        reviewsCount: 48,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBVZlXV63SPkEv8tmzvvQOx5gt1ZUSCmYLJEPjU2TEyM3iE7KgxewxeOESX1AQtqftbPHItENqWjpaIeuT1YIEL-GBCD3vQbI_FHneJgpmhtLyKggpLc_CT9ODfWsfsV4TbPrhZ5zHeSpM7PlbbpqyNpScKYboIUj7w2Ax0vQo-6wFqPooB2TeTqm64LsN5q3SUrqtiEENsyL__xyGROdXnZExvY8H3mhQ6Ts2Mvtx6v9rFKe3inyh1',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCb6weiON_wGVsm1BAmqv-e67Nc3lzs0Gf1Zzkz4-379naWJSuqlXExA2EsQ0RWeiLfUgIrFKXIgvzp8GZuiKCOEW5MTkNXEfmjkWJUfzHHxTWONK4poRn-r_-W8n1CGjXNZYGDyCR8EzAvb_JKF_XpxLS2uo2ZVDXms86TLIA9U82hHW8Mqao17QJrN_0KXd-csvWwr7SphXj8D7ZpOSB1iB7zhuULbXr17HtE6TM0QDx95g--R2fC',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXUC15wX4N5ttQOdhak16dPTn5kKiJScfnuEpkTtWmAjGnwUXfQeOlI76hDMWNaoUy0RhoqI-hP5J0WkJXq0c2LIBYJzFN5yEPQSQpF4kxoKEVItwGLihaDFmBc3D6tWlALQjhfPZZyKUjmm7-lLnJnAbn4Rn638mKKr5ZWRaGEOLM8WQBMW7Y9N0Dpyi0DcFBIJ86mRCkQybrz2Q50zswm5dAO-yzbhfwZ1nW0CKtC6qANOg0NAp',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBify-CjKdeAEQtmCNdEgTViVwz224NHpNDTRAY96yngWq1i2cifCKBYHSpmO81hU7Mex46_GaOVQ-LRTzl_bVRTHbBBEF-H4PruaZbzEdcFbEKTJycupX9d8VigYzkNjLeHcBca7EzIhCj4j-48zlvFiTFWjtVrinCWnE1tN46VeTxEKQqc4PgogTpO32pum_Yvlr8GhJPLEMgkp87vlVP8N8woAuezWBPxmUlrDsGnrCGMLgEr0Xc',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBv0VY2Jptny-aRs1B6m5KTFveGA14p_uiCW5w2A8jGj_zXdw-9tQmgyFs38cRuZoiq_lqDLdJmaUwFIHvuzGerU4ASb7hfzHiK_5V5mvzeyEscD8ViLPoL4gg5LMS6w8A4v9teHBm7rksJYkgU96aTv0E837N0Qp9xENmtc89LHpsL_mPmns3iD3BZ6Ihus6dU9_pMjrJPl81lWZZUiN52m_yvMbtYQ2gu62Eac_kMfLe_-0_KPXBT',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhZ5aiZ2tw61THIIZs7KqUhqSO7YNLCi5WD58xCBcsgKaXFZo5LPEdie0lVdeA0n-ubkwvTyUUmNF3dlfSgp0JKunQuKDyJRndBBcxMas61kiH8L38GICYbwdU8IcIogn4tHp3faFy_7rg4zHNzScGf6wxChcumx7Zoo7M3KMGD6mGoGvcmPZhwyMF5AWbmhvE6tQeWsuOfHnEOlwi5jxnyHwyrWK5LlqhoAgRMm237i0CZHvluNS',
        ],
        amenities: [
          { id: 'wifi', name: 'اینترنت فیبر نوری', icon: 'wifi' },
          { id: 'parking', name: '۲ پارکینگ سندی', icon: 'directions_car' },
          { id: 'pool', name: 'استخر آب‌گرم و سونا', icon: 'pool' },
          { id: 'hvac', name: 'تهویه چیلر مرکزی', icon: 'hvac' },
          { id: 'kitchen', name: 'آشپزخانه فول فرنیش', icon: 'countertops' },
          { id: 'security', name: 'نگهبانی ۲۴ ساعته', icon: 'security' },
        ],
        host: {
          id: 'host-1',
          name: 'مهندس علیرضا راد',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTicPOtW1fNbl2XOK_aa4zNvP5Q_gGLAogtp589HPHrxCGpDCDU5CUdonZASjJzsDWqn05wTDwB0c43qJY-X4G9kipFzNkMd5iqmXYvWnyDhUkpRPa60lD7wiPoJhLPigs2my76BS9DtXlZnTqDecIamjccj2mfHZwwPw2EJgKb2zuCbvdaSIG7FyMyEDiKAoQGWlvebX8vsThJLgmXAht0MSi8sxahFGBViGD6TGB3mApb4KtBGB1',
          isSuperhost: true,
          responseRate: '۱۰۰٪',
          phoneMasked: '۰۹۱۲***۸۸۹۹',
          propertiesCount: 4,
        },
        houseRules: {
          checkIn: '۱۴:۰۰',
          checkOut: '۱۲:۰۰',
          rules: [
            'استعمال دخانیات فقط در بالکن',
            'پذیرش حیوانات خانگی با هماهنگی قبلی',
            'لغو رایگان تا ۴۸ ساعت پیش از تحویل',
          ],
        },
        cancellationPolicy: 'لغو رایگان تا ۴۸ ساعت پیش از تحویل اقامتگاه.',
        location: {
          lat: 35.8152,
          lng: 51.4682,
          approxAreaName: 'محدوده تقریبی نیاوران، تهران',
        },
        blockedDates: ['2026-10-15', '2026-10-16'],
        isFeatured: true,
      },
      {
        id: 'prop-3',
        title: 'آپارتمان دیپلماتیک ولنجک',
        subtitle: 'آپارتمان نوساز با نورگیر عالی و دسترسی اختصاصی به بام تهران',
        description: 'واحدی دنج و بسیار آرام در طبقات بالای برجی آرام در ولنجک، دیزاین مبلمان مدرن، تراس مشرف به دره درکه و هوای خنک کوهپایه.',
        city: 'تهران',
        neighborhood: 'ولنجک',
        addressApprox: 'تهران، ولنجک (نزدیک به بلوار دانشجو)',
        category: 'apartment',
        categoryLabel: 'آپارتمان',
        rentalDurations: ['daily', 'monthly', 'yearly'],
        dailyPrice: 3400000,
        monthlyPrice: 85000000,
        yearlyDeposit: 950000000,
        yearlyRent: 15000000,
        cleaningFee: 350000,
        stayDiscountPercent: 12,
        capacity: 4,
        bedrooms: 2,
        bedsDescription: '۲ اتاق خواب دبل',
        bathrooms: 2,
        bathsDescription: '۱ مستر + ۱ مهمان',
        area: 145,
        rating: 4.85,
        reviewsCount: 42,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTasakh1_Wq3C5TM8U0KhyixAakG0RRY6dZiRGE8wQFVpyHAHLBKb8uQSKvFU3xUQZQTzXw0lA6Fsz_m3Czrt82Oodg9GeoOd0AhdlNnsmpZK9x-dH9ROnuNdJXJOosvNhMha8dtJso7F5NM8Z2-aU-sUs1uuoR6egGDGgcgXCMu79RwwMte4NxjPPIjo2i2sRlWzyhO0k0_csu7AslAHLEB7tjFWpWdkABjZlwK5gAoWNt9n-MmD',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXUC15wX4N5ttQOdhak16dPTn5kKiJScfnuEpkTtWmAjGnwUXfQeOlI76hDMWNaoUy0RhoqI-hP5J0WkJXq0c2LIBYJzFN5yEPQSQpF4kxoKEVItwGLihaDFmBc3D6tWlALQjhfPZZyKUjmm7-lLnJnAbn4Rn638mKKr5ZWRaGEOLM8WQBMW7Y9N0Dpyi0DcFBIJ86mRCkQybrz2Q50zswm5dAO-yzbhfwZ1nW0CKtC6qANOg0NAp',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBify-CjKdeAEQtmCNdEgTViVwz224NHpNDTRAY96yngWq1i2cifCKBYHSpmO81hU7Mex46_GaOVQ-LRTzl_bVRTHbBBEF-H4PruaZbzEdcFbEKTJycupX9d8VigYzkNjLeHcBca7EzIhCj4j-48zlvFiTFWjtVrinCWnE1tN46VeTxEKQqc4PgogTpO32pum_Yvlr8GhJPLEMgkp87vlVP8N8woAuezWBPxmUlrDsGnrCGMLgEr0Xc',
        ],
        amenities: [
          { id: 'wifi', name: 'اینترنت وای‌فای ۵G', icon: 'wifi' },
          { id: 'parking', name: 'پارکینگ مسقف با ریموت', icon: 'directions_car' },
          { id: 'elevator', name: '۲ لاین آسانسور شیندلر', icon: 'elevator' },
          { id: 'kitchen', name: 'ماکروویو و قهوه‌ساز اسپرسو', icon: 'coffee_maker' },
          { id: 'tv', name: 'تلویزیون ۶۵ اینچ هوشمند', icon: 'tv' },
        ],
        host: {
          id: 'host-2',
          name: 'خانم دکتر کاشانی',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          isSuperhost: true,
          responseRate: '۹۹٪',
          phoneMasked: '۰۹۳۵***۱۲۰۲',
          propertiesCount: 2,
        },
        houseRules: {
          checkIn: '۱۵:۰۰',
          checkOut: '۱۲:۰۰',
          rules: ['محیط خانوادگی و آرام', 'عدم ایجاد سر و صدا بعد از ۲۳:۰۰'],
        },
        cancellationPolicy: 'لغو با استرداد کامل تا ۳ روز قبل از موعد ورود.',
        location: {
          lat: 35.808,
          lng: 51.405,
          approxAreaName: 'ولنجک، تهران',
        },
        blockedDates: [],
      },
      {
        id: 'prop-4',
        title: 'سوئیت مدرن شهرک غرب',
        subtitle: 'سوئیت مجهز و دنج مناسب سفرهای کاری، درمانی و اقامت‌های کوتاه',
        description: 'سوئیت طراحی‌شده توسط مهندسان دکوراسیون داخلی با میز کار ارگونومیک، سرویس خواب طبی، تجهیزات آشپزخانه کامل، در چند قدمی بلوار دادمان و مرکز خرید پلاتین.',
        city: 'تهران',
        neighborhood: 'شهرک غرب',
        addressApprox: 'تهران، شهرک غرب (بلوار دادمان)',
        category: 'apartment',
        categoryLabel: 'آپارتمان',
        rentalDurations: ['daily', 'monthly'],
        dailyPrice: 2100000,
        monthlyPrice: 52000000,
        yearlyDeposit: 600000000,
        yearlyRent: 10000000,
        cleaningFee: 250000,
        stayDiscountPercent: 10,
        capacity: 3,
        bedrooms: 1,
        bedsDescription: '۱ تخت دبل + کاناپه تخت‌خواب‌شو',
        bathrooms: 1,
        bathsDescription: 'سرویس ایرانی و فرنگی',
        area: 75,
        rating: 4.92,
        reviewsCount: 112,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuANThjUeN8r4XbxQIv5bdHuLa3Ua9yJlwvI6PlYZ4AndAtmFtryWLswPaUwRcML7GVyievQkPUDSLcYRkWMIRd-2bjt2SA5ZVJzvqrqpXkjJLg3l3ybQrIXRvFqnkNDOkQADnQQLJAkgmRSeBHbPQMZcgVPIomN5cLeRi87HKGd9q0Kn4IVKmmd4lLicGvNmcztLibfxZaoq1WI4_u1asGQ165Ogp1obnHAZga5uF3dIxsMmGbhU8wT',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCb6weiON_wGVsm1BAmqv-e67Nc3lzs0Gf1Zzkz4-379naWJSuqlXExA2EsQ0RWeiLfUgIrFKXIgvzp8GZuiKCOEW5MTkNXEfmjkWJUfzHHxTWONK4poRn-r_-W8n1CGjXNZYGDyCR8EzAvb_JKF_XpxLS2uo2ZVDXms86TLIA9U82hHW8Mqao17QJrN_0KXd-csvWwr7SphXj8D7ZpOSB1iB7zhuULbXr17HtE6TM0QDx95g--R2fC',
        ],
        amenities: [
          { id: 'desk', name: 'میز کار اداری با صندلی ارگونومیک', icon: 'desk' },
          { id: 'wifi', name: 'اینترنت رایگان نامحدود', icon: 'wifi' },
          { id: 'parking', name: 'پارکینگ در محوطه حیاط', icon: 'local_parking' },
          { id: 'ac', name: 'اسپلیت سرمایش و گرمایش', icon: 'ac_unit' },
        ],
        host: {
          id: 'host-3',
          name: 'آقای شمس',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          isSuperhost: false,
          responseRate: '۹۷٪',
          phoneMasked: '۰۹۱۲***۷۷۱۱',
          propertiesCount: 1,
        },
        houseRules: {
          checkIn: '۱۴:۰۰',
          checkOut: '۱۲:۰۰',
          rules: ['ارائه کارت شناسایی معتبر الزامی است', 'نظافت هنگام تحویل مورد توجه است'],
        },
        cancellationPolicy: 'لغو رایگان تا ۲۴ ساعت قبل از ورود.',
        location: {
          lat: 35.758,
          lng: 51.365,
          approxAreaName: 'شهرک غرب، منطقه ۲ تهران',
        },
        blockedDates: [],
      },
      {
        id: 'prop-5',
        title: 'ویلا دوبلکس استخردار کردان',
        subtitle: 'ویلای لوکس باغی با استخر چهارفصل روباز، جکوزی و آلاچیق باربیکیو',
        description: 'ویلای مدرن در شهرک خصوصی و امن کردان، دارای استخر آب‌گرم مجهز به تصفیه ۲۴ ساعته، سیستم صوتی حرفه‌ای، محوطه سبز اختصاصی با درختان میوه و روف‌گاردن با آتشدان.',
        city: 'البرز',
        neighborhood: 'کردان',
        addressApprox: 'البرز، کردان (شهرک طاووسیه)',
        category: 'villa',
        categoryLabel: 'ویلا',
        rentalDurations: ['daily', 'monthly'],
        dailyPrice: 6200000,
        monthlyPrice: 130000000,
        yearlyDeposit: 1400000000,
        yearlyRent: 20000000,
        cleaningFee: 600000,
        stayDiscountPercent: 15,
        capacity: 8,
        bedrooms: 4,
        bedsDescription: '۴ اتاق خواب کینگ + تشک‌های اضافه سنتی',
        bathrooms: 3,
        bathsDescription: '۲ مستر فرنگی و جکوزی',
        area: 450,
        rating: 4.95,
        reviewsCount: 64,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDb43HUYmkX8MALDo5C85BCAakQCewMzyi9YKiVTEjvrBif9yXspYXqqMZKTNCilxpBpZBdglxewl090w_XjZi-Dqhl9mbPAURPbq_V5rNOaYN2uGBjA-OcrtvizB_Ici__KFdvlMtnJV8QHv9PLzPmzf3ccURO_cuQwMyNv2C8o31P5ZnD446OOZWw1SrsaX_aGIO3BhjHaMLTap0E6wYWCpSdQVXBq4vUEMefH6XnqWQCTgKg9FJ0',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBv0VY2Jptny-aRs1B6m5KTFveGA14p_uiCW5w2A8jGj_zXdw-9tQmgyFs38cRuZoiq_lqDLdJmaUwFIHvuzGerU4ASb7hfzHiK_5V5mvzeyEscD8ViLPoL4gg5LMS6w8A4v9teHBm7rksJYkgU96aTv0E837N0Qp9xENmtc89LHpsL_mPmns3iD3BZ6Ihus6dU9_pMjrJPl81lWZZUiN52m_yvMbtYQ2gu62Eac_kMfLe_-0_KPXBT',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBVZlXV63SPkEv8tmzvvQOx5gt1ZUSCmYLJEPjU2TEyM3iE7KgxewxeOESX1AQtqftbPHItENqWjpaIeuT1YIEL-GBCD3vQbI_FHneJgpmhtLyKggpLc_CT9ODfWsfsV4TbPrhZ5zHeSpM7PlbbpqyNpScKYboIUj7w2Ax0vQo-6wFqPooB2TeTqm64LsN5q3SUrqtiEENsyL__xyGROdXnZExvY8H3mhQ6Ts2Mvtx6v9rFKe3inyh1',
        ],
        amenities: [
          { id: 'pool', name: 'استخر روباز آب‌گرم ۴ فصل', icon: 'pool' },
          { id: 'bbq', name: 'باربیکیو و آتشدان گازی', icon: 'outdoor_grill' },
          { id: 'parking', name: 'فضای پارک ۴ خودرو', icon: 'directions_car' },
          { id: 'billiards', name: 'میز بیلیارد اسنوکر', icon: 'sports_bar' },
        ],
        host: {
          id: 'host-4',
          name: 'مهندس بهرامی',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          isSuperhost: true,
          responseRate: '۱۰۰٪',
          phoneMasked: '۰۹۱۲***۶۳۲۱',
          propertiesCount: 3,
        },
        houseRules: {
          checkIn: '۱۴:۰۰',
          checkOut: '۱۲:۰۰',
          rules: ['رعایت نظافت آب استخر', 'تحویل کارت ملی هوشمند'],
        },
        cancellationPolicy: 'لغو با استرداد ۹۰٪ تا ۵ روز قبل از اقامت.',
        location: {
          lat: 35.952,
          lng: 50.841,
          approxAreaName: 'کردان، استان البرز',
        },
        blockedDates: [],
      },
      {
        id: 'prop-6',
        title: 'کلبه سوییسی چوبی نمک‌آبرود',
        subtitle: 'کلبه مثلثی چوبی در دل جنگل‌های هیرکانی با تراس معلق و ویو اقیانوس ابر',
        description: 'تجربه‌ای رویایی در آرامش جنگل با تمامی امکانات شهری، شومینه هیزمی، بالکن مشرف به درختان افرا و دسترسی ۱۰ دقیقه‌ای به تله‌کابین نمک‌آبرود.',
        city: 'مازندران',
        neighborhood: 'نمک‌آبرود',
        addressApprox: 'مازندران، نمک‌آبرود (جاده جنگلی)',
        category: 'cottage',
        categoryLabel: 'کلبه',
        rentalDurations: ['daily', 'monthly'],
        dailyPrice: 2800000,
        monthlyPrice: 65000000,
        yearlyDeposit: 700000000,
        yearlyRent: 12000000,
        cleaningFee: 300000,
        stayDiscountPercent: 10,
        capacity: 5,
        bedrooms: 2,
        bedsDescription: '۱ تخت دبل در بهارخواب + ۳ رخت‌خواب سنتی',
        bathrooms: 1,
        bathsDescription: 'سرویس ایرانی و فرنگی',
        area: 95,
        rating: 4.96,
        reviewsCount: 79,
        images: [
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: [
          { id: 'fireplace', name: 'شومینه هیزمی با چوب آماده', icon: 'fireplace' },
          { id: 'view', name: 'چشم‌انداز اختصاصی جنگل هیرکانی', icon: 'nature' },
          { id: 'wifi', name: 'مودم سیمکارتی پرسرعت', icon: 'wifi' },
        ],
        host: {
          id: 'host-5',
          name: 'آقای مرادی',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          isSuperhost: true,
          responseRate: '۱۰۰٪',
          phoneMasked: '۰۹۱۱***۵۴۳۲',
          propertiesCount: 2,
        },
        houseRules: {
          checkIn: '۱۴:۰۰',
          checkOut: '۱۲:۰۰',
          rules: ['روشن کردن آتش فقط در محوطه مشخص شده باربیکیو مجاز است'],
        },
        cancellationPolicy: 'لغو رایگان تا ۷۲ ساعت پیش از تحویل.',
        location: {
          lat: 36.671,
          lng: 51.302,
          approxAreaName: 'جنگل‌های نمک‌آبرود',
        },
        blockedDates: [],
      },
    ];

    this.reviews = [
      {
        id: 'rev-1',
        propertyId: 'prop-1',
        userId: 'u-1',
        userName: 'سهراب کاظمی',
        rating: 5,
        comment: 'واحد بسیار تمیزتر از حد انتظار بود. چشم‌انداز تراس عالی و همه موارد آماده تحویل بود. پشتیبانی میزبان هم فوق‌العاده سریع و حرفه‌ای بود.',
        date: 'اردیبهشت ۱۴۰۳',
      },
      {
        id: 'rev-2',
        propertyId: 'prop-1',
        userId: 'u-2',
        userName: 'مریم صالحی',
        rating: 4.9,
        comment: 'اقامتی خاطره‌انگیز و لوکس. استخر بسیار تمیز و آب‌گرم با کیفیت بود. حتما در سفرهای بعدی هم همین واحد رو انتخاب می‌کنیم.',
        date: 'فروردین ۱۴۰۳',
      },
      {
        id: 'rev-3',
        propertyId: 'prop-2',
        userId: 'u-3',
        userName: 'امیرحسین رضوی',
        rating: 5,
        comment: 'دیزاین داخلی فوق‌العاده مدرن، آرامش مطلق محله و برخورد عالی جناب مهندس راد. ارزش تک تک ریال‌های پرداختی رو داشت.',
        date: 'خرداد ۱۴۰۳',
      },
    ];

    this.notifications = [
      {
        id: 'notif-1',
        title: 'تخفیف ویژه اقامت‌های طولانی',
        message: 'برای اقامت‌های بیش از ۳ شب، ۱۵٪ تخفیف خودکار به صورت نقدی در فاکتور شما لحاظ خواهد شد.',
        type: 'system',
        read: false,
        createdAt: 'امروز، ۱۰:۳۰',
      },
      {
        id: 'notif-2',
        title: 'به پلتفرم آشیانه خوش آمدید',
        message: 'تمامی پرداخت‌ها در آشیانه از طریق درگاه رسمی شاپرک بانک مرکزی جمهوری اسلامی ایران محافظت می‌شوند.',
        type: 'system',
        read: true,
        createdAt: 'دیروز، ۱۵:۰۰',
      },
    ];
  }

  public getProperties(filters: {
    city?: string;
    neighborhood?: string;
    category?: string;
    duration?: RentalDuration;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
    guests?: number;
    amenities?: string[];
    sortBy?: string;
    query?: string;
  }): Property[] {
    let result = [...this.properties];

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== 'همه' && filters.city !== 'all') {
      result = result.filter((p) => p.city.includes(filters.city!));
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.duration) {
      result = result.filter((p) => p.rentalDurations.includes(filters.duration!));
    }

    if (filters.rooms && filters.rooms > 0) {
      result = result.filter((p) => p.bedrooms >= filters.rooms!);
    }

    if (filters.guests && filters.guests > 0) {
      result = result.filter((p) => p.capacity >= filters.guests!);
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.dailyPrice >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.dailyPrice <= filters.maxPrice!);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities!.every((amenityId) => p.amenities.some((a) => a.id === amenityId))
      );
    }

    if (filters.sortBy === 'priceAsc') {
      result.sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (filters.sortBy === 'priceDesc') {
      result.sort((a, b) => b.dailyPrice - a.dailyPrice);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }

  public getPropertyById(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  public calculatePrice(
    propertyId: string,
    duration: RentalDuration,
    unitsCount: number
  ): PricingBreakdown | null {
    const property = this.getPropertyById(propertyId);
    if (!property) return null;

    let unitPrice = 0;
    let subtotal = 0;
    let discountAmount = 0;
    const cleaningFee = property.cleaningFee;
    const guaranteeFee = 0; // Free guarantee

    if (duration === 'daily') {
      unitPrice = property.dailyPrice;
      subtotal = unitPrice * unitsCount;
      if (unitsCount >= 3) {
        discountAmount = Math.round(subtotal * (property.stayDiscountPercent / 100));
      }
    } else if (duration === 'monthly') {
      unitPrice = property.monthlyPrice;
      subtotal = unitPrice * unitsCount;
      if (unitsCount >= 3) {
        discountAmount = Math.round(subtotal * 0.08); // 8% off for 3+ months
      }
    } else if (duration === 'yearly') {
      // Yearly deposit + rent
      unitPrice = property.yearlyDeposit;
      subtotal = property.yearlyDeposit + property.yearlyRent * 12;
      discountAmount = 0;
    }

    const totalAmount = subtotal - discountAmount + (duration === 'daily' ? cleaningFee : 0);

    return {
      rentalDuration: duration,
      unitsCount,
      unitPrice,
      subtotal,
      discountAmount,
      cleaningFee: duration === 'daily' ? cleaningFee : 0,
      guaranteeFee,
      totalAmount,
    };
  }

  public createBooking(bookingData: {
    propertyId: string;
    guestInfo: { fullName: string; phone: string; nationalId: string; notes?: string };
    rentalDuration: RentalDuration;
    startDate: string;
    endDate: string;
    unitsCount: number;
    guestsCount: number;
  }): Booking | { error: string } {
    const property = this.getPropertyById(bookingData.propertyId);
    if (!property) return { error: 'اقامتگاه مورد نظر یافت نشد.' };

    if (bookingData.guestsCount > property.capacity) {
      return { error: `ظرفیت این اقامتگاه حداکثر ${property.capacity} نفر است.` };
    }

    const pricing = this.calculatePrice(
      bookingData.propertyId,
      bookingData.rentalDuration,
      bookingData.unitsCount
    );

    if (!pricing) return { error: 'خطا در محاسبه هزینه اقامتگاه.' };

    const bookingId = 'book-' + Date.now();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `ASH-${randomCode}`;

    const newBooking: Booking = {
      id: bookingId,
      bookingCode,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      propertyLocation: property.addressApprox,
      userId: this.currentUser.id,
      guestInfo: bookingData.guestInfo,
      rentalDuration: bookingData.rentalDuration,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      unitsCount: bookingData.unitsCount,
      guestsCount: bookingData.guestsCount,
      pricing,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);

    // Add notification
    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      title: 'رزرو در انتظار پرداخت ایجاد شد',
      message: `پیش‌فاکتور رزرو ${property.title} با شناسه ${bookingCode} صادر گردید. جهت نهایی‌سازی لطفا از درگاه شاپرک اقدام نمایید.`,
      type: 'booking',
      read: false,
      createdAt: 'لحظاتی پیش',
      linkId: bookingId,
    });

    return newBooking;
  }

  public verifyPayment(
    bookingId: string,
    gateway: 'mellat' | 'zarinpal' | 'saman',
    cardRef?: string
  ): { success: boolean; booking?: Booking; error?: string } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'رزرو یافت نشد.' };

    if (booking.paymentStatus === 'paid') {
      return { success: true, booking };
    }

    const trackingCode = `${Math.floor(10000000 + Math.random() * 90000000)}`;
    const referenceNumber = cardRef || `SHP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.gateway = gateway;
    booking.trackingCode = trackingCode;
    booking.referenceNumber = referenceNumber;
    booking.paidAt = new Date().toISOString();

    // Add confirmation notification
    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      title: 'پرداخت موفق شاپرک و تایید قطعی رزرو',
      message: `پرداخت به مبلغ ${booking.pricing.totalAmount.toLocaleString('fa-IR')} تومان با کد رهگیری شاپرک ${trackingCode} تایید و اقامت شما نهایی شد.`,
      type: 'payment',
      read: false,
      createdAt: 'لحظاتی پیش',
      linkId: booking.id,
    });

    return { success: true, booking };
  }

  public cancelBooking(bookingId: string): { success: boolean; error?: string } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'رزرو یافت نشد.' };

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      title: 'لغو رزرو اقامتگاه',
      message: `رزرو شناسه ${booking.bookingCode} لغو گردید. وجه پرداختی مطابق مقررات لغو حداکثر تا ۲۴ ساعت آینده به شماره شبا واریز خواهد شد.`,
      type: 'booking',
      read: false,
      createdAt: 'لحظاتی پیش',
      linkId: booking.id,
    });

    return { success: true };
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  public getFavorites(): string[] {
    return this.favorites;
  }

  public toggleFavorite(propertyId: string): boolean {
    const index = this.favorites.indexOf(propertyId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      return false; // removed
    } else {
      this.favorites.push(propertyId);
      return true; // added
    }
  }

  public getReviews(propertyId?: string): Review[] {
    if (propertyId) {
      return this.reviews.filter((r) => r.propertyId === propertyId);
    }
    return this.reviews;
  }

  public addReview(reviewData: { propertyId: string; rating: number; comment: string }): Review {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      propertyId: reviewData.propertyId,
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: 'لحظاتی پیش',
    };
    this.reviews.unshift(newReview);

    // Update property rating & reviews count
    const prop = this.getPropertyById(reviewData.propertyId);
    if (prop) {
      prop.reviewsCount += 1;
      prop.rating = Number(((prop.rating * (prop.reviewsCount - 1) + reviewData.rating) / prop.reviewsCount).toFixed(2));
    }

    return newReview;
  }

  public getNotifications(): AppNotification[] {
    return this.notifications;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  public getUserProfile(): UserProfile {
    return this.currentUser;
  }

  public updateUserProfile(data: Partial<UserProfile>): UserProfile {
    this.currentUser = { ...this.currentUser, ...data };
    return this.currentUser;
  }
}

export const db = new Database();
