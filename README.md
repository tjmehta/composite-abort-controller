# CompositeAbortController

abort controller and abort signal classes that compose multiple abort signals

# Installation

```sh
npm i --save composite-abort-controller
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import CompositeAbortController from 'composite-abort-controller'
// commonjs
const CompositeAbortController = require('composite-abort-controller').default
```

#### Example 1: Compose AbortSignals into one via CompositeAbortController

```js
import CompositeAbortController from 'composite-abort-controller'

const sourceControllers = [
  new AbortController(),
  new AbortController(),
  new AbortController(),
]
const sourceSignals = sourceControllers.map((c) => c.signal)

const controller = new CompositeAbortController(sourceSignals)
const signal = controller.signal()
console.log(signal.aborted) // false
signal.addEventListener('abort', handleAbort)

sourceControllers.forEach((controller) => controller.abort())
console.log(signal.aborted) // true
function handleAbort() {
  console.log('all signals aborted')
}
```

#### Example 2: Compose AbortSignals into one via CompositeAbortSignal

```js
import { CompositeAbortSignal } from 'composite-abort-controller'

const sourceControllers = [
  new AbortController(),
  new AbortController(),
  new AbortController(),
]
const sourceSignals = sourceControllers.map((c) => c.signal)

const signal = new CompositeAbortSignal(sourceSignals)
console.log(signal.aborted) // false
signal.addEventListener('abort', handleAbort)

sourceControllers.forEach((controller) => controller.abort())
console.log(signal.aborted) // true
function handleAbort() {
  console.log('all signals aborted')
}
```

#### Example 3: Add AbortSignals to a existing CompositeAbortController

```js
const compositeAbortController = new CompositeAbortController(sourceSignals)
const newController = new AbortController()

compositeAbortController.addSignal(newController.signal)
```

#### Example 4: Add AbortSignals to a existing CompositeAbortSignal

```js
const compositeAbortController = new CompositeAbortController(sourceSignals)
const compositeAbortSignal = compositeAbortController.signal
const newController = new AbortController()

compositeAbortSignal.add(newController.signal)
```

# License

MIT
