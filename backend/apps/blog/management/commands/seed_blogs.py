from django.core.management.base import BaseCommand
from apps.blog.models import BlogPost
from apps.users.models import User

POSTS = [
    {
        "title":    "The Art of Hand Carving: A Beginner's Guide",
        "slug":     "art-of-hand-carving",
        "excerpt":  "Discover the tools, techniques, and patience required to start your wood carving journey.",
        "category": "Techniques",
        "read_time": "5 min read",
        "content": """Wood carving is one of humanity's oldest and most rewarding crafts. Whether you're drawn to the meditative rhythm of a chisel on wood or the satisfaction of transforming a raw block into something beautiful, carving is a skill anyone can learn.

## Getting Started: The Essential Tools

Before you pick up a piece of wood, you need the right tools. For beginners, you don't need much:

- **A bench knife** – for whittling and shaping smaller pieces
- **A gouge** – a curved chisel perfect for scooping and hollowing
- **A V-tool** – for cutting sharp lines and details
- **A mallet** – used with larger chisels for harder woods

Always start with sharp tools. A dull blade requires more force and is actually more dangerous than a sharp one.

## Choosing Your Wood

Beginners should start with softer woods that are easy to carve:

- **Basswood** – the most popular choice, smooth grain, easy to cut
- **Butternut** – slightly harder, beautiful natural color
- **White pine** – very soft, great for practice

## Safety Tips

- Always carve away from your body
- Keep your non-carving hand behind the blade
- Use a carving glove on your holding hand

The journey of a thousand carvings begins with a single cut. Happy carving!""",
    },
    {
        "title":    "Why We Choose Sustainably Sourced Timber",
        "slug":     "sustainable-timber",
        "excerpt":  "Our commitment to the environment starts with where we get our wood.",
        "category": "Sustainability",
        "read_time": "4 min read",
        "content": """At BoraBora Woodcrafts, sustainability isn't a buzzword — it's the foundation of everything we do.

## The Problem with Unregulated Timber

East Africa's forests are under enormous pressure. Illegal logging, charcoal production, and land clearing have decimated forest cover across Kenya, Uganda, and Tanzania.

## Our Sourcing Standards

We work exclusively with certified suppliers who follow strict forest management practices:

- **FSC-certified forests** – the gold standard for responsible forestry
- **Community woodlots** – local communities planting and harvesting their own timber sustainably
- **Reclaimed and salvaged wood** – giving new life to old timber from demolished buildings

## The Tree Planting Pledge

For every 10 products sold, BoraBora plants one tree in partnership with local reforestation programs. Since 2018, we've planted over 2,400 trees.

The wood in your home has roots — and we want those roots to keep growing.""",
    },
    {
        "title":    "How to Care for Your Wooden Kitchenware",
        "slug":     "care-for-wooden-kitchenware",
        "excerpt":  "Simple tips to keep your wooden bowls and boards looking great for years.",
        "category": "Product Care",
        "read_time": "3 min read",
        "content": """Wooden kitchenware is beautiful, functional, and long-lasting — but only if you care for it properly.

## The Golden Rules

### 1. Never soak in water
Wood and standing water are enemies. Never leave wooden items submerged in the sink or in the dishwasher.

### 2. Hand wash only
Wash with warm soapy water, then dry immediately with a cloth.

### 3. Oil regularly
Every 4–6 weeks, apply a thin coat of **food-grade mineral oil** or **beeswax conditioner**.

## Removing Odours and Stains

- **Garlic/onion smell**: Rub with half a lemon, leave for 5 minutes, rinse
- **Deep stains**: Mix coarse salt with lemon juice and scrub gently

Take care of your wood, and it will take care of you.""",
    },
]


class Command(BaseCommand):
    help = "Seed the database with initial blog posts"

    def handle(self, *args, **options):
        try:
            admin = User.objects.filter(role="admin").first()
        except Exception:
            self.stdout.write(self.style.ERROR("No admin user found. Run create_admin.py first."))
            return

        count = 0
        for p in POSTS:
            if not BlogPost.objects.filter(slug=p["slug"]).exists():
                BlogPost.objects.create(
                    title=p["title"],
                    slug=p["slug"],
                    excerpt=p["excerpt"],
                    category=p["category"],
                    read_time=p["read_time"],
                    content=p["content"],
                    author=admin,
                    is_published=False,   # Admin must approve before going live
                )
                count += 1
                self.stdout.write(f"  ✅ Added: {p['title']}")
            else:
                self.stdout.write(f"  ℹ️  Exists: {p['title']}")

        self.stdout.write(self.style.SUCCESS(f"\nDone — {count} blog posts added."))
