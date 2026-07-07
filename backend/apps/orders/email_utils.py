import re
from django.core.mail import send_mail
from django.conf import settings


def _should_send_to_customer(email):
    """Avoid sending confirmation emails to placeholder or invalid test addresses."""
    if not email:
        return False

    normalized = (email or "").strip().lower()
    if not normalized:
        return False

    if normalized.endswith("@example.com") or normalized.endswith("@example.org") or normalized.endswith("@mailinator.com"):
        return False

    if normalized.startswith("test@"):
        return False

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", normalized):
        return False

    return True


def send_order_receipt_to_admin(order):
    """Send full order receipt to saheelamir49@gmail.com."""
    items_text = "\n".join(
        [f"  • {item.name} x{item.quantity} — KSh {item.price * item.quantity:,.0f}"
         for item in order.items.all()]
    )
    message = f"""
NEW ORDER — BoraBora Woodcrafts
================================
Order #: {order.id}
Date:    {order.created_at.strftime('%d %b %Y %H:%M')}

CUSTOMER
--------
Name:    {order.first_name} {order.last_name}
Email:   {order.email}
Phone:   {order.phone}

DELIVERY ADDRESS
----------------
{order.address}
{order.city}, {order.country}

ITEMS ORDERED
-------------
{items_text}

PRICING
-------
Subtotal:  KSh {order.subtotal:,.0f}
Shipping:  {'FREE' if order.shipping_cost == 0 else f'KSh {order.shipping_cost:,.0f}'}
TOTAL:     KSh {order.total:,.0f}

PAYMENT METHOD: {order.payment_method.upper()}
"""
    send_mail(
        subject=f"New Order #{order.id} — {order.first_name} {order.last_name}",
        message=message.strip(),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=True,
    )


def send_order_confirmation_to_customer(order):
    """Send confirmation email to the customer."""
    if not _should_send_to_customer(order.email):
        return

    message = f"""
Hi {order.first_name},

Thank you for your order! We've received it and will confirm shortly.

Order #{order.id}
Total: KSh {order.total:,.0f}
Delivering to: {order.city}, {order.country}

We'll contact you at {order.phone} or {order.email} with updates.

— BoraBora Woodcrafts
"""
    send_mail(
        subject=f"Order Confirmed — BoraBora Woodcrafts #{order.id}",
        message=message.strip(),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=True,
    )


def send_status_update_to_customer(order):
    """Notify customer when order status changes."""
    if not _should_send_to_customer(order.email):
        return

    status_messages = {
        "Confirmed":        "Your order has been confirmed and is being prepared.",
        "Processing":       "Your order is currently being processed in our workshop.",
        "Shipped":          "Great news! Your order has been shipped.",
        "Out for Delivery": "Your order is out for delivery today!",
        "Delivered":        "Your order has been delivered. Enjoy your BoraBora product!",
        "Cancelled":        "Your order has been cancelled. Contact us if you have questions.",
    }
    msg = status_messages.get(order.status, f"Your order status has been updated to: {order.status}")
    send_mail(
        subject=f"Order Update — {order.status} | BoraBora Woodcrafts #{order.id}",
        message=f"Hi {order.first_name},\n\n{msg}\n\nOrder #{order.id}\nTotal: KSh {order.total:,.0f}\n\n— BoraBora Woodcrafts",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=True,
    )
