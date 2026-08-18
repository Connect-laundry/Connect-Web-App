import Image from 'next/image'
import { marketingImages } from '@/features/marketing/constants/images'

/** Hero: doorstep delivery + laundry detail inset */
export const HeroPhoto = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
        <Image
          src={marketingImages.heroDelivery}
          alt="Laundry delivery to your doorstep"
          width={1200}
          height={800}
          className="w-full h-[400px] sm:h-[460px] lg:h-[540px] object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/50 via-primary/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
          <p className="text-white/90 text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Free pickup & delivery
          </p>
          <p className="text-white text-xl sm:text-2xl font-black max-w-md leading-tight">
            Clean clothes, delivered to your door.
          </p>
        </div>
      </div>

      {/* Inset — folded laundry */}
      <div className="absolute -bottom-6 -right-2 sm:right-6 w-[42%] max-w-[220px] rounded-2xl overflow-hidden shadow-xl ring-4 ring-background hidden sm:block">
        <Image
          src={marketingImages.heroLaundryDetail}
          alt="Freshly cleaned and folded laundry"
          width={440}
          height={320}
          className="w-full h-36 object-cover"
          unoptimized
        />
      </div>

      {/* Floating badge */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 rounded-full bg-card/95 backdrop-blur-md px-4 py-2 shadow-lg border border-white/20 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <span className="text-xs font-bold text-foreground">Drivers on route now</span>
      </div>
    </div>
  )
}
