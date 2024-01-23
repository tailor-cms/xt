# Enviroment variables

You can use `.env` configuration file to configure `Content Element Kit` runtime
and pass configuration to the content element backend.

\
There are two types of enviroment variables:

- `TCE_` prefixed variables; variable names will be casted into `camelCase` and
  exposed within `config` property of `HookServices`:

  ```ts
  export function beforeSave(element: Element, services: HookServices) {
    const { config } = services;
    // Will print out TCE_ prefixed env variables
    console.log(config);
    return element;
  }
  ```

- `Content Element Kit` variables, used to configure service ports and
  end-user URLs.

\
Initialize configuration file by running:
```sh
cp .env.example .env
```

This will create .env file with the following values:
```sh
# Service ports
PREVIEW_RUNTIME_PORT=8001
EDIT_RUNTIME_PORT=8002
DISPLAY_RUNTIME_PORT=8003
SERVER_RUNTIME_PORT=8004

# External urls
PREVIEW_RUNTIME_URL=http://localhost:8001
EDIT_RUNTIME_URL=http://localhost:8002
DISPLAY_RUNTIME_URL=http://localhost:8003
SERVER_RUNTIME_URL=http://localhost:8004

# Content Element env variables; TCE_ prefix is required
# Will be loaded to the server runtime
TCE_TEST=123
```

:::tip Port configuration!
Upon changing the service runtime ports, make sure that external url has the
matching port (or is pointing to service).
:::
