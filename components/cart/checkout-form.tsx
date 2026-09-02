"use client";

import type { Address } from "@prisma/client";
import { Check, CreditCard, Loader2, MapPin, Package, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { applyCoupon, calculateShipping, calculateTax } from "@/lib/delivery";
import { formatPrice } from "@/lib/utils";
import type { CheckoutStep } from "@/types";

const steps: { id: CheckoutStep; label: string; icon: typeof MapPin }[] = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: Package }
];

export function CheckoutForm() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const applyCouponStore = useCartStore((s) => s.applyCoupon);
  const [step, setStep] = useState<CheckoutStep>("address");
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [couponInput, setCouponInput] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/addresses");
        if (!response.ok) return;
        const data = (await response.json()) as { addresses: Address[] };
        if (cancelled) return;

        setSavedAddresses(data.addresses);
        const preferred = data.addresses.find((a) => a.isDefault) ?? data.addresses[0];
        if (preferred) {
          setSelectedAddressId(preferred.id);
          setAddress({
            fullName: preferred.fullName,
            phone: preferred.phone,
            line1: preferred.line1,
            line2: preferred.line2 ?? "",
            city: preferred.city,
            state: preferred.state,
            pincode: preferred.pincode
          });
        }
      } catch {
        // saved addresses are a convenience; manual entry still works
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  function selectSavedAddress(saved: Address) {
    setSelectedAddressId(saved.id);
    setAddress({
      fullName: saved.fullName,
      phone: saved.phone,
      line1: saved.line1,
      line2: saved.line2 ?? "",
      city: saved.city,
      state: saved.state,
      pincode: saved.pincode
    });
  }

  const shipping = calculateShipping(subtotal, true) + (deliveryMethod === "express" ? 99 : 0);
  const tax = calculateTax(subtotal - couponDiscount);
  const total = subtotal - couponDiscount + shipping + tax;

  const stepIndex = steps.findIndex((s) => s.id === step);

  async function placeOrder(event: FormEvent) {
    event.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in before checkout.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          address,
          deliveryMethod,
          paymentMethod,
          couponCode: useCartStore.getState().couponCode
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else window.location.href = "/checkout/success";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  function validateCoupon() {
    const result = applyCoupon(subtotal, couponInput);
    if (result.discount > 0) {
      applyCouponStore(couponInput.toUpperCase(), result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold">No items to checkout</h1>
        <Link href="/search" className="amazon-btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
      <nav className="mb-8 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = i < stepIndex;
          const current = s.id === step;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
                  current ? "bg-amazon-orange text-slate-950" : done ? "bg-amazon-green/20 text-amazon-green" : "bg-slate-200 text-slate-600 dark:bg-white/10"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                {s.label}
              </div>
              {i < steps.length - 1 && <span className="text-slate-300">→</span>}
            </div>
          );
        })}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="amazon-card">
          {status !== "loading" && !session?.user && (
            <div className="mb-5 rounded border border-amber-200 bg-amber-50 p-4 text-sm">
              <Link href="/login?callbackUrl=/checkout" className="font-bold text-amazon-teal underline">
                Sign in
              </Link>{" "}
              to place your order.
            </div>
          )}

          {step === "address" && (
            <div>
              <h1 className="text-2xl font-bold">Select delivery address</h1>

              {savedAddresses.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {savedAddresses.map((saved) => (
                    <label
                      key={saved.id}
                      className={`flex cursor-pointer items-start gap-2 rounded border p-3 text-sm ${
                        selectedAddressId === saved.id ? "border-amazon-orange bg-amber-50/50" : "border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        className="mt-1"
                        checked={selectedAddressId === saved.id}
                        onChange={() => selectSavedAddress(saved)}
                      />
                      <span>
                        <span className="block font-bold">
                          {saved.fullName} {saved.isDefault && <span className="text-xs font-normal text-amazon-orange">(Default)</span>}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {saved.line1}, {saved.city}, {saved.state} {saved.pincode}
                        </span>
                      </span>
                    </label>
                  ))}
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded border p-3 text-sm ${
                      selectedAddressId === null ? "border-amazon-orange bg-amber-50/50" : "border-slate-200 dark:border-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === null}
                      onChange={() => {
                        setSelectedAddressId(null);
                        setAddress({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
                      }}
                    />
                    Use a different address
                  </label>
                </div>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {Object.entries({
                  fullName: "Full name",
                  phone: "Mobile",
                  line1: "Address line 1",
                  line2: "Address line 2",
                  city: "City",
                  state: "State",
                  pincode: "Pincode"
                }).map(([key, label]) => (
                  <label key={key} className={key.startsWith("line") ? "sm:col-span-2" : ""}>
                    <span className="text-sm font-bold">{label}</span>
                    <input
                      required={key !== "line2"}
                      value={address[key as keyof typeof address]}
                      onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                      className="mt-1 h-10 w-full rounded border border-slate-200 px-3 text-sm dark:border-white/10 dark:bg-slate-950"
                    />
                  </label>
                ))}
              </div>
              <Button className="mt-6" onClick={() => setStep("delivery")}>
                Continue
              </Button>
            </div>
          )}

          {step === "delivery" && (
            <div>
              <h1 className="text-2xl font-bold">Choose delivery speed</h1>
              <div className="mt-4 space-y-3">
                {[
                  { id: "standard", label: "Standard Delivery", eta: "3-5 business days", price: 0 },
                  { id: "express", label: "Express Delivery", eta: "1-2 business days", price: 99 }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between rounded border p-4 ${
                      deliveryMethod === opt.id ? "border-amazon-orange bg-amber-50/50" : "border-slate-200 dark:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === opt.id}
                        onChange={() => setDeliveryMethod(opt.id)}
                      />
                      <div>
                        <p className="font-bold">{opt.label}</p>
                        <p className="text-sm text-slate-500">{opt.eta}</p>
                      </div>
                    </div>
                    <span className="font-bold">{opt.price === 0 ? "FREE" : formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("address")}>
                  Back
                </Button>
                <Button onClick={() => setStep("payment")}>Continue</Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h1 className="text-2xl font-bold">Payment method</h1>
              <p className="mt-1 text-sm text-slate-500">Stripe active. Razorpay & PayPal ready for integration.</p>
              <div className="mt-4 space-y-3">
                {[
                  { id: "stripe", label: "Card / UPI (Stripe)" },
                  { id: "razorpay", label: "Razorpay", disabled: true },
                  { id: "paypal", label: "PayPal", disabled: true },
                  { id: "cod", label: "Cash on Delivery", disabled: true }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded border p-4 ${
                      paymentMethod === opt.id ? "border-amazon-orange" : "border-slate-200 opacity-60 dark:border-white/10"
                    } ${opt.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      disabled={opt.disabled}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                    />
                    <span className="font-bold">{opt.label}</span>
                    {opt.disabled && <span className="text-xs text-slate-400">(Coming soon)</span>}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("delivery")}>
                  Back
                </Button>
                <Button onClick={() => setStep("review")}>Review order</Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <form onSubmit={placeOrder}>
              <h1 className="text-2xl font-bold">Review your order</h1>
              <div className="mt-4 rounded border border-slate-200 p-4 text-sm dark:border-white/10">
                <p className="font-bold">Deliver to</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {address.fullName}, {address.line1}, {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-2">
                  <strong>Delivery:</strong> {deliveryMethod} · <strong>Payment:</strong> {paymentMethod}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button type="submit" disabled={loading || !session?.user}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Place order
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="amazon-card h-fit">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-slate-100">
                  <Image src={item.product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-2 font-medium">{item.product.title}</p>
                  <p className="text-slate-500">Qty {item.quantity}</p>
                </div>
                <strong className="text-sm">{formatPrice(item.product.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="h-10 flex-1 rounded border border-slate-200 px-3 text-sm dark:border-white/10 dark:bg-slate-950"
            />
            <Button type="button" variant="outline" onClick={validateCoupon}>
              Apply
            </Button>
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-amazon-green">
                <span>Coupon</span>
                <strong>-{formatPrice(couponDiscount)}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <strong>{shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <strong>{formatPrice(tax)}</strong>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-amazon-orange">{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-4 flex gap-2 rounded bg-emerald-50 p-3 text-xs text-amazon-green dark:bg-emerald-950/30">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Secure checkout. Payment providers ready for production.
          </p>
        </aside>
      </div>
    </div>
  );
}
