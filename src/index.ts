import createSpoofer from './createSpoofer'

import type {AlternativeDateConstructor} from './types.t'

type DateSpooferConstructor = {
  new (): never
  create: typeof createSpoofer
  restore: AlternativeDateConstructor['restore']
}

const restore = createSpoofer.restore

const DateSpoofer = class {
  constructor () {
    throw new Error('DateSpoofer is static')
  }
} as DateSpooferConstructor

DateSpoofer.create = createSpoofer
DateSpoofer.restore = createSpoofer.restore

export default DateSpoofer

export {
  createSpoofer as create,
  restore
}
