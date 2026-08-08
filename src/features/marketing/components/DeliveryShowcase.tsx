import Image from 'next/image'
import { marketingImages } from '@/features/marketing/constants/images'

/** Wide banner for How it works — delivery moment */
export function DeliveryShowcase({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={marketingImages.deliveryCourier}
        alt="SIMAME delivery partner on the way with your order"
        width={1200}
        height={400}
        className="w-full h-48 sm:h-56 object-cover object-[center_30%]"
        unoptimized
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary/60 to-transparent" />
      <p className="absolute bottom-4 left-5 text-white font-bold text-lg max-w-xs drop-shadow-md">
        Your valet picks up, our partners clean, we deliver back.
      </p>
    </div>
  )
}
