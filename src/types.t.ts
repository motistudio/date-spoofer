export type Noop = <T>(arg: T) => T

export type TimeModifier = (timestamp: number) => number

export type AlternativeDateConstructor = DateConstructor & {
  apply: (globalObject?: typeof globalThis) => () => void
  restore: (globalObject?: typeof globalThis) => void
}

export type SpooferOptions = {
  modifyEveryCreation: boolean
}