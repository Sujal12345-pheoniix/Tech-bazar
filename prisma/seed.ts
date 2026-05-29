import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


const CATEGORIES = [
  { name: "Phone Cases", slug: "phone-cases", description: "Premium protection for every device", icon: "📱", sortOrder: 1 },
  { name: "Chargers", slug: "chargers", description: "Fast charging solutions", icon: "⚡", sortOrder: 2 },
  { name: "Audio", slug: "audio", description: "Earbuds, headphones, and more", icon: "🎧", sortOrder: 3 },
  { name: "Power Banks", slug: "power-banks", description: "Portable charging powerhouses", icon: "🔋", sortOrder: 4 },
  { name: "Smartwatches", slug: "smartwatches", description: "Smart wearables for every lifestyle", icon: "⌚", sortOrder: 5 },
  { name: "Gaming", slug: "gaming", description: "Level up your mobile gaming", icon: "🎮", sortOrder: 6 },
  { name: "Data Cables", slug: "cables", description: "Premium cables for every device", icon: "🔌", sortOrder: 7 },
  { name: "MagSafe", slug: "magsafe", description: "Apple MagSafe ecosystem", icon: "🧲", sortOrder: 8 },
  { name: "Screen Protectors", slug: "screen-protectors", description: "Crystal clear protection", icon: "🛡️", sortOrder: 9 },
  { name: "Laptop Accessories", slug: "laptop", description: "Enhance your productivity", icon: "💻", sortOrder: 10 },
];

const PLACEHOLDER_IMAGES = {
  "phone-cases": "https://images.unsplash.com/photo-1601593346740-925612772716?w=500&auto=format",
  "chargers": "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=500&auto=format",
  "audio": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format",
  "power-banks": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format",
  "smartwatches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format",
  "gaming": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format",
  "cables": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format",
  "magsafe": "https://images.unsplash.com/photo-1617526738882-1ea945ce3e56?w=500&auto=format",
  "screen-protectors": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format",
  "laptop": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format",
};

