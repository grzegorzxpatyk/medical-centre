import {
  Activity,
  Baby,
  Bone,
  Brain,
  BriefcaseMedical,
  Eye,
  HeartPulse,
  Stethoscope,
  Syringe,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { Service } from '@medical-centre/shared-types'

/** Keys mirror the `icon` select options in apps/cms/src/collections/Services.ts */
const icons: Record<Service['icon'], LucideIcon> = {
  stethoscope: Stethoscope,
  baby: Baby,
  'heart-pulse': HeartPulse,
  'user-round': UserRound,
  'briefcase-medical': BriefcaseMedical,
  syringe: Syringe,
  brain: Brain,
  eye: Eye,
  bone: Bone,
  activity: Activity,
}

export function ServiceIcon({ name, className }: { name: Service['icon']; className?: string }) {
  const Icon = icons[name] ?? Stethoscope
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}
