# Nano Events

Simple and tiny event emitter library for JavaScript.

* Only **107 bytes** (minified and brotlied).
  It uses [Size Limit] to control size.
* The `on` method returns `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* TypeScript and ES modules support.
* No aliases, just `emit` and `on` methods.
  No Node.js [EventEmitter] compatibility.

```js
import { createNanoEvents } from 'nanoevents'

const emitter = createNanoEvents()

const unbind = emitter.on('tick', volume => {
  summary += volume
})

emitter.emit('tick', 2)
summary //=> 2

unbind()
emitter.emit('tick', 2)
summary //=> 2
```

[EventEmitter]: https://nodejs.org/api/events.html
[Size Limit]:   https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=nanoevents">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Docs
Read full docs **[here](https://github.com/ai/nanoevents#readme)**.
