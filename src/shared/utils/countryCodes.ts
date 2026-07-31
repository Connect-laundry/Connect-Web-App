export interface CountryCodeInfo {
  code: string
  label: string
  country: string
  placeholder: string
}

export const countryCodes: CountryCodeInfo[] = [
  { code: '+233', label: 'Ghana (+233)', country: 'GH', placeholder: '20 000 0000' },
  { code: '+234', label: 'Nigeria (+234)', country: 'NG', placeholder: '803 000 0000' },
  { code: '+1', label: 'US/Canada (+1)', country: 'US', placeholder: '201-555-0123' },
  { code: '+44', label: 'UK (+44)', country: 'GB', placeholder: '7911 123456' },
  { code: '+254', label: 'Kenya (+254)', country: 'KE', placeholder: '700 000000' },
  { code: '+27', label: 'South Africa (+27)', country: 'ZA', placeholder: '82 000 0000' },
  { code: '+91', label: 'India (+91)', country: 'IN', placeholder: '98765 43210' },
  { code: '+971', label: 'UAE (+971)', country: 'AE', placeholder: '50 000 0000' },
  { code: '+256', label: 'Uganda (+256)', country: 'UG', placeholder: '700 000000' },
  { code: '+255', label: 'Tanzania (+255)', country: 'TZ', placeholder: '600 000 000' },
  { code: '+230', label: 'Mauritius (+230)', country: 'MU', placeholder: '5000 0000' },
  { code: '+49', label: 'Germany (+49)', country: 'DE', placeholder: '151 2345678' },
  { code: '+33', label: 'France (+33)', country: 'FR', placeholder: '6 00 00 00 00' },
  { code: '+34', label: 'Spain (+34)', country: 'ES', placeholder: '600 000 000' },
  { code: '+39', label: 'Italy (+39)', country: 'IT', placeholder: '300 000 0000' },
  { code: '+61', label: 'Australia (+61)', country: 'AU', placeholder: '400 000 000' },
  { code: '+81', label: 'Japan (+81)', country: 'JP', placeholder: '90 1234 5678' },
  { code: '+86', label: 'China (+86)', country: 'CN', placeholder: '130 0000 0000' },
  { code: '+55', label: 'Brazil (+55)', country: 'BR', placeholder: '11 90000-0000' },
  { code: '+52', label: 'Mexico (+52)', country: 'MX', placeholder: '55 1234 5678' },
  { code: '+65', label: 'Singapore (+65)', country: 'SG', placeholder: '8000 0000' },
  { code: '+60', label: 'Malaysia (+60)', country: 'MY', placeholder: '12-345 6789' },
  { code: '+62', label: 'Indonesia (+62)', country: 'ID', placeholder: '812-3456-7890' },
  { code: '+63', label: 'Philippines (+63)', country: 'PH', placeholder: '900 000 0000' },
  { code: '+66', label: 'Thailand (+66)', country: 'TH', placeholder: '80 000 0000' },
  { code: '+84', label: 'Vietnam (+84)', country: 'VN', placeholder: '90 123 4567' },
  { code: '+90', label: 'Turkey (+90)', country: 'TR', placeholder: '500 000 0000' },
  { code: '+966', label: 'Saudi Arabia (+966)', country: 'SA', placeholder: '50 000 0000' },
  { code: '+20', label: 'Egypt (+20)', country: 'EG', placeholder: '100 000 0000' },
  { code: '+212', label: 'Morocco (+212)', country: 'MA', placeholder: '600 000000' },
] as const
