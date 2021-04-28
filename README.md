# Omise/OPN React Challenge

## To serve locally

```sh
npm install
npm run serve
```

This runs a dev server at http://localhost:1234

## To run the tests

```sh
npm test
```

## About this attempt

This is a maintenance-first approach to the challenge. The UI tries to match the provided screenshot using only Tailwind CSS, with some basic modifications for functionality.

Most of the focus here is on code-level organisation and testability:

- the business-layer (API communication) is separated and has all dependencies injected
- components that require these as dependencies (currently only `App`) must have them explicitly injected
- default instances are exported to make it easy to "get things done" then come back and test

This allows each layer of the application to be unit tested by mocking and injecting only it's dependencies. One benefit is that this explicitly documents which components can access each service. Using React Contexts does this implicitly and increases complexity, while at the same time you lose some control over what you can test effectively.
