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
          </ul>
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
              <strong className="text-foreground">Legal Obligations:</strong> When required by court order, law enforcement request, or applicable data protection regulations.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Lock className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">5. Data Security & Your Rights</h2>
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
            <h2 className="text-xl font-bold m-0">6. Contact Us</h2>
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