const PRODUCTS_TEMPLATE = [
  // Phone Cases
  { name: "iPhone 15 Pro MagSafe Case — Midnight Black", slug: "iphone-15-pro-magsafe-case-midnight-black", category: "phone-cases", brand: "Apple", price: 2499, comparePrice: 3499, isFeatured: true, isTrending: true, stock: 150, rating: 4.8, reviewCount: 234, soldCount: 1250, tags: ["magsafe", "iphone", "premium"], specifications: { "Compatible with": "iPhone 15 Pro", "Material": "Military Grade Polycarbonate", "MagSafe": "Yes", "Wireless Charging": "Compatible", "Protection Level": "MIL-STD-810G" } },
  { name: "Samsung Galaxy S24 Ultra Armor Case", slug: "samsung-s24-ultra-armor-case", category: "phone-cases", brand: "Samsung", price: 1999, comparePrice: 2999, isTrending: true, stock: 200, rating: 4.7, reviewCount: 178, soldCount: 890, tags: ["samsung", "armor", "protection"] },
  { name: "Nothing Phone 2 Glyph Case — Clear", slug: "nothing-phone-2-glyph-case-clear", category: "phone-cases", brand: "Nothing", price: 1799, comparePrice: 2499, isNewArrival: true, stock: 80, rating: 4.9, reviewCount: 56, soldCount: 230, tags: ["nothing", "glyph", "transparent"] },
  { name: "OnePlus 12 Sandstone Matte Case", slug: "oneplus-12-sandstone-matte-case", category: "phone-cases", brand: "OnePlus", price: 999, comparePrice: 1499, stock: 300, rating: 4.6, reviewCount: 145, soldCount: 670, tags: ["oneplus", "sandstone"] },
  { name: "iPhone 15 Pro Max Leather Folio — Brown", slug: "iphone-15-pro-max-leather-folio-brown", category: "phone-cases", brand: "Apple", price: 3999, comparePrice: 5499, isFeatured: true, stock: 60, rating: 4.9, reviewCount: 89, soldCount: 340, tags: ["leather", "premium", "folio"] },
  { name: "Pixel 8 Pro Slim Fit Case — Frost", slug: "pixel-8-pro-slim-fit-case", category: "phone-cases", brand: "Google", price: 1299, stock: 120, rating: 4.5, reviewCount: 67, soldCount: 290, tags: ["pixel", "slim"] },

  // Chargers
  { name: "GaN 120W Triple Port Fast Charger", slug: "gan-120w-triple-port-charger", category: "chargers", brand: "Anker", price: 3499, comparePrice: 4999, isFeatured: true, isTrending: true, stock: 95, rating: 4.9, reviewCount: 312, soldCount: 2100, tags: ["gan", "fast-charge", "multi-port"], specifications: { "Output Power": "120W Total", "Ports": "3 (2x USB-C + 1x USB-A)", "Technology": "GaN III", "Compatibility": "Universal", "Cable Included": "Yes - 100W USB-C" } },
  { name: "Apple MagSafe Charger 15W", slug: "apple-magsafe-charger-15w", category: "chargers", brand: "Apple", price: 3999, comparePrice: 4499, isFeatured: true, stock: 200, rating: 4.8, reviewCount: 445, soldCount: 3200, tags: ["magsafe", "wireless", "apple"] },
  { name: "Baseus 65W Nano 3 GaN Charger", slug: "baseus-65w-nano-3-gan-charger", category: "chargers", brand: "Baseus", price: 1999, comparePrice: 2799, isNewArrival: true, stock: 150, rating: 4.7, reviewCount: 189, soldCount: 980, tags: ["gan", "compact", "fast-charge"] },
  { name: "UGREEN 300W Charging Station", slug: "ugreen-300w-charging-station", category: "chargers", brand: "UGREEN", price: 7999, comparePrice: 10999, isFeatured: true, stock: 40, rating: 4.9, reviewCount: 78, soldCount: 210, tags: ["charging-station", "desktop", "multi-port"] },
  { name: "Qi2 15W Wireless Charging Pad Pro", slug: "qi2-15w-wireless-charging-pad-pro", category: "chargers", brand: "Belkin", price: 2499, comparePrice: 3499, stock: 110, rating: 4.6, reviewCount: 156, soldCount: 750, tags: ["wireless", "qi2", "pad"] },

  // Audio
  { name: "Nothing Ear (2) — True Wireless Earbuds", slug: "nothing-ear-2-true-wireless-earbuds", category: "audio", brand: "Nothing", price: 8999, comparePrice: 11999, isFeatured: true, isTrending: true, stock: 75, rating: 4.8, reviewCount: 523, soldCount: 1890, tags: ["tws", "anc", "nothing"], specifications: { "Driver Size": "11.6mm", "ANC": "Up to -45dB", "Battery (Earbuds)": "36 hours", "Water Resistance": "IP54", "Connectivity": "Bluetooth 5.3" } },
  { name: "Sony WH-1000XM5 Wireless Headphones", slug: "sony-wh-1000xm5-wireless-headphones", category: "audio", brand: "Sony", price: 26999, comparePrice: 34990, isFeatured: true, stock: 35, rating: 4.9, reviewCount: 789, soldCount: 1200, tags: ["headphones", "anc", "premium"] },
  { name: "Apple AirPods Pro 2nd Gen", slug: "apple-airpods-pro-2nd-gen", category: "audio", brand: "Apple", price: 24900, comparePrice: 26900, isFeatured: true, stock: 60, rating: 4.8, reviewCount: 1203, soldCount: 4500, tags: ["airpods", "magsafe", "anc"] },
  { name: "OnePlus Buds 3 — Splendid Blue", slug: "oneplus-buds-3-splendid-blue", category: "audio", brand: "OnePlus", price: 5299, comparePrice: 6999, isNewArrival: true, stock: 120, rating: 4.6, reviewCount: 234, soldCount: 890, tags: ["tws", "anc"] },
  { name: "JBL Tune 770NC Wireless Headphones", slug: "jbl-tune-770nc-wireless-headphones", category: "audio", brand: "JBL", price: 8999, comparePrice: 12999, stock: 55, rating: 4.5, reviewCount: 167, soldCount: 670, tags: ["headphones", "anc", "jbl"] },
  { name: "Realme Buds Air 5 Pro", slug: "realme-buds-air-5-pro", category: "audio", brand: "Realme", price: 3999, comparePrice: 4999, isNewArrival: true, stock: 200, rating: 4.4, reviewCount: 312, soldCount: 1200, tags: ["tws", "budget"] },

  // Power Banks
  { name: "Anker 733 Power Bank 65W — 10000mAh", slug: "anker-733-power-bank-65w-10000mah", category: "power-banks", brand: "Anker", price: 4499, comparePrice: 5999, isFeatured: true, stock: 85, rating: 4.8, reviewCount: 345, soldCount: 1560, tags: ["65w", "compact", "fast-charge"], specifications: { "Capacity": "10000mAh", "Output": "65W Max", "Input": "45W USB-C", "Ports": "2x USB-C + 1x USB-A", "Size": "Pocket-friendly" } },
  { name: "Xiaomi 33W Power Bank 20000mAh", slug: "xiaomi-33w-power-bank-20000mah", category: "power-banks", brand: "Xiaomi", price: 2499, comparePrice: 3299, isTrending: true, stock: 200, rating: 4.7, reviewCount: 567, soldCount: 2800, tags: ["20000mah", "xiaomi"] },
  { name: "UGREEN 145W Laptop Power Bank 25000mAh", slug: "ugreen-145w-laptop-power-bank-25000mah", category: "power-banks", brand: "UGREEN", price: 8999, comparePrice: 12999, isFeatured: true, stock: 30, rating: 4.9, reviewCount: 89, soldCount: 340, tags: ["laptop", "145w", "large"] },
  { name: "Baseus 30000mAh MagSafe Power Bank", slug: "baseus-30000mah-magsafe-power-bank", category: "power-banks", brand: "Baseus", price: 3999, comparePrice: 5499, isNewArrival: true, stock: 70, rating: 4.5, reviewCount: 123, soldCount: 450, tags: ["magsafe", "wireless"] },

  // Smartwatches
  { name: "Apple Watch Ultra 2 — Titanium", slug: "apple-watch-ultra-2-titanium", category: "smartwatches", brand: "Apple", price: 89900, comparePrice: 99900, isFeatured: true, isTrending: true, stock: 20, rating: 4.9, reviewCount: 234, soldCount: 350, tags: ["apple", "premium", "adventure"], specifications: { "Display": "49mm LTPO Retina OLED", "Battery": "Up to 60 hours", "Water Resistance": "100m", "GPS": "Multi-band", "Health": "ECG, Blood Oxygen" } },
  { name: "Samsung Galaxy Watch 6 Classic — 47mm", slug: "samsung-galaxy-watch-6-classic-47mm", category: "smartwatches", brand: "Samsung", price: 29999, comparePrice: 36990, isFeatured: true, stock: 45, rating: 4.8, reviewCount: 456, soldCount: 890, tags: ["samsung", "classic", "health"] },
  { name: "Noise ColorFit Ultra 3 Smartwatch", slug: "noise-colorfit-ultra-3-smartwatch", category: "smartwatches", brand: "Noise", price: 2999, comparePrice: 4999, isNewArrival: true, isTrending: true, stock: 300, rating: 4.3, reviewCount: 789, soldCount: 4500, tags: ["budget", "india", "amoled"] },
  { name: "Amazfit GTR 4 Smartwatch — Sunset Brown", slug: "amazfit-gtr-4-smartwatch-sunset-brown", category: "smartwatches", brand: "Amazfit", price: 12999, comparePrice: 16999, stock: 60, rating: 4.6, reviewCount: 234, soldCount: 780, tags: ["battery-life", "gps"] },

  // Gaming
  { name: "Razer Kishi V2 Pro Mobile Controller — Android", slug: "razer-kishi-v2-pro-android", category: "gaming", brand: "Razer", price: 12999, comparePrice: 16999, isFeatured: true, isTrending: true, stock: 40, rating: 4.8, reviewCount: 189, soldCount: 560, tags: ["controller", "android", "cloud-gaming"], specifications: { "Compatibility": "Android USB-C", "Latency": "Ultra-low via USB", "Buttons": "24 mappable", "Haptic": "Yes", "App": "Razer Nexus" } },
  { name: "PUBG/BGMI Trigger Set L1R1 — Pro Edition", slug: "pubg-bgmi-trigger-set-l1r1-pro", category: "gaming", brand: "GameSir", price: 799, comparePrice: 1299, isTrending: true, stock: 500, rating: 4.5, reviewCount: 1234, soldCount: 8900, tags: ["trigger", "bgmi", "pubg"] },
  { name: "Phone Cooling Fan — Semiconductor Cooler", slug: "phone-cooling-fan-semiconductor", category: "gaming", brand: "Black Shark", price: 2499, comparePrice: 3499, isNewArrival: true, stock: 80, rating: 4.6, reviewCount: 234, soldCount: 780, tags: ["cooling", "gaming", "black-shark"] },
  { name: "Gaming Finger Sleeves Pro — 6 Pack", slug: "gaming-finger-sleeves-pro-6-pack", category: "gaming", brand: "GameSir", price: 299, comparePrice: 499, stock: 1000, rating: 4.4, reviewCount: 567, soldCount: 5600, tags: ["finger-sleeves", "gaming"] },

  // Cables
  { name: "Anker 240W USB-C to USB-C Cable — 1m", slug: "anker-240w-usbc-cable-1m", category: "cables", brand: "Anker", price: 1499, comparePrice: 1999, isFeatured: true, stock: 300, rating: 4.8, reviewCount: 456, soldCount: 2300, tags: ["240w", "usb-c", "premium"], specifications: { "Max Power": "240W", "Length": "1 Meter", "Connector": "USB-C to USB-C", "Data Transfer": "USB 3.2 Gen 2", "Compatibility": "Universal USB-C" } },
  { name: "UGREEN 3-in-1 Fast Charging Cable", slug: "ugreen-3-in-1-fast-charging-cable", category: "cables", brand: "UGREEN", price: 899, comparePrice: 1299, isTrending: true, stock: 400, rating: 4.7, reviewCount: 789, soldCount: 4500, tags: ["3-in-1", "universal"] },
  { name: "Apple USB-C to Lightning Cable — 1m", slug: "apple-usbc-lightning-cable-1m", category: "cables", brand: "Apple", price: 1999, stock: 200, rating: 4.6, reviewCount: 345, soldCount: 1800, tags: ["apple", "lightning", "official"] },
  { name: "Braided Nylon USB-C Cable 6-Pack — 1m", slug: "braided-nylon-usbc-cable-6-pack", category: "cables", brand: "Baseus", price: 1299, comparePrice: 1999, stock: 500, rating: 4.5, reviewCount: 234, soldCount: 2100, tags: ["braided", "value", "set"] },

  // MagSafe
  { name: "Peak Design Mobile Everyday Case — MagSafe", slug: "peak-design-everyday-case-magsafe", category: "magsafe", brand: "Peak Design", price: 5999, comparePrice: 7999, isFeatured: true, stock: 45, rating: 4.9, reviewCount: 123, soldCount: 340, tags: ["peak-design", "premium", "magsafe"] },
  { name: "MagSafe 3-in-1 Charging Stand — Midnight", slug: "magsafe-3-in-1-charging-stand-midnight", category: "magsafe", brand: "Belkin", price: 7499, comparePrice: 9999, isFeatured: true, isTrending: true, stock: 35, rating: 4.8, reviewCount: 89, soldCount: 230, tags: ["stand", "magsafe", "nightstand"] },
  { name: "MagSafe Compatible Magnetic Card Wallet", slug: "magsafe-magnetic-card-wallet", category: "magsafe", brand: "Apple", price: 4499, comparePrice: 4999, stock: 100, rating: 4.6, reviewCount: 167, soldCount: 890, tags: ["wallet", "magsafe", "leather"] },

  // Screen Protectors
  { name: "Spigen Tempered Glass — iPhone 15 Pro Max", slug: "spigen-tempered-glass-iphone-15-pro-max", category: "screen-protectors", brand: "Spigen", price: 1299, comparePrice: 1799, isTrending: true, stock: 400, rating: 4.8, reviewCount: 678, soldCount: 4500, tags: ["tempered-glass", "iphone", "spigen"], specifications: { "Compatibility": "iPhone 15 Pro Max", "Thickness": "0.2mm", "Hardness": "9H", "Clarity": "Crystal Clear", "Auto-Align": "Yes" } },
  { name: "Privacy Screen Protector — Samsung S24", slug: "privacy-screen-protector-samsung-s24", category: "screen-protectors", brand: "Belkin", price: 1599, comparePrice: 2299, stock: 200, rating: 4.5, reviewCount: 234, soldCount: 890, tags: ["privacy", "samsung"] },
];

