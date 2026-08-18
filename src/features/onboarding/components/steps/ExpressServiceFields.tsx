import { Zap } from 'lucide-react'
import { Switch } from '@/shared/ui/switch'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  emptyExpressSetting,
  type ExpressByService,
  type ExpressSetting,
} from '../../types'

interface ExpressServiceFieldsProps {
  /** Which service this block configures (service category or weight key). */
  serviceKey: string
  /** Label shown in the header, e.g. "wash only". */
  serviceLabel: string
  express: ExpressByService
  setExpress: (updater: (prev: ExpressByService) => ExpressByService) => void
}

/**
 * Express opt-in for ONE service type: faster turnaround at a % surcharge.
 * Each service (wash only / wash + ironing / ironing only, or the weight
 * tariff) carries its own toggle, hours, and surcharge.
 */
export const ExpressServiceFields = ({
  serviceKey,
  serviceLabel,
  express,
  setExpress,
}: ExpressServiceFieldsProps) => {
  const setting: ExpressSetting = express[serviceKey] ?? emptyExpressSetting()

  const update = (patch: Partial<ExpressSetting>) =>
    setExpress((prev) => ({
      ...prev,
      [serviceKey]: { ...(prev[serviceKey] ?? emptyExpressSetting()), ...patch },
    }))

  const surcharge = Number(setting.surcharge_percent)

  return (
    <div className="space-y-4 rounded-lg border-2 border-amber-500/20 bg-amber-500/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Zap className="w-4 h-4 text-amber-500" />
          Express for {serviceLabel}
        </div>
        <Switch
          checked={setting.enabled}
          onCheckedChange={(v) => update({ enabled: v })}
        />
      </div>
      {setting.enabled ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2 sm:col-span-1">
              <Label htmlFor={`express-hours-${serviceKey}`}>Express turnaround (hours)</Label>
              <Input
                id={`express-hours-${serviceKey}`}
                type="number"
                min="1"
                placeholder="e.g. 12"
                value={setting.hours}
                onChange={(e) => update({ hours: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2 sm:col-span-1">
              <Label htmlFor={`express-pct-${serviceKey}`}>Extra charge (%)</Label>
              <Input
                id={`express-pct-${serviceKey}`}
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={setting.surcharge_percent}
                onChange={(e) => update({ surcharge_percent: e.target.value })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {surcharge > 0
              ? `Example: a GH₵ 100 ${serviceLabel} order becomes GH₵ ${(100 * (1 + surcharge / 100)).toFixed(2)} on express.`
              : 'Customers pay this percentage extra for the faster turnaround.'}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Turn on if you offer a faster turnaround for {serviceLabel} at an extra charge.
        </p>
      )}
    </div>
  )
}
