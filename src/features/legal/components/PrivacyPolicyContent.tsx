'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/ui/card'
import { Shield, Lock, Eye, RefreshCw, Mail, Database } from 'lucide-react'
import { SIMAME_CONTACT_DETAILS } from '../constants'

export const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Shield className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">1. Overview & Commitment</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            SIMAME (&quot;CONNECT&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, mobile application, or use our laundry management platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using the SIMAME platform as a customer, laundry owner, or delivery partner, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please refrain from using our services.
          </p>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Database className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">2. Information We Collect</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We collect information directly from you when you register an account, place laundry orders, manage your business, or communicate with us:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">Personal Profile Data:</strong> Name, email address, phone number, business name, and password credentials.
            </li>
            <li>
              <strong className="text-foreground">Location & Delivery Data:</strong> Physical address, delivery coordinates, pickup instructions, and geolocation during active orders.
            </li>
            <li>
              <strong className="text-foreground">Order & Transaction Details:</strong> Laundry items submitted, service categories, special wash preferences, order status history, and payment status.
            </li>
            <li>
              <strong className="text-foreground">Payment & Billing Reference:</strong> Transaction reference numbers provided by secure payment processors (e.g., Paystack/Flutterwave). We do not store raw credit card numbers or PINs on our servers.
            </li>
            <li>
              <strong className="text-foreground">Technical & Device Metadata:</strong> IP address, device type, operating system version, push notification tokens, app launch diagnostics, and crash logs via Sentry/Vercel Analytics.
            </li>
            <li>
              <strong className="text-foreground">Sign-in Data:</strong> If you sign in with Google or Apple, we receive your name and email address from that provider. Sign in with Apple lets you hide your email address; we then receive an Apple relay address instead.
            </li>
            <li>
              <strong className="text-foreground">Reviews & Feedback:</strong> Star ratings and comments you write about a laundry after a completed order, and messages you send to support.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            You can browse laundries and prices in the app without an account. We do not track you across other companies&apos; apps or websites, and we do not use your data for third-party advertising.
          </p>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Eye className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">3. How We Use Your Information</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We process your personal information for the following legitimate business purposes:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Processing, routing, and tracking laundry pickup and delivery requests between customers and partner laundries.</li>
            <li>Facilitating secure online payments and generating financial earnings reports for laundry owners.</li>
            <li>Sending critical transactional updates (order status changes, driver assignments, payment receipts) via push notifications, SMS, or email.</li>
            <li>Preventing fraudulent activity, ensuring account security, and verifying partner identity.</li>
            <li>Improving web app performance, diagnosing platform errors, and enhancing customer experience.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <RefreshCw className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">4. Information Sharing & Third Parties</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell or rent your personal data to third parties for marketing purposes. Data is shared strictly as necessary to execute our services:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">Partner Laundries & Delivery Drivers:</strong> Customer name, contact number, order items, and pickup address are shared with assigned laundry partners and logistics drivers solely for order fulfillment.
            </li>
            <li>
              <strong className="text-foreground">Payment Gateways:</strong> Payment details are processed securely via PCI-DSS compliant providers (e.g., Paystack).
            </li>
            <li>
              <strong className="text-foreground">Infrastructure Providers:</strong> Hosting and backend database providers under strict confidentiality agreements.
            </li>
            <li>
              <strong className="text-foreground">Service Providers:</strong> Clerk (account sign-in, including Google and Apple sign-in), Cloudinary (storage of profile and laundry photos), Expo and Apple/Google push services (delivering notifications), Google Maps (maps and address search), Brevo (account emails such as password resets), Arkesel (SMS/WhatsApp order alerts to our operations team), and Sentry (crash diagnostics). Each receives only the data needed for its task.
            </li>
            <li>
              <strong className="text-foreground">Price-List Scanning (laundry owners):</strong> If a laundry owner chooses to scan a photo of their price list, the photo is sent to Google (Gemini API) and, as a fallback, to OCR.space, solely to read the services and prices shown. The owner reviews every result before anything is saved. Stored copies of these photos are deleted after 30 days.
            </li>
            <li>
              <strong className="text-foreground">Legal Obligations:</strong> When required by court order, law enforcement request, or applicable data protection regulations.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We require every provider that receives personal data from us to protect it with the same or equal protection described in this policy, and to use it only to provide its service to SIMAME.
          </p>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Database className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">5. Data Retention & Account Deletion</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We keep your account data for as long as your account is open. You can delete your account at any time in the app (Settings &rarr; Account Settings &rarr; Delete account, or Settings &rarr; Privacy &amp; Terms) or through our <a href="/account-deletion" className="text-primary underline font-medium">Account Deletion Page</a>.
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>When you delete your account we immediately remove your name, email address, phone number, profile photo, saved addresses, sign-in sessions, notification devices and your sign-in identity (including revoking Sign in with Apple).</li>
            <li>Records of past orders and payments are kept in anonymised form, no longer linked to your name or contact details, only for as long as accounting, tax and dispute-resolution obligations require.</li>
            <li>Price-list photos uploaded by laundry owners are deleted after 30 days. Crash diagnostics are kept for a limited period by our diagnostics provider and then deleted.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Eye className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">6. Your Choices & Consent</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Marketing notifications</strong> (promotions, reminders, referral offers and tips) are off until you turn them on in the app under Settings &rarr; Notification Settings, where you can also turn them off again at any time. Order and payment updates are sent so your orders work.</li>
            <li><strong className="text-foreground">Location</strong> is used only while you use the app, to show nearby laundries and set pickup addresses. You can decline or withdraw it in your device settings and still browse and order by entering an address.</li>
            <li><strong className="text-foreground">Push notifications</strong> are optional and can be turned off in the app or in your device settings.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Lock className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">7. Data Security & Your Rights</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard encryption (TLS/HTTPS in transit, HttpOnly secure cookies, database encryption at rest) to safeguard your data.
          </p>
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
            <h3 className="font-semibold text-foreground m-0">Your Data Rights:</h3>
            <p className="text-sm text-muted-foreground">
              You have the right to request access to your stored personal information, request corrections to inaccurate data, or request permanent deletion of your account.
              To learn more about or request account deletion, visit our <a href="/account-deletion" className="text-primary underline font-medium">Account Deletion Page</a>.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Mail className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">8. Contact Us</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact our privacy compliance team at:
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
            <p className="font-semibold text-foreground">{SIMAME_CONTACT_DETAILS.company} Privacy Office</p>
            <p className="text-muted-foreground">Privacy Email: <a href={`mailto:${SIMAME_CONTACT_DETAILS.privacyEmail}`} className="text-primary hover:underline">{SIMAME_CONTACT_DETAILS.privacyEmail}</a></p>
            <p className="text-muted-foreground">Support Email: <a href={`mailto:${SIMAME_CONTACT_DETAILS.supportEmail}`} className="text-primary hover:underline">{SIMAME_CONTACT_DETAILS.supportEmail}</a> ({SIMAME_CONTACT_DETAILS.officialEmail})</p>
            <p className="text-muted-foreground">Phone: {SIMAME_CONTACT_DETAILS.phone}</p>
            <p className="text-muted-foreground">Location: {SIMAME_CONTACT_DETAILS.location}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
