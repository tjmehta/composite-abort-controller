import { FastAbortController, FastAbortSignal } from 'fast-abort-controller'

import AbortSignalType from './AbortSignalType'

// AbortSignal classes must be named "AbortSignal" to work with node-fetch..
class AbortSignal extends FastAbortSignal {
  private signals = new Set<AbortSignalType>()

  constructor(signals?: Iterable<AbortSignalType>) {
    super()
    if (signals != null) {
      for (const signal of signals) {
        this.add(signal)
      }
      // @ts-ignore
      this.aborted = [...this.signals].every((signal) => signal.aborted)
    }
  }

  private handleAbort = () => {
    if (this.aborted) return
    // @ts-ignore
    this.aborted = [...this.signals].every((signal) => signal.aborted)
    if (this.aborted) {
      const event =
        typeof Event != 'undefined'
          ? new Event('abort')
          : ({ type: 'abort' } as Event)
      this.dispatchEvent(event)
    }
  }

  add(signal: AbortSignalType) {
    const self = this
    this.signals.add(signal)
    // @ts-ignore
    this.aborted = this.aborted && signal.aborted
    if (signal.aborted === true) return
    signal.addEventListener('abort', function handleAbort() {
      signal.removeEventListener('abort', handleAbort)
      self.handleAbort()
    })
  }
}

export const CompositeAbortSignal = AbortSignal

export default class CompositeAbortController extends FastAbortController {
  // @ts-ignore
  signal: AbortSignal

  constructor(signals?: Iterable<AbortSignalType>) {
    super()
    this.signal = new CompositeAbortSignal(signals)
  }

  addSignal(signal: AbortSignalType) {
    this.signal.add(signal)
  }
}
