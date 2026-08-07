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
import type { Poradnia } from '@medical-centre/shared-types'

/** Keys mirror the `icon` select options in apps/cms/src/collections/Poradnie.ts */
const icons: Record<Poradnia['icon'], LucideIcon> = {
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

export function PoradniaIcon({ name, className }: { name: Poradnia['icon']; className?: string }) {
  const Icon = icons[name] ?? Stethoscope
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}
