# Example

The goal of this section is to give a hands-on example on how to create a
simple content element. We'll be creating a simple counter, with a bit of a
twist to demonstrate the server side hooks.

Let's start by initializing a new project:

```bash
npx @tailor-cms/tce-template
```

name it `tce-counter` and follow the instructions.

```bash
cd tce-counter
pnpm dev
```

your browser should pop up and display the preview. During the initial boot
components will reload few times, and it might take some time for `Edit`
component (left panel) to show up.

::: tip Note
In case the Edit component does not show up within 30 seconds, please restart.
There is a reported defect appearing on the first boot while dependencies
are being optimized.
:::

