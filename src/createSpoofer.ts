// import globalThis from 'global-object'
// import isReadonly from './isReadonly'
import type {Noop, TimeModifier, AlternativeDateConstructor, SpooferOptions} from './types.t'

const OriginDate = Date

const globalThis = global

const noop: Noop = (arg) => arg

const defaultOptions = {
  modifyEveryCreation: false
}

const createSpoofer = (modify?: TimeModifier, options?: SpooferOptions) => {
  const modifyTime: TimeModifier = modify || noop

  const {modifyEveryCreation} = {...defaultOptions, ...options}

  /**
   * An alternate constructor
   * @param {...any} args - Date constructor args
   */
  const constructor = function (this: Date, arg: ConstructorParameters<typeof OriginDate>[0]) {
    if (!arg || modifyEveryCreation) {
      const currentTime = this.getTime()
      const alternateTime = modifyTime(currentTime)
      if (currentTime !== alternateTime) {
        this.setTime(alternateTime)
      }
    }
  }

  /**
   * An alternate now() function
   * @returns The current time in milliseconds
   */
  const now = function (): number {
    return modifyTime(OriginDate.now())
  }

  const AlternateDate = class extends OriginDate {
    constructor (...args: ConstructorParameters<typeof Date>) {
      super(...args)
      constructor.call(this, ...args)
    }

    static apply (globalObject = globalThis) {
      globalObject.Date = AlternateDate as unknown as DateConstructor
      return () => AlternateDate.restore(globalObject)
    }

    static restore (globalObject = globalThis) {
      if (globalObject.Date === (AlternateDate as unknown as DateConstructor)) {
        globalObject.Date = OriginDate
      }
    }
  }

  // assinging functions
  Object.getOwnPropertyNames(OriginDate).forEach((name) => {
    if (typeof AlternateDate[name as keyof AlternativeDateConstructor] === 'function') {
      (AlternateDate as any)[name] = (OriginDate as any)[name]
    }
  })

  AlternateDate.now = now

  return AlternateDate as AlternativeDateConstructor
}

createSpoofer.restore = () => {
  if (globalThis.Date !== OriginDate) {
    globalThis.Date = OriginDate
  }
}

export default createSpoofer
