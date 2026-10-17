/* ========================================================
   YOUR PLACE OR MINE — SERVICE PACKAGES DATA REPOSITORY
   Edit package names, prices, estimator math, and bullet points here.
   ======================================================== */
const PACKAGES_DATA = [
  {
    id: 'classic',
    badge: 'Beer & Wine',
    name: 'The Classic Pour',
    shortTitle: 'Classic Pour',
    shortDesc: 'Beer, Wine & Highballs',
    subtitle: 'Simple, elegant gathering essentials',
    displayPrice: '550',
    durationLabel: '/ 4 hours',
    featured: false,
    estimatorBase: 350,
    estimatorPerGuest: 4.0,
    features: [
      'Up to 4 hours of dedicated bar service',
      '1 Certified Lead Bartender (solo up to 100 guests)',
      'Beer, wine, cider & 2-ingredient spirit highballs',
      'Full bar toolkit, speed rails, wine keys & bar mats',
      'Chilling tubs, stainless ice wells & scoops',
      'Disposable cocktail napkins & compostable straws',
      'Itemized retail bottle quantity buying guide',
      'Full load-in setup, breakdown & post-event cleanup'
    ]
  },
  {
    id: 'apothecary',
    badge: 'Zero-Proof & Soda',
    name: 'The Zero-Proof Lounge',
    shortTitle: 'Zero-Proof Lounge',
    shortDesc: 'Mocktails & Dirty Soda',
    subtitle: 'Artisanal mocktails & craft soda bar',
    displayPrice: '650',
    durationLabel: '/ 4 hours',
    featured: false,
    estimatorBase: 450,
    estimatorPerGuest: 4.5,
    features: [
      'Up to 4 hours of dedicated craft service',
      '1 Certified Lead Mixologist (solo up to 100 guests)',
      '<strong>2 House-Crafted Botanical Mocktails</strong>',
      '<strong>The Dirty Soda Lounge:</strong> Canned sodas (Coke, Dr Pepper, Sprite, soda water)',
      '4 Artisanal syrups (coconut, peach, blackberry, vanilla)',
      'Fresh-squeezed lime wheels & chilled sweet cream',
      'Dehydrated garnishes, citrus wheels & fresh herbs',
      'Elegant framed signature zero-proof menu display'
    ]
  },
  {
    id: 'craft',
    badge: 'Full Mixology',
    name: 'The Craft Signature',
    shortTitle: 'Craft Signature',
    shortDesc: '2 Signature Cocktails',
    subtitle: 'Bespoke cocktail dining & receptions',
    displayPrice: '850',
    durationLabel: '/ 4 hours',
    featured: true,
    featuredRibbon: 'Most Popular',
    estimatorBase: 520,
    estimatorPerGuest: 5.5,
    features: [
      'Up to 4 hours of dedicated craft cocktail service',
      '1 Certified Lead Mixologist (solo capacity up to 100 guests)',
      '<strong>2 Signature Handcrafted Cocktails</strong>',
      'Small-batch artisanal syrups & house-pressed citrus',
      'Dehydrated fruit wheels, torched herbs & aromatics',
      'Beer, wine & classic spirit highballs',
      'Full mobile bar setup, ice wells & pour stations',
      'Itemized retail alcohol shopping blueprint'
    ]
  },
  {
    id: 'grand',
    badge: 'The VIP Tier',
    name: 'The Grand Lounge',
    shortTitle: 'Grand Lounge',
    shortDesc: '3 Cocktails + Mocktail',
    subtitle: 'The complete luxury cocktail salon',
    displayPrice: '1,350',
    durationLabel: '/ 5 hours',
    featured: false,
    estimatorBase: 850,
    estimatorPerGuest: 7.5,
    features: [
      'Up to 5 hours of dedicated bar service',
      '<strong>2 Certified Bartenders + Dedicated Barback</strong>',
      '<strong>3 Signature Cocktails + 1 Curated Mocktail</strong>',
      '<strong>Private Digital Menu Consultation & Recipe Development</strong>',
      'Infused Spa Hydration Station included',
      'Champagne / Prosecco toast pour service',
      'Custom framed copper bar signage & printed menus',
      'White-glove bar load-in, execution & midnight strike'
    ]
  }
];