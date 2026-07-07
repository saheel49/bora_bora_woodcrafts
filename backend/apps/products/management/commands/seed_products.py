from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.products.models import Category, Product


PRODUCTS = [
    {
        "name": "Hand-Carved Wall Panel",
        "category": "Wall Decor",
        "price": 11500, "old_price": 14000,
        "rating": 4.8, "review_count": 24, "stock": 12,
        "is_featured": True, "is_best_seller": True,
        "short_description": "A stunning hand-carved wall panel made from reclaimed mango wood.",
        "description": "Each panel is individually carved by our master artisans using traditional East African motifs.",
    },
    {
        "name": "Acacia Wood Salad Bowl Set",
        "category": "Kitchenware",
        "price": 5800, "old_price": None,
        "rating": 4.9, "review_count": 41, "stock": 20,
        "is_featured": True, "is_best_seller": True,
        "short_description": "Set of 3 hand-turned acacia wood salad bowls.",
        "description": "Turned on a lathe by skilled craftsmen, food-safe and finished with food-grade mineral oil.",
    },
    {
        "name": "Mahogany Side Table",
        "category": "Furniture",
        "price": 25000, "old_price": 31000,
        "rating": 4.7, "review_count": 18, "stock": 5,
        "is_featured": True, "is_best_seller": False,
        "short_description": "Solid mahogany side table with hand-jointed legs.",
        "description": "Built using traditional mortise-and-tenon joinery, designed to last generations.",
    },
    {
        "name": "Olive Wood Cheese Board",
        "category": "Kitchenware",
        "price": 3800, "old_price": None,
        "rating": 5.0, "review_count": 33, "stock": 30,
        "is_featured": False, "is_best_seller": True,
        "short_description": "Beautiful olive wood cheese board with natural grain patterns.",
        "description": "Sourced from old olive trees, each board has a unique grain pattern. Food-safe mineral oil finish.",
    },
    {
        "name": "Geometric Wall Clock",
        "category": "Wall Decor",
        "price": 8400, "old_price": 9700,
        "rating": 4.6, "review_count": 15, "stock": 8,
        "is_featured": False, "is_best_seller": False,
        "short_description": "Laser-cut geometric wooden wall clock with silent movement.",
        "description": "Made from bamboo plywood with a precision laser-cut geometric design.",
    },
    {
        "name": "Teak Dining Chair",
        "category": "Furniture",
        "price": 41000, "old_price": None,
        "rating": 4.9, "review_count": 9, "stock": 6,
        "is_featured": True, "is_best_seller": False,
        "short_description": "Solid teak dining chair with woven rattan back.",
        "description": "A fusion of teak hardwood and hand-woven natural rattan.",
    },
    {
        "name": "Wooden Spice Rack",
        "category": "Kitchenware",
        "price": 4900, "old_price": None,
        "rating": 4.5, "review_count": 27, "stock": 15,
        "is_featured": False, "is_best_seller": True,
        "short_description": "Wall-mounted wooden spice rack with 6 glass jars.",
        "description": "Handmade from pine with a natural oil finish. Comes with 6 glass jars and chalkboard labels.",
    },
    {
        "name": "Abstract Tree Wall Art",
        "category": "Wall Decor",
        "price": 14200, "old_price": 16800,
        "rating": 4.8, "review_count": 20, "stock": 10,
        "is_featured": False, "is_best_seller": False,
        "short_description": "3D layered abstract tree wall art from birch plywood.",
        "description": "Multi-layer laser-cut birch plywood tree sculpture.",
    },
]


class Command(BaseCommand):
    help = "Seed the database with initial products and categories"

    def handle(self, *args, **options):
        count = 0
        for p in PRODUCTS:
            cat_name = p["category"]
            cat, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={"slug": slugify(cat_name)},
            )
            if not Product.objects.filter(name=p["name"]).exists():
                Product.objects.create(
                    name=p["name"],
                    category=cat,
                    price=p["price"],
                    old_price=p["old_price"],
                    rating=p["rating"],
                    review_count=p["review_count"],
                    stock=p["stock"],
                    is_featured=p["is_featured"],
                    is_best_seller=p["is_best_seller"],
                    short_description=p["short_description"],
                    description=p["description"],
                )
                count += 1
                self.stdout.write(f"  ✅ Added: {p['name']}")
            else:
                self.stdout.write(f"  ℹ️  Exists: {p['name']}")

        self.stdout.write(self.style.SUCCESS(f"\nDone — {count} products added."))
