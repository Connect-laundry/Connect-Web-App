'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/ui/card'
import { FileText, CheckCircle2, AlertTriangle, CreditCard, RefreshCcw, Scale, HelpCircle } from 'lucide-react'
import { SIMAME_CONTACT_DETAILS } from '../constants'

export const TermsOfServiceContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">1. Agreement to Terms</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to SIMAME (&quot;CONNECT&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, mobile apps, and laundry management services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By creating an account, booking a service, or managing a laundry business on SIMAME, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
          </p>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">2. Scope of Platform Services</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            SIMAME acts as a technology platform connecting customers seeking laundry, dry cleaning, and garment care services with registered local laundry service providers and independent delivery partners.
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Customers:</strong> Can request laundry pickup, customize washing preferences, track order status in real time, and pay securely.</li>
            <li><strong className="text-foreground">Laundry Owners:</strong> Can manage order lifecycles (accept, process, assign drivers, mark completed), set catalog pricing, view earnings analytics, and manage staff.</li>
            <li><strong className="text-foreground">Logistics Partners:</strong> Can accept dispatch requests for pickup and delivery of garments.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">3. User Accounts & Responsibilities</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            To use certain features, you must register for an account. You represent and warrant that:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>You are at least 18 years of age or possess legal parental/guardian consent.</li>
            <li>All information you provide during registration is accurate, current, and complete.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You will immediately notify us of any unauthorized use of your account.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <CreditCard className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">4. Pricing, Payments & Payouts</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            All prices displayed on SIMAME are set by partner laundries or standard platform pricing tiers and are payable in local currency (GHS / NGN as applicable).
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Payment Authorization:</strong> Payments are charged upon order confirmation via integrated payment gateways (Paystack/Flutterwave).</li>
            <li><strong className="text-foreground">Delivery Fees:</strong> Applicable pickup and delivery charges will be transparently calculated and displayed prior to checkout.</li>
            <li><strong className="text-foreground">Partner Owner Earnings:</strong> Earnings from completed orders are calculated net of platform service fees and remitted to the partner&apos;s verified bank account per settlement schedules.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <RefreshCcw className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">5. Cancellations, Refunds & Garment Policy</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We aim for maximum customer satisfaction and quality garment care:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong className="text-foreground">Order Cancellation:</strong> Orders may be cancelled free of charge prior to driver pickup. Cancellations after pickup may incur a transport fee.</li>
            <li><strong className="text-foreground">Inspection & Care:</strong> Partner laundries inspect garments upon intake. Items with pre-existing damage, delicate care instructions, or stain risks will be flagged.</li>
            <li><strong className="text-foreground">Damaged or Lost Items:</strong> Claims regarding damaged or missing garments must be reported within 24 hours of delivery with photo evidence. Verified claims will be compensated according to our garment protection policy.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Scale className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">6. Limitation of Liability & Governing Law</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by applicable law, SIMAME shall not be liable for indirect, incidental, special, or consequential damages arising out of your use of the platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the Republic of Ghana, without regard to its conflict of law provisions.
          </p>
        </CardContent>
      </Card>

      <Card className="surface-card border border-border/50">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <HelpCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold m-0">7. Questions & Support</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions regarding these Terms of Service, please contact our support team:
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
            <p className="font-semibold text-foreground">{SIMAME_CONTACT_DETAILS.company} Legal Team</p>
            <p className="text-muted-foreground">Email: <a href={`mailto:${SIMAME_CONTACT_DETAILS.supportEmail}`} className="text-primary hover:underline">{SIMAME_CONTACT_DETAILS.supportEmail}</a></p>
            <p className="text-muted-foreground">Phone: {SIMAME_CONTACT_DETAILS.phone}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
