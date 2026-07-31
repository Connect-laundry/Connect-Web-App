import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Check, Loader2, LocateFixed, Lock, MapPin, Navigation, Search } from 'lucide-react'
import { NumberField } from '../fields/NumberField'
import { useLocationCapture, type LocationMode } from '../../hooks/useLocationCapture'

const MODE_OPTIONS: { id: LocationMode; label: string; icon: typeof Search; hint: string }[] = [
  { id: 'gps', label: 'I’m at my shop', icon: LocateFixed, hint: 'Use GPS' },
  { id: 'search', label: 'Search address/area', icon: Search, hint: 'Not at shop' },
]

export function LocationStep() {
  const form = useFormContext()
  const loc = useLocationCapture()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="Adum, near Kejetia Market" {...field} />
            </FormControl>
            <FormDescription>A short description customers can find you by.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="Kumasi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Locate from typed address button for remote owners */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={loc.locateFromFormAddress}
          disabled={loc.isSearching}
          className="gap-2 text-xs font-semibold"
        >
          {loc.isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5 text-primary" />}
          Get Coordinates from Street Address & City
        </Button>
      </div>

      {/* Map Coordinates Section */}
      <div className="space-y-3 pt-4 border-t">
        <div>
          <FormLabel className="m-0 flex items-center justify-between">
            <span>Business Coordinates</span>
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3" /> Auto-populated
            </span>
          </FormLabel>
          <p className="text-xs text-muted-foreground mt-1">
            Choose how to set your shop&apos;s map location. If you are not physically at your shop, use &ldquo;Search address/area&rdquo;.
          </p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2">
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const active = loc.mode === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => loc.switchMode(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center text-xs transition-all ${
                  active
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-muted text-muted-foreground hover:border-primary/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-semibold">{opt.label}</span>
                <span className="opacity-70">{opt.hint}</span>
              </button>
            )
          })}
        </div>

        {/* GPS mode */}
        {loc.mode === 'gps' && (
          <div className="space-y-2">
            {!loc.detected ? (
              <Button
                type="button"
                variant="outline"
                className="w-full font-bold gap-2"
                onClick={loc.detectLocation}
                disabled={loc.isLocating}
              >
                {loc.isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <LocateFixed className="w-4 h-4 text-primary" />
                )}
                {loc.isLocating ? 'Detecting your GPS position…' : 'Use Current Location'}
              </Button>
            ) : (
              <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" /> GPS location captured successfully
                </p>
                <button
                  type="button"
                  className="text-xs text-green-700 font-bold underline"
                  onClick={() => loc.reset()}
                >
                  Re-detect
                </button>
              </div>
            )}
          </div>
        )}

        {/* Address search mode (for owners not at their shop) — type-ahead. */}
        {loc.mode === 'search' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Type your laundry business landmark or area (e.g. &ldquo;Kejetia Market, Kumasi&rdquo; or &ldquo;Osu, Accra&rdquo;).
            </p>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search business location, area or landmark..."
                value={loc.addressSearch}
                onChange={(e) => loc.onSearchChange(e.target.value)}
                autoComplete="off"
                className="pl-9 pr-9"
              />
              {loc.isSearching && (
                <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}

              {loc.suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-background shadow-lg">
                  {loc.suggestions.map((s, i) => (
                    <li key={`${s.latitude},${s.longitude}-${i}`}>
                      <button
                        type="button"
                        onClick={() => loc.selectSuggestion(s)}
                        className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-primary/5 transition-colors border-b last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <div>
                          <span className="font-medium text-slate-900">{s.formatted_address}</span>
                          {s.city && <span className="block text-xs text-muted-foreground">{s.city}</span>}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!loc.isSearching &&
              !loc.detected &&
              loc.suggestions.length === 0 &&
              loc.addressSearch.trim().length >= 3 && (
                <p className="text-xs text-muted-foreground">No matches yet — keep typing area or city name.</p>
              )}

            {loc.detected && (
              <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" /> Location selected from search
                </p>
                <button
                  type="button"
                  className="text-xs text-green-700 font-bold underline"
                  onClick={() => loc.reset(true)}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {loc.error && (
          <Alert variant="destructive" className="py-2 bg-destructive/5 text-destructive border-destructive/20">
            <AlertDescription className="text-xs font-medium">{loc.error}</AlertDescription>
          </Alert>
        )}

        {/* Lat/Lng fields — strictly read-only */}
        <div className="grid grid-cols-2 gap-4">
          <NumberField name="latitude" label="Latitude" step="any" placeholder="6.6885" readOnly />
          <NumberField name="longitude" label="Longitude" step="any" placeholder="-1.6244" readOnly />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
          Coordinates are read-only and automatically filled by your selected location method above.
        </p>
      </div>
    </div>
  )
}
