import CompositeAbortController, { CompositeAbortSignal } from '../index'

import times from 'times-loop'

describe('CompositeAbortController', () => {
  it('should create an instance of fast abort controller', () => {
    const controller = new CompositeAbortController()
    expect(controller).toBeInstanceOf(CompositeAbortController)
    expect(controller.signal.aborted).toEqual(false)
  })

  it('should abort', () => {
    const controller = new CompositeAbortController()
    expect(controller.signal.aborted).toBe(false)
    const handleAbort = jest.fn()
    controller.signal.addEventListener('abort', handleAbort)
    controller.abort()
    expect(controller.signal.aborted).toBe(true)
    expect(handleAbort).toHaveBeenCalledTimes(1)
  })
})

describe('CompositeAbortSignal', () => {
  it('should support static abort', () => {
    const signal = CompositeAbortSignal.abort()
    expect(signal.aborted).toBe(true)
  })

  it('should be aborted if signals are aborted', () => {
    const controllers = times(3, () => new CompositeAbortController())
    const signals = controllers.map((c) => {
      c.abort()
      return c.signal
    })
    const signal = new CompositeAbortSignal(signals)
    expect(signal.aborted).toBe(true)
  })

  it('should not be aborted if all signals are not aborted', () => {
    const controllers = times(3, () => new CompositeAbortController())
    const signals = controllers.map((c) => {
      c.abort()
      return c.signal
    })
    const signal = new CompositeAbortSignal([
      ...signals,
      new CompositeAbortController().signal,
    ])
    expect(signal.aborted).toEqual(false)
  })

  it('should emit abort when all signals have aborted', () => {
    const controllers = times(3, () => new CompositeAbortController())
    const signals = controllers.map((c) => {
      c.abort()
      return c.signal
    })
    const unaborted = new CompositeAbortController()
    const signal = new CompositeAbortSignal([...signals, unaborted.signal])
    const handleAbort = jest.fn()
    signal.addEventListener('abort', handleAbort)
    unaborted.abort()
    expect(signal.aborted).toBe(true)
    expect(handleAbort).toBeCalledTimes(1)
  })

  it('should not be aborted if all signals are not aborted (added)', () => {
    const controllers = times(3, () => new CompositeAbortController())
    const signals = controllers.map((c) => {
      c.abort()
      return c.signal
    })
    const signal = new CompositeAbortSignal([
      ...signals,
      new CompositeAbortController().signal,
    ])
    signal.add(new CompositeAbortController().signal)
    expect(signal.aborted).toEqual(false)
  })

  it('should emit abort when all signals have aborted', () => {
    const controllers = times(3, () => new CompositeAbortController())
    const signals = controllers.map((c) => {
      c.abort()
      return c.signal
    })
    const unaborted = new CompositeAbortController()
    const signal = new CompositeAbortSignal([...signals, unaborted.signal])
    const handleAbort = jest.fn()
    signal.addEventListener('abort', handleAbort)
    const unaborted2 = new CompositeAbortController()
    signal.add(unaborted2.signal)
    unaborted.abort()
    expect(signal.aborted).toBe(false)
    unaborted2.abort()
    expect(signal.aborted).toBe(true)
    expect(handleAbort).toBeCalledTimes(1)
  })
})
