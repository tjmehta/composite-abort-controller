import FastAbortController, { FastAbortSignal } from 'fast-abort-controller'

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

  private handleAbort = (signal: AbortSignalType) => {
    // @ts-ignore
    this.aborted = [...this.signals].every((signal) => signal.aborted)
    if (this.aborted) this.dispatchEvent({ type: 'abort' } as Event)
  }

  add(signal: AbortSignalType) {
    const self = this
    this.signals.add(signal)
    if (signal.aborted === true) return
    signal.addEventListener('abort', function handleAbort() {
      signal.removeEventListener('abort', handleAbort)
      self.handleAbort(this)
    })
  }
}

export const CompositeAbortSignal = AbortSignal

export default class CompositeAbortController extends FastAbortController {
  signal: AbortSignal

  constructor(signals?: Iterable<AbortSignalType>) {
    super()
    this.signal = new CompositeAbortSignal(signals)
  }

  addSignal(signal: AbortSignalType) {
    this.signal.add(signal)
  }
}
