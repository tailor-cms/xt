# Server package

Server subpackage is located under `packages/server`. It exposes
Content Element server hooks, which can be used for authoring and end-user
system.

The following hooks are available:

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