async function main() {
  console.log("🌱 Starting MobileHub database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mobilehub.in" },
    update: {},
    create: {
      name: "MobileHub Admin",
      email: "admin@mobilehub.in",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: "test@mobilehub.in" },
    update: {},
    create: {
      name: "Test User",
      email: "test@mobilehub.in",
      password: await bcrypt.hash("Test@12345", 12),
      role: "USER",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Test user created: ${testUser.email}`);

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        image: PLACEHOLDER_IMAGES[cat.slug as keyof typeof PLACEHOLDER_IMAGES] ?? "",
        featured: ["phone-cases", "chargers", "audio", "smartwatches", "gaming"].includes(cat.slug),
      },
    });
    categoryMap[cat.slug] = category.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // Create products
  let productCount = 0;
  for (const product of PRODUCTS_TEMPLATE) {
    const categoryId = categoryMap[product.category];
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) {
      console.log(`⏭️  Product already exists: ${product.name}`);
      continue;
    }

    const imageUrl = PLACEHOLDER_IMAGES[product.category as keyof typeof PLACEHOLDER_IMAGES] ?? "";

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: `${product.name} - Premium quality product from ${product.brand ?? "MobileHub"}. Experience the perfect blend of design and performance. This product is built to last with premium materials and rigorous quality control. Suitable for everyday use and comes with a 2-year warranty.`,
        shortDescription: `Premium ${product.name} from ${product.brand ?? "MobileHub"}. High quality, guaranteed satisfaction.`,
        price: product.price,
        comparePrice: product.comparePrice,
        brand: product.brand,
        categoryId,
        tags: product.tags ?? [],
        isFeatured: product.isFeatured ?? false,
        isTrending: product.isTrending ?? false,
        isNewArrival: product.isNewArrival ?? true,
        isActive: true,
        rating: product.rating ?? 4.5,
        reviewCount: product.reviewCount ?? 0,
        soldCount: product.soldCount ?? 0,
        specifications: product.specifications ?? undefined,
        images: {
          create: [
            { url: imageUrl, altText: product.name, isPrimary: true, sortOrder: 0 },
            { url: imageUrl.replace("w=500", "w=501"), altText: `${product.name} - View 2`, isPrimary: false, sortOrder: 1 },
          ],
        },
        inventory: {
          create: { quantity: product.stock ?? 100, lowStockAlert: 10 },
        },
      },
    });

    productCount++;
    console.log(`✅ Product ${productCount}: ${product.name}`);
  }

  // Create coupons
  const coupons = [
    { code: "WELCOME10", description: "10% off for new customers", type: "PERCENTAGE" as const, value: 10, maxDiscount: 500, usageLimit: 1000, isActive: true },
    { code: "FLAT200", description: "₹200 off on orders above ₹1000", type: "FIXED" as const, value: 200, minOrderValue: 1000, isActive: true },
    { code: "AUDIO20", description: "20% off on audio products", type: "PERCENTAGE" as const, value: 20, maxDiscount: 1000, usageLimit: 500, isActive: true },
    { code: "SALE50", description: "₹500 off on orders above ₹2500", type: "FIXED" as const, value: 500, minOrderValue: 2500, isActive: true },
    { code: "FREESHIP", description: "Free shipping on any order", type: "FIXED" as const, value: 49, isActive: true },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
    console.log(`✅ Coupon: ${coupon.code}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${CATEGORIES.length} categories`);
  console.log(`   - ${productCount} products`);
  console.log(`   - ${coupons.length} coupons`);
  console.log(`   - 2 users (admin + test)`);
  console.log("\n🔑 Admin credentials:");
  console.log("   Email: admin@mobilehub.in");
  console.log("   Password: Admin@12345");
  console.log("\n🔑 Test user credentials:");
  console.log("   Email: test@mobilehub.in");
  console.log("   Password: Test@12345");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
