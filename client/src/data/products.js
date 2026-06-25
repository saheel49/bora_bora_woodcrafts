// ─── Sample Product Data ────────────────────────────────────────────────────
// Prices are in Kenya Shillings (KSh)
// Replace image URLs with real assets. Categories: Wall Décor, Kitchenware, Furniture

const products = [
  {
    id: 1,
    name: "Hand-Carved Wall Panel",
    category: "Wall Decor",
    price: 11500,
    oldPrice: 14000,
    rating: 4.8,
    reviews: 24,
    stock: 12,
    isFeatured: true,
    isBestSeller: true,
    tags: ["handcarved", "wall", "art"],
    images: [
  "/images/hand-carved-wall-panel.jpg"
],
    shortDescription: "A stunning hand-carved wall panel made from reclaimed mango wood.",
    description:
      "Each panel is individually carved by our master artisans using traditional East African motifs. Made from sustainably sourced mango wood, no two pieces are identical. Sealed with natural beeswax for durability.",
  },
  {
    id: 2,
    name: "Acacia Wood Salad Bowl Set",
    category: "Kitchenware",
    price: 5800,
    oldPrice: null,
    rating: 4.9,
    reviews: 41,
    stock: 20,
    isFeatured: true,
    isBestSeller: true,
    tags: ["kitchen", "bowl", "acacia"],
     images: [
  "/images/acacia-wood-bowl.jpg"
],
    shortDescription: "Set of 3 hand-turned acacia wood salad bowls.",
    description:
      "Turned on a lathe by skilled craftsmen, these acacia bowls are food-safe and finished with food-grade mineral oil. Perfect for salads, fruits, or as a decorative centerpiece.",
  },
  {
    id: 3,
    name: "Mahogany Side Table",
    category: "Furniture",
    price: 25000,
    oldPrice: 31000,
    rating: 4.7,
    reviews: 18,
    stock: 5,
    isFeatured: true,
    isBestSeller: false,
    tags: ["furniture", "table", "mahogany"],
     images: [
  "/images/mahogany-side-table.jpg"
],
    shortDescription: "Solid mahogany side table with hand-jointed legs.",
    description:
      "Built using traditional mortise-and-tenon joinery, this solid mahogany side table is designed to last generations. Available in natural or dark walnut finish.",
  },
  {
    id: 4,
    name: "Olive Wood Cheese Board",
    category: "Kitchenware",
    price: 3800,
    oldPrice: null,
    rating: 5.0,
    reviews: 33,
    stock: 30,
    isFeatured: false,
    isBestSeller: true,
    tags: ["kitchen", "cheese", "olive"],
    images: [
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600",
    ],
    shortDescription: "Beautiful olive wood cheese board with natural grain patterns.",
    description:
      "Sourced from old olive trees, each board has a unique grain pattern. Food-safe mineral oil finish. Comes with a small carving knife. Great as a gift.",
  },
  {
    id: 5,
    name: "Geometric Wall Clock",
    category: "Wall Décor",
    price: 8400,
    oldPrice: 9700,
    rating: 4.6,
    reviews: 15,
    stock: 8,
    isFeatured: false,
    isBestSeller: false,
    tags: ["clock", "wall", "geometric"],
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600",
    ],
    shortDescription: "Laser-cut geometric wooden wall clock with silent movement.",
    description:
      "Made from bamboo plywood with a precision laser-cut geometric design. Powered by a silent quartz movement. Battery included. Diameter: 35cm.",
  },
  {
    id: 6,
    name: "Teak Dining Chair",
    category: "Furniture",
    price: 41000,
    oldPrice: null,
    rating: 4.9,
    reviews: 9,
    stock: 6,
    isFeatured: true,
    isBestSeller: false,
    tags: ["furniture", "chair", "teak"],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    ],
    shortDescription: "Solid teak dining chair with woven rattan back.",
    description:
      "A fusion of teak hardwood and hand-woven natural rattan. Weather-resistant and suitable for both indoor and outdoor use. Available in sets of 2 or 4.",
  },
  {
    id: 7,
    name: "Wooden Spice Rack",
    category: "Kitchenware",
    price: 4900,
    oldPrice: null,
    rating: 4.5,
    reviews: 27,
    stock: 15,
    isFeatured: false,
    isBestSeller: true,
    tags: ["kitchen", "spice", "rack"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    ],
    shortDescription: "Wall-mounted wooden spice rack with 6 glass jars.",
    description:
      "Handmade from pine with a natural oil finish. Comes with 6 glass jars and chalkboard labels. Easy wall-mount installation kit included.",
  },
  {
    id: 8,
    name: "Abstract Tree Wall Art",
    category: "Wall Décor",
    price: 14200,
    oldPrice: 16800,
    rating: 4.8,
    reviews: 20,
    stock: 10,
    isFeatured: false,
    isBestSeller: false,
    tags: ["wall", "art", "abstract"],
    images: [
      "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600",
    ],
    shortDescription: "3D layered abstract tree wall art from birch plywood.",
    description:
      "Multi-layer laser-cut birch plywood tree sculpture. Creates a beautiful shadow effect when light falls on it. Easy to hang — all hardware included. Size: 50cm × 70cm.",
  },
];

export default products;
