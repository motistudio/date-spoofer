import DateSpoofer, {create as createSpoofer, restore} from '../src'

describe('Main instance', () => {
  test('Should have a static main instance', () => {
    expect(typeof DateSpoofer).toBe('function')
    expect(() => new DateSpoofer()).toThrow(Error)
  })

  test('Should have a static create method', () => {
    expect(DateSpoofer.create).toBe(createSpoofer)
  })

  test('Should export functions', () => {
    expect(typeof createSpoofer).toBe('function')
    expect(typeof restore).toBe('function')
  })

  test('Can spoof and restore from the main instance', () => {
    const OriginDate = global.Date
    const Date2 = createSpoofer()
    Date2.apply()
    expect(global.Date).toBe(Date2)
    restore()
    expect(global.Date).not.toBe(Date2)
    expect(global.Date).toBe(OriginDate)
  })
})
