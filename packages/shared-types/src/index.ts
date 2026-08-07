export * from './payload-types'

/**
 * Payload derives the generated interface name from the collection slug using
 * an English singulariser, which leaves the Polish plural `poradnie` unchanged.
 * This alias gives a single document its correct singular name.
 */
export type { Poradnie as Poradnia } from './payload-types'
