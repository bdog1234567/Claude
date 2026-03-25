import { NextRequest, NextResponse } from "next/server";

// This webhook handles Stripe subscription events
// In production, you'd verify the webhook signature and update your database
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // TODO: Verify webhook signature with Stripe SDK
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed": {
        // User completed checkout - activate subscription
        const session = event.data.object;
        console.log("Checkout completed:", session.id);
        // TODO: Update user's plan in database
        break;
      }

      case "customer.subscription.updated": {
        // Subscription changed (upgrade/downgrade)
        const subscription = event.data.object;
        console.log("Subscription updated:", subscription.id);
        // TODO: Update user's plan in database
        break;
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled
        const subscription = event.data.object;
        console.log("Subscription cancelled:", subscription.id);
        // TODO: Downgrade user to free plan in database
        break;
      }

      case "invoice.payment_failed": {
        // Payment failed
        const invoice = event.data.object;
        console.log("Payment failed:", invoice.id);
        // TODO: Notify user of failed payment
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
