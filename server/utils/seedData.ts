import { Category } from '../models/Category';
import { User } from '../models/User';
import { Package } from '../models/Package';
import { Page } from '../models/Page';
import { Banner } from '../models/Banner';

export async function seedDatabase() {
  try {
    // Seed categories
    const categoriesData = [
      { name: 'Cars', slug: 'cars', icon: 'fas fa-car' },
      { name: 'Properties', slug: 'properties', icon: 'fas fa-building' },
      { name: 'Mobiles', slug: 'mobiles', icon: 'fas fa-mobile-alt' },
      { name: 'Jobs', slug: 'jobs', icon: 'fas fa-briefcase' },
      { name: 'Bikes', slug: 'bikes', icon: 'fas fa-motorcycle' },
      { name: 'Electronics & Appliances', slug: 'electronics', icon: 'fas fa-tv' },
      { name: 'Furniture', slug: 'furniture', icon: 'fas fa-couch' },
      { name: 'Fashion', slug: 'fashion', icon: 'fas fa-tshirt' },
      { name: 'Pets', slug: 'pets', icon: 'fas fa-paw' },
      { name: 'Commercial Vehicles', slug: 'commercial', icon: 'fas fa-truck' },
      { name: 'Others', slug: 'others', icon: 'fas fa-ellipsis-h' },
      { name: 'Books, Sports & Hobbies', slug: 'books-sports', icon: 'fas fa-book' }
    ];

    for (const categoryData of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: categoryData.slug },
        categoryData,
        { upsert: true }
      );
    }

    // Seed admin user (demo)
    let adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      adminExists = new User({
        name: 'Admin',
        email: 'admin@demo.com',
        password: '123456',
        role: 'admin'
      });
      await adminExists.save();
      console.log('Admin user created: admin@demo.com / 123456');
    } else {
      adminExists.password = '123456';
      await adminExists.save();
      console.log('Admin user password reset to 123456');
    }

    // Seed packages
    const packagesData = [
      {
        name: 'Free',
        features: {
          featured: false,
          urgent: false,
          boostDays: 0,
          maxListings: 1
        },
        basePrice: 0
      },
      {
        name: 'Premium',
        features: {
          featured: true,
          urgent: false,
          boostDays: 3,
          maxListings: 5
        },
        basePrice: 99
      },
      {
        name: 'Featured',
        features: {
          featured: true,
          urgent: true,
          boostDays: 7,
          maxListings: 10
        },
        basePrice: 199
      }
    ];

    for (const packageData of packagesData) {
      await Package.findOneAndUpdate(
        { name: packageData.name },
        packageData,
        { upsert: true }
      );
    }

    // Seed CMS pages
    const pagesData = [
      { title: 'About Us', slug: 'about', content: 'About Posttrr - a community marketplace.' },
      { title: 'Contact Us', slug: 'contact', content: 'Email: support@posttrr.com' },
      { title: 'FAQ', slug: 'faq', content: 'Frequently asked questions.' },
      { title: 'Blog', slug: 'blog', content: 'Latest news and stories.' },
      { title: 'Privacy Policy', slug: 'privacy', content: 'Your privacy matters to us.' },
      { title: 'Terms of Service', slug: 'terms', content: 'Terms and conditions.' }
    ];

    for (const pageData of pagesData) {
      await Page.findOneAndUpdate({ slug: pageData.slug }, pageData, { upsert: true });
    }

    // Seed locations
    const cities = [
      { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal' },
      { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra' },
      { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu' },
      { name: 'Pune', slug: 'pune', state: 'Maharashtra' },
      { name: 'Delhi', slug: 'delhi', state: 'Delhi' }
    ];

    const cityDocs: Record<string, any> = {};
    for (const c of cities) {
      const doc = await (await import('../models/Location')).LocationCity.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
      cityDocs[c.slug] = doc;
    }

    const kolkata = cityDocs['kolkata']?._id;
    const mumbai = cityDocs['mumbai']?._id;

    const areas = [
      { cityId: kolkata, name: 'Salt Lake', slug: 'salt-lake' },
      { cityId: kolkata, name: 'New Town', slug: 'new-town' },
      { cityId: kolkata, name: 'Howrah', slug: 'howrah' },
      { cityId: mumbai, name: 'Andheri', slug: 'andheri' },
      { cityId: mumbai, name: 'Bandra', slug: 'bandra' },
    ];

    for (const a of areas) {
      if (!a.cityId) continue;
      await (await import('../models/Location')).LocationArea.findOneAndUpdate({ slug: a.slug, cityId: a.cityId }, a, { upsert: true });
    }

    // Seed some price rules
    const premium = await (await import('../models/Package')).Package.findOne({ name: 'Premium' });
    const featured = await (await import('../models/Package')).Package.findOne({ name: 'Featured' });
    if (premium && kolkata) {
      await (await import('../models/Package')).PriceRule.findOneAndUpdate(
        { scope: 'city', refId: kolkata, packageId: premium._id },
        { scope: 'city', refId: kolkata, packageId: premium._id, price: premium.basePrice + 20 },
        { upsert: true }
      );
    }
    if (featured && mumbai) {
      await (await import('../models/Package')).PriceRule.findOneAndUpdate(
        { scope: 'city', refId: mumbai, packageId: featured._id },
        { scope: 'city', refId: mumbai, packageId: featured._id, price: featured.basePrice + 50 },
        { upsert: true }
      );
    }

    // Seed a seller and demo listings
    let seller = await User.findOne({ email: 'seller@demo.com' });
    if (!seller) {
      seller = new User({ name: 'Seller Demo', email: 'seller@demo.com', password: '123456', role: 'seller' });
      await seller.save();
      console.log('Seller user created: seller@demo.com / 123456');
    } else {
      seller.password = '123456';
      await seller.save();
      console.log('Seller user password reset to 123456');
    }
    const firstCat = await Category.findOne();
    if (seller && firstCat) {
      const { Listing } = await import('../models/Listing');
      const existingCount = await Listing.countDocuments({ userId: seller._id });
      if (existingCount === 0) {
        const demos = [
          { title: 'Used Car - Good Condition', price: 250000, description: 'Well maintained car', images: [], location: { city: 'Kolkata', state: 'West Bengal' } },
          { title: 'Apartment for Rent', price: 15000, description: '2BHK near metro', images: [], location: { city: 'Mumbai', state: 'Maharashtra' } },
          { title: 'iPhone 13', price: 45000, description: 'Like new', images: [], location: { city: 'Delhi', state: 'Delhi' } }
        ];
        let index = 0;
        for (const d of demos) {
          const isFeatured = index === 0;
          await Listing.create({ userId: seller._id, title: d.title, slug: d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: d.description, price: d.price, categoryId: firstCat._id, images: d.images, location: d.location, status: 'active', isFeatured });
          index++;
        }
      }
    }

    // Seed a homepage banner
    await Banner.findOneAndUpdate(
      { position: 'homepage', title: 'Homepage Hero' },
      { title: 'Homepage Hero', imageUrl: 'https://picsum.photos/1200/300', linkUrl: '/listings', position: 'homepage', isActive: true },
      { upsert: true }
    );

    // Seed report reasons
    try {
      const { ReportReason } = await import('../models/ReportReason');
      const reasons = [
        { name: 'Spam', slug: 'spam' },
        { name: 'Duplicate Listing', slug: 'duplicate' },
        { name: 'Wrong Category', slug: 'wrong-category' },
        { name: 'Scam or Fraud', slug: 'scam' },
        { name: 'Offensive Content', slug: 'offensive' }
      ];
      for (const r of reasons) {
        await ReportReason.findOneAndUpdate({ slug: r.slug }, { ...r, isActive: true }, { upsert: true });
      }
    } catch {}

    // Ensure seller has active Premium subscription
    try {
      const { Package } = await import('../models/Package');
      const { Subscription } = await import('../models/Subscription');
      const premiumPack = await Package.findOne({ name: 'Featured' }) || await Package.findOne({ name: 'Premium' });
      if (seller && premiumPack) {
        const now = new Date();
        const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await Subscription.findOneAndUpdate(
          { sellerId: seller._id, packageId: premiumPack._id },
          { sellerId: seller._id, packageId: premiumPack._id, startAt: now, endAt: end, remainingListings: 20, remainingFeatured: 5, remainingBumps: 5, status: 'active' },
          { upsert: true }
        );
      }
    } catch {}

    // Seed a buyer user and a chat thread
    let buyer = await User.findOne({ email: 'buyer@demo.com' });
    if (!buyer) {
      buyer = new User({ name: 'Buyer Demo', email: 'buyer@demo.com', password: '123456', role: 'user' });
      await buyer.save();
    }
    try {
      const { ChatThread, ChatMessage } = await import('../models/Chat');
      const { Listing } = await import('../models/Listing');
      const anyListing = await Listing.findOne({});
      if (anyListing && buyer) {
        let thread = await ChatThread.findOne({ listingId: anyListing._id, buyerId: buyer._id, sellerId: anyListing.userId });
        if (!thread) {
          thread = new ChatThread({ listingId: anyListing._id, buyerId: buyer._id, sellerId: anyListing.userId });
          await thread.save();
          await ChatMessage.create({ threadId: thread._id, senderId: buyer._id, text: 'Is this still available?' });
          await ChatMessage.create({ threadId: thread._id, senderId: anyListing.userId, text: 'Yes, it is available.' });
          await ChatMessage.create({ threadId: thread._id, senderId: buyer._id, text: 'Can you share more photos?' });
          await ChatMessage.create({ threadId: thread._id, senderId: anyListing.userId, text: 'Sure, uploading now.' });
          await ChatThread.findByIdAndUpdate(thread._id, { lastMessageAt: new Date(), lastMessage: 'Sure, uploading now.', sellerUnread: 0, buyerUnread: 2 });
        }
      }
    } catch {}

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
}
