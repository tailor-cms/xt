# Installation

Here you will find information on setting up and running the Content Element Kit.

## Prerequisites

- macOS or Linux
- [node](https://nodejs.org/en) - We recommend you have either 16.x or 20.x
  installed.
- [pnpm](https://pnpm.io/installation) version 8.x.
- git

## Setup

To get started, simply open up the terminal and run:

```bash
npx @tailor-cms/tce-template
```

This command will initialize the project. It will ask you some questions (name,
desc, author, etc). Once all questions are answered, it will install all the
dependencies. The next step is to navigate to the project folder and launch it:

```bash
cd <project-name>
pnpm dev
```

The application is now running on http://localhost:8080. The browser window
should automatically pop out and display the preview. Well done!
