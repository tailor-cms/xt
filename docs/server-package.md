# Server package

Server subpackage is located under `packages/server`. It exposes
server-side hooks, which can be used for authoring and `end-user`
system.

## Content element hooks

The following hooks are available for managing content element data:

Create/update content element lifecycle:
  - `beforeSave`
  - `afterSave`
  - `afterLoaded`

Fetch element lifecycle:
  - `afterRetrieve`
  - `afterLoaded`

\
![Hooks order](./assets/hooks.svg)

All hooks are called with 2 arguments. The first argument is the element itself,
and the second argument is the service bag which contains the config service
and the storage service (these services have not yet been ported into the
Content Element Kit). Hook declaration looks as follows:

```ts
function hook(element: SequelizeModel, services: Object) => element
```

The hook function returns the original or modified element. For example,
depending on the hook type, we can modify the element before saving it to the
database (beforeSave) or before delivering it to the frontend
(e.g., afterLoaded).

In the example section, we created a simple hook for our Counter element, which
resets the counter value if it reaches 10.

```ts
export function beforeSave(element, services) {
  if (element.data.count >= 10) {
    element.data = {
      ...element.data,
      count: 0,
    };
  }
  return element;
}
```
\
Hooks also enable interfacing with external libraries, server side validation
and secure operations (e.g. creating a secure direct upload link to hosting
service of choice).

::::tip ☝️ Note
All changes made by hooks are automatically propagated to the authoring
front-end using SSE (Server Side Events).
::::

## Server actions

Server actions allow content elements to define custom server-side methods
that can be called from Edit, TopToolbar, or SideToolbar components with
request/response semantics. This is useful for operations that need to run on
the server — such as calling external APIs, processing data, or performing
secure operations.

### Defining actions

Export a `call` object from your server package. Each key is an action name
and each value is a handler function:

```ts
export const call = {
  async generateSummary(element, services, payload) {
    // element - the content element instance
    // services - { config, storage } (same as hooks)
    // payload - data sent from the frontend
    const { prompt } = payload;
    const summary = await someExternalApi.generate(prompt);
    return { summary };
  },
  getStats(element) {
    return {
      wordCount: element.data.content?.split(' ').length ?? 0,
    };
  },
};

export default {
  type,
  initState,
  hookMap,
  call,
  // ...hooks
};
```

Handler signature: `(element, services, payload) => Promise<any> | any`

The `services` object contains the same `config` and `storage` services
available in hooks.

### Calling from Edit components

Actions are called via the injected `$callElementAction` function:

```ts
import type { CallElementAction } from '@tailor-cms/cek-common';

const callElementAction = inject('$callElementAction') as CallElementAction;

// Call with payload (typed return)
const { summary } = await callElementAction<{ summary: string }>('generateSummary', {
  prompt: 'Summarize this element',
});

// Call without payload
const stats = await callElementAction('getStats');
```

The function returns a Promise that resolves with the handler's return value.
See [Edit package - Calling server actions](/edit-package#calling-server-actions)
for more on typing.

### Route

Each action maps to: `POST /content-element/:id/call/:actionName`

If the action doesn't exist, a `404` response is returned.

## User state hooks

::::tip ☝️ Note
Available in versions >= 0.2.0.
::::

The server package enables user-state hooks, which one can use to manage
user-specific state of a particular element. There are two state hooks available:
  - `beforeDisplay`
  - `onUserInteraction`

The `end-user` system has the full flexibility for implementing the state
management and persistence. User-state hooks receive `displaySystemContext`,
which can be provided by the `end-user` system and used to add additional context
needed for the state resolution. For content element kit this is
mocked within the element manifest and injected into previously listed hooks.

```ts
mocks?: {
  displayContexts: Array<{ name: string; data: any }>;
};
```
::::tip ☝️ Note
Only the first value is injected at the moment. In the future versions, the
system will offer a dropdown to select the display context mock, in case one
wants to quickly mock different user states and switch between them.
::::

### `beforeDisplay` hook

`beforeDisplay` hook is responsible for resolving a user state of a particular
content element (bound as `userState` upon rendering the `Display` component).
The hook receives authored content `element`, the end-user system
`displaySystemContext` and returns a resolved user state.

```ts
function beforeDisplay(
  element: Element,
  displaySystemContext: any) => UserState
```

### `onUserInteraction` hook

`onUserInteraction` hook is triggered when the `Display` component emits the
`@interaction` event. The hook receives authored content `element`, the target
system `displaySystemContext` and the payload emitted by the `Display` component.

```ts
function onUserInteraction(
  element: Element,
  displaySystemContext: any,
  payload: any) => any
```

The `end-user` system is fully in control of the `displaySystemContext` provided
and the value returned by the `onUserInteraction` hook. If after the
`onUserInteraction` hook execution, there is a need to refresh the user state,
`onUserInteraction` hook should return `{ updateDisplayState: true }` flag,
which will result with invoking `beforeDisplay` hook and updating the
user state. In case you want to pass data to the `beforeDisplay` hook
from the `onUserInteraction` hook, simply return the `transientState` property
containing the data (alongside `updateDisplayState` flag). This will be
injected into the `displaySystemContext` for you upon the `beforeDisplay` hook
call (`tce-boot` >= `0.2.1`).

### Mocking `end-user` system state persistence and handling

In addition to the context mock, one might want to mimic the persistence and
context handling mechanism. At the moment, it is possible to rely on the
`CEK_RUNTIME` env variable to detect if the hook is running within the
development runtime and inject any arbitrary development specific code
in order to achieve this behaviour.
