# How to contribute 

First off, thanks for taking the time to contribute!

It is truly appreciated 😊

Please note we have a [code of conduct](./CODE_OF_CONDUCT.md). Follow it in all your interactions with the project.

- [How to contribute](#how-to-contribute)
  - [General Guidelines](#general-guidelines)
  - [Project structure](#project-structure)
    - [`src/`](#src)
    - [`tests/`](#tests)
    - [`public/`](#public)
  - [How does the plugin work](#how-does-the-plugin-work)
  - [Developing](#developing)
    - [Pre-requisites](#pre-requisites)
    - [Install](#install)
    - [Starting the demo page](#starting-the-demo-page)
    - [Running tests](#running-tests)
  - [Writing tests](#writing-tests)
  - [License](#license)

## General Guidelines

- Before creating a new PR, please discuss the change via an issue
- If adding a new feature, write the corresponding tests
- Ensure that nothing is broken. You can use the demo page for that
- If applicable, update the documentation
- When solving a bug, please provide the steps to reproduce it. Codesandbox is your best friend for that


## Project structure

This project has 6 main folders:

- `build/`: Production Rollup build configuration
- `examples/`: Example projects showing regular Vue and Nuxt integration
- `nuxt/`: Nuxt module files
- `public/`: Demo page's code
- `src/`: Vue Toastification's code
- `tests/`: All of the tests

The main folders you'll probably be working with will be `src/`, `tests/` and `public/`.

### `src/`
These are all the files used by the plugin. Its folders and files are separated by type:

- `components/`: Plugin's Vue components. These are the Toast itself, close button, icon, progress bar, etc
- `scss/`: All of the plugin's styling files are here
- `ts/`: Typescript files containing constants and other helper methods used across the components
- `types/`: Main typescript types and interfaces
- `index.ts`: Plugin entry point

### `tests/`
Inside the `tests/` folder you'll find some test utilities under `utils/` and the unit tests under `unit/`. All of the tests are separated by the files they are testing, under the same folder structure as in `src/`.

We use [Jest](https://github.com/facebook/jest) and [Vue Test Utils](https://vue-test-utils.vuejs.org/) for testing.

If you've never written tests for Vue, you may find this [guide](https://lmiller1990.github.io/vue-testing-handbook/) helpful. You may also check out our [testing guide](#writing-tests) to learn how to write effective tests for this plugin.


### `public/`
This folder contains the code for the demo.


## How does the plugin work

Most Vue plugins either add a new property to the Vue instance or make custom components available. Vue Toastification more or less does both by providing a series of methods to the Vue instance that manipulate dynamically generated components.

When the user calls `Vue.use(Toast)`, Vue Toastification [creates](https://github.com/Maronato/vue-toastification/blob/da6c8c6d2f687efe033f50204ef288abd6d65cd6/src/ts/interface.ts#L15) a new Vue component tree on the HTML body's root (you may choose the location using the `container` plugin option) and creates a [`VtToastContainer`](./src/components/VtToastContainer.vue) on it. It automatically mounts itself and is passed all of the plugin options as props.

The plugin [interface](./src/ts/interface.ts), which contains all of the plugin methods, is [injected](https://github.com/Maronato/vue-toastification/blob/da6c8c6d2f687efe033f50204ef288abd6d65cd6/src/index.ts#L12) as the `$toast` property available to all Vue instances.

Whenever the user calls a plugin method using `$toast`, a custom event is triggered and passed to the created `VtToastContainer` using a [global event bus](./src/ts/events.ts). You can see all of the event handlers on `VtToastContainer`'s `beforeMount()` hook [here](https://github.com/Maronato/vue-toastification/blob/da6c8c6d2f687efe033f50204ef288abd6d65cd6/src/components/VtToastContainer.vue#L68).

Beyond that everything is regular Vue and Vue components. All toasts created are added as children of the created `VtToastContainer` and inherit its props as their default values.

## Developing

Developing a plugin is a little different than developing a website for there is no direct way to try it out. Because of that, the best way to test your changes when developing is by starting up the demo page locally.

### Pre-requisites

- *Node 10 or superior*
- *Yarn*

### Install

Clone the repository and create a local branch:

```sh
git clone https://github.com/Maronato/vue-toastification.git
cd vue-toastification

git checkout -b my-branch
```

Install dependencies:

```sh
yarn install
```

### Starting the demo page

To start the demo page, run
```sh
yarn dev
```
You can now play with it on [`localhost:8080`](http://localhost:8080) and see your changes being hot reloaded.


### Running tests
To run all tests:
```sh
yarn test
```
Or to watch for changes and only run tests related to changed files:
```sh
yarn test:watch
```

Remember that automated test coverage may not catch all of your feature's intricacies. Write thorough tests, not just tests that reach 100% codecov.


## Writing tests
If your changes are related to anything **but** `VtToastContainer`, they may be treated as regular Vue components or Typescript code during tests.

If you make changes to the UI, it'll probably break some [snapshots](https://jestjs.io/docs/en/snapshot-testing). Make sure that all logic tests pass before overwriting snapshots.

If you plan on changing behavior related to `VtToastContainer` or plugin initialization, you'll face issues because of the way the plugin injects the container onto the page.

To solve that, the `loadPlugin` utility was created. You may import it from `tests/utils/plugin` and use it to simulate a `Vue.use(Toast)` call.

It takes an optional `PluginOptions` object and returns an object with the following keys:
- `localVue`: Vue instance that called `.use(Toast)`. You may use it to call plugin methods such as `localVue.$toast("hey")`
- `containerWrapper`: A Vue Test Utils [Wrapper](https://vue-test-utils.vuejs.org/api/wrapper/) around the created `VtToastContainer`
- `topLeft`,...,`bottomRight`: [Wrapper](https://vue-test-utils.vuejs.org/api/wrapper/)s for `div`s that contain visible toasts on each position.

Each of the position wrappers (`topLeft`, etc) also have a `getToasts` method that returns a [WrapperArray](https://vue-test-utils.vuejs.org/api/wrapper-array/) or its toasts.

Example usage:
```ts
import { ToastOptionsAndRequiredContent } from "src/types";
import { POSITION } from "src/ts/constants";
import loadPlugin from "tests/utils/plugin";

describe("test plugin", () => {
  it("adds toast", async () => {
    // Load plugin with default value for position
    const options = { position: POSITION.BOTTOM_LEFT };
    const {
      localVue,
      bottomLeft,
      containerWrapper
    } = loadPlugin(options);

    // Get way to access list of toasts inside containerWrapper
    const vm = (containerWrapper.vm as unknown) as {
      toastArray: ToastOptionsAndRequiredContent[]
    }

    // Initially there should be no toasts
    expect(vm.toastArray.length).toBe(0);
    expect(bottomLeft.getToasts().length).toBe(0);

    // Create a toast
    const content = "I'm a toast";
    localVue.$toast(content);

    // Wait for render
    await containerWrapper.vm.$nextTick();

    // Toast should be created with correct content
    expect(vm.toastArray.length).toBe(1);
    expect(bottomLeft.getToasts().length).toBe(1);
    expect(bottomLeft.getToasts().at(0).props().content).toBe(content);
  });
});
```

## License
By contributing, you agree that your contributions will be licensed under its MIT License.