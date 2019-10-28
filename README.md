# Vue Toastification
[![NPM](https://flat.badgen.net/npm/v/vue-toastification)](https://www.npmjs.com/package/vue-toastification)  [![Bundle](https://flat.badgen.net/bundlephobia/minzip/vue-toastification)](https://bundlephobia.com/result?p=vue-toastification@latest)  [![Vue](https://img.shields.io/badge/Vue-2.0-red)](https://vuejs.org/)


![vt](https://i.imgur.com/i2PMcTq.gif)


Light, easy and beautiful toasts!

Wanna try it out? Check out the [live demo](https://maronato.github.io/vue-toastification/)!


- [Vue Toastification](#vue-toastification)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Positioning the Toast](#positioning-the-toast)
    - [Toast types](#toast-types)
    - [Setting the toast timeout](#setting-the-toast-timeout)
    - [Using a custom component](#using-a-custom-component)
      - [Render a component](#render-a-component)
      - [Close the toast using a custom component](#close-the-toast-using-a-custom-component)
      - [Render a JSX component](#render-a-jsx-component)
      - [Render a component with props and events](#render-a-component-with-props-and-events)
    - [Dismiss toasts programmatically](#dismiss-toasts-programmatically)
    - [Clear all toasts](#clear-all-toasts)
    - [Styling](#styling)
      - [Custom toast classes](#custom-toast-classes)
      - [Override SCSS variables](#override-scss-variables)
    - [Custom transitions](#custom-transitions)
      - [Named transitions](#named-transitions)
      - [Transition classes](#transition-classes)
    - [Updating default options](#updating-default-options)
  - [API](#api)
    - [Plugin registration (Vue.use)](#plugin-registration-vueuse)
    - [Toast (this.$toast)](#toast-thistoast)
      - [Toast Content Object](#toast-content-object)
      - [Toast Options Object](#toast-options-object)
- [Acknowledgements](#acknowledgements)
- [License](#license)



## Features

- Easy to setup for real, you can make it work in less than 10sec!
- Customize everything
- Swipe to close 👌
- Use your custom components or JSX as the toast body for endless possibilities!
- Create custom experiences with the `onClose` and `onClick` hooks
- Remove toasts programmatically
- Define behavior per toast
- Pause toast when hovering and when window loses focus 👁
- Fancy progress bar to display the remaining time
- Use your themes and animations easily


## Demo

Need some more convincing? Check out the [demo](https://maronato.github.io/vue-toastification/)



## Installation

```
$ yarn add vue-toastification
$ npm install --save vue-toastification
```



## Usage

Add it as a Vue plugin:

```javascript
import Vue from "vue";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};


Vue.use(Toast, options);
```



And then just call it in your components with

```javascript
this.$toast("I'm a toast!");

// Or with options
this.$toast("My toast content", {
    timeout: 2000,
    onClose: () => console.log("closed!")
});
// These options will override the options defined in the "Vue.use" plugin registration for this specific toast
```

Or reference in your Vuex store with

```javascript
this._vm.$toast("I'm a toast!");

// Or with import
import Vue from "vue";

Vue.$toast("My toast content", {
    timeout: 2000,
    onClose: () => console.log("closed!")
});
```

### Positioning the Toast

By default, the toasts will be displayed at the top right corner of your screen, but you can set it manually using the `position` option.

The following values are allowed: **top-right**, **top-center**, **top-left**, **bottom-right**, **bottom-center**, **bottom-left**.

```javascript
Vue.use(Toast, {
    // Setting the global default position
    position: "top-left"
});


// Or set it per toast
this.$toast("I'm a toast", { position: "bottom-left" });
```



### Toast types

Depending on the context, you may want to use toasts of different colors. You can easily do that by setting the type of toast to be displayed.



```javascript
this.$toast("Default toast");
this.$toast.info("Info toast");
this.$toast.success("Success toast");
this.$toast.error("Error toast");
this.$toast.warning("Warning toast");

// You can also set the type programmatically when calling the default toast
this.$toast("Also a success toast", {
    type: "success"  // or "error", "default", "info" and "warning"
});
```

Setting the type only works when using `this.$toast`, it won't work when registering the plugin with `Vue.use`.

### Setting the toast timeout

You can set for how long the toast will remain on the screen (in milliseconds) using the `timeout` option, or disable it altogether by setting it to `false`

```js
// 1 second
this.$toast("Quick toast", { timeout: 1000 });

// Or make the toast permanent until manually closed
this.$toast("Persistent toast", { timeout: false })

// Or set it when registering the plugin
Vue.use(Toast, { timeout: 2000 });
```

### Using a custom component
Passing strings as the toast content is not enough? You can render anything inside the toast using custom components! Vue Toastification accepts both Vue Components and JSX templates as parameters.

See an example with custom components in action:

[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-template-w2w2c?fontsize=14)

#### Render a component
To use a Single File Component as content just pass it to the toast:

```js
import MyComponent from "./MyComponent.vue";

this.$toast(MyComponent);
```

#### Close the toast using a custom component
When using custom components it is also possible to close the toast from within.

To do that, just emit the `close-toast` event

```js
// MyComponent.vue

<template>
    <button @click="$emit('close-toast')">Close Toast</button>
</template>


// OtherFile.vue
import MyComponent from "./MyComponent.vue";


// This toast will be closed when the button inside it is clicked
this.$toast(MyComponent);
```


#### Render a JSX component
Sometimes you won't want to create a whole component just for a toast. In those cases, you can pass a JSX template to the Toast for it to render as a component

> Note: Read [this](https://vuejs.org/v2/guide/render-function.html#JSX) to learn how to enable JSX inside of Vue

```js
const myJSX = (
    <div>
        <h1>My Title</h1>
        <span>My text</span>
    </div>
);

// Vue Toastification will generate the appropriate render function automatically.
this.$toast(myJSX);
```


#### Render a component with props and events

Usually it is not enough to just render a simple component and you'll need to handle events or pass props. You can do that too!

Just pass the content in the format

```js
{
    component: Component,
    props:  {
        propName: propValue  // Optional
    },
    listeners: {
        eventName: eventHandler  // Optional
    }
}
```

Props will be passed to the created component and the event listeners will be attached to it as well.

> Note: Props passed are not reactive

```js
const content = {
    // Your component or JSX template
    component: MyComponent,

    // Props are just regular props, but these won't be reactive
    props: {
        myProp: "abc",
        otherProp: 123
    },

    // Listeners will listen to and execute on event emission
    listeners: {
        click: () => console.log("Clicked!"),
        myEvent: myEventHandler
    }
};


this.$toast(content);
```

### Dismiss toasts programmatically
When a toast is created, an ID is assigned to it. You can use it later to programmatically dismiss the toast.


You can also choose a custom ID (String or Number) for the toast during its creation.


```js
// Get the toast ID on creation
const toastId = this.$toast("my toast");

// Dismiss it later
this.$toast.dismiss(toastId);

// Pass your custom ID to the toast
this.$toast("my other toast", { id: "my id" });
this.$toast.dismiss("my id");
```



### Clear all toasts
You can also dismiss all toasts at once using `clear`.

```js
this.$toast("my toast A");
this.$toast("my toast B");
this.$toast("my toast C");

// Dismiss all toasts
this.$toast.clear();
```

### Styling
There are two ways to style your toast components. You can either add custom classes to the toast and modify them using those or you can override the actual toast's SCSS when importing them.

#### Custom toast classes
```js
this.$toast("my toast", {
    // For the actual toast, including different toast types:
    toastClassName: "my-custom-toast-class",

    // For the toast body when using strings as content
    bodyClassName: ["custom-class-1", "custom-class-2"]
});

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the exisiting classes as well */

    .Vue-Toastification__toast--default.my-custom-toast-class {
        background-color: red;
    }

    .Vue-Toastification__toast-body.custom-class-1 {
        font-size: 30px;
    }
</style>
```
These can also be defined when registering the vue plugin.

#### Override SCSS variables
There is a set of [pre defined variables](https://github.com/Maronato/vue-toastification/blob/master/src/scss/_variables.scss) that you can override to change some basic styling.

If you have a SCSS loader in your project, simply create a file overriding the defaults
```scss
// yourMainScssFile.scss

// Override the variables or import a file that overrides them
$vt-color-success: white;
$vt-text-color-success: #000;

// Import the regular Vue Toastification stylesheets (or create your own)
@import "vue-toastification/src/scss/_variables";
@import "vue-toastification/src/scss/_toastContainer";
@import "vue-toastification/src/scss/_toast";
@import "vue-toastification/src/scss/_closeButton";
@import "vue-toastification/src/scss/_progressBar";
@import "vue-toastification/src/scss/_icon";
@import "vue-toastification/src/scss/animations/_bounce";
```

Then you import it when registering the plugin
```javascript
import Vue from "vue";
import Toast from "vue-toastification";

// The magic is here
import "./yourMainScssFile.scss";

Vue.use(Toast);
```

### Transitions
Vue Toastification comes with built-in transitions, but you can also customize your own. 

Default Usage using the built-in bounce transition:
```
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});
```

Some of the currently available built-in transitions are:
- Bounce (default): Set the transition property to "Vue-Toastification__bounce"
- Fade In / Out: Set the transition property to "Vue-Toastification__fade"
- Slide In / Out (Blurred): Set the transition property to "Vue-Toastification__slideBlurred"
However, new ones may be added so be sure to check the [live demo](https://maronato.github.io/vue-toastification/) page for the updated list.

### Custom transitions
When registering the plugin you can use your custom transitions as the toasts' transitions. You can use both named transitions or the transition classes separately.

Vue Toastification uses [Vue's built in transition-group components](https://vuejs.org/v2/guide/transitions.html#Overview), so read how they work before creating your own.

> Note: You only need to implement the `enter-active`, `leave-active` and `move` transition classes.

We'll use the following transition in our examples:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.fade-enter-active {
  animation-name: fadeIn;
}
.fade-leave-active {
  animation-name: fadeOut;
}
.fade-move {
  transition-timing-function: ease-in-out;
  transition-property: all;
  transition-duration: 400ms;
}
```

#### Named transitions
To setup named transitions just pass the transition name.

Using the transition defined above, we can use it like so:
```javascript
Vue.use(Toast, {
    transition: "fade"
});
```
#### Transition classes
You can also specify which entering, leaving and moving transitions to use. Please note that if you use custom transition classes you'll need to specify all 3 classes for it to work.
You can, however, use Vue Toastification's default "bounce" transition to fill the gaps. Its classes are `Vue-Toastification__bounce-enter-active`, `Vue-Toastification__bounce-leave-active` and `Vue-Toastification__bounce-move`.

Example using a mix of `fade` and `bounce` transitions:
```javascript
Vue.use(Toast, {
    transition: {
        enter: "fade-enter-active",
        leave: "Vue-Toastification__bounce-leave-active",
        move: "fade-move"
    }
});
```

### Updating default options
Some options are only available when registering the plugin, like `transition`, `maxToasts` and others. If you need to update those options in runtime, there is a method you can call to update the default options:
```javascript
const update = {
    transition: "my-transition"
};

this.$toast.updateDefaults(update);
```
> Note: `updateDefaults` will do a **shallow** update on your default options.

You can use `updateDefaults` to update any of the default [API options](#plugin-registration-vueuse), but be careful as they are updated globally, so all new toasts will share the new defaults.

## API

### Plugin registration (Vue.use)
| Option             | Type                       | Default                      | Description                                                                                                                                                                                 |
| ------------------ | -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position           | String                     | `top-right`                  | Position of the toast on the screen. Can be any of **top-right**, **top-center**, **top-left**, **bottom-right**, **bottom-center**, **bottom-left**.                                       |
| newestOnTop        | Boolean                    | `true`                       | Whether or not the newest toasts are placed on the top of the stack.                                                                                                                        |
| maxToasts          | Number                     | `20`                         | Maximum number of toasts on each stack at a time. Overflows wait until older toasts are dismissed to appear.                                                                                |
| transition         | String or Object           | `Vue-Toastification__bounce` | Name of the [Vue Transition](https://vuejs.org/v2/guide/transitions.html) or [object with classes](#transition-classes) to use. Only `enter-active`, `leave-active` and `move` are applied. |
| transitionDuration | Number or Object           | `750`                        | Duration of the transition. Can either be a positive integer for both enter and leave, or an object of shape `{enter: Number, leave: Number}`.                                              |
| draggable          | Boolean                    | `true`                       | Whether or not the toast can be dismissed by being dragged to the side.                                                                                                                     |
| draggablePercent   | Positive Number            | `0.6`                        | By how much of the toast width in percent (`0` to `1`) it must be dragged before being dismissed.                                                                                           |
| pauseOnFocusLoss   | Boolean                    | `true`                       | Whether or not the toast is paused when the window loses focus.                                                                                                                             |
| pauseOnHover       | Boolean                    | `true`                       | Whether or not the toast is paused when it is hovered by the mouse.                                                                                                                         |
| closeOnClick       | Boolean                    | `true`                       | Whether or not the toast is closed when clicked.                                                                                                                                            |
| timeout            | Positive Integer or false  | `5000`                       | How many milliseconds for the toast to be auto dismissed, or false to disable.                                                                                                               |
| container          | HTMLElement                | `document.body`              | Container where the toasts are mounted.                                                                                                                                                     |
| toastClassName     | String or Array of Strings | `[]`                         | Custom classes applied to the toast.                                                                                                                                                        |
| bodyClassName      | String or Array of Strings | `[]`                         | Custom classes applied to the body of the toast.                                                                                                                                            |
| hideProgressBar    | Boolean                    | `false`                      | Whether or not the progress bar is hidden.                                                                                                                                                  |
| hideCloseButton    | Boolean                    | `false`                      | Whether or not the close button is hidden.                                                                                                                                                  |
| icon               | Boolean or String          | `true`                       | Custom icon class to be used. When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon.                                                  |

### Toast (this.$toast)
| Parameter | Type                                 | Required | Description                                                                                                                                                                  |
| --------- | ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content   | String, Vue Component, JSX or Object | Yes      | Toast contents. Can either be a string, a Vue Component, a JSX template or an Object. The shape of the object and its properties are described [here](#toast-content-object) |
| options   | Object                               | No       | Toast options. Described [here](#toast-options-object)                                                                                                                       |

#### Toast Content Object
| Prop      | Type                 | Required | Description                                                                                           |
| --------- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| component | Vue Component or JSX | Yes      | Component that will be rendered.                                                                      |
| props     | Object               | No       | `propName: propValue` pairs of props that will be passed to the component. **These are not reactive** |
| listeners | Object               | No       | `eventName: eventHandler` pairs of events that the component can emit.                                |

#### Toast Options Object
| Option           | Type                       | Default     | Description                                                                                                                                           |
| ---------------- | -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | Number or String           | `auto`      | ID of the toast.                                                                                                                                      |
| type             | String                     | `default`   | Type of the toast. Can be any of  **success**, **error**, **default**, **info** and **warning**                                                       |
| position         | String                     | `top-right` | Position of the toast on the screen. Can be any of **top-right**, **top-center**, **top-left**, **bottom-right**, **bottom-center**, **bottom-left**. |
| draggable        | Boolean                    | `true`      | Whether or not the toast can be dismissed by being dragged to the side.                                                                               |
| draggablePercent | Positive Number            | `0.6`       | By how much of the toast width in percent (`0` to `1`) it must be dragged before being dismissed.                                                     |
| pauseOnFocusLoss | Boolean                    | `true`      | Whether or not the toast is paused when the window loses focus.                                                                                       |
| pauseOnHover     | Boolean                    | `true`      | Whether or not the toast is paused when it is hovered by the mouse.                                                                                   |
| closeOnClick     | Boolean                    | `true`      | Whether or not the toast is closed when clicked.                                                                                                      |
| onClick          | Function                   | `NOOP`      | Callback for when the toast is clicked. A `closeToast` callback is passed as argument to `onClick` when it is called.                                 |
| timeout          | Positive Integer or false  | `5000`      | How many milliseconds for the toast to be auto dismissed, or false to disable.                                                                         |
| toastClassName   | String or Array of Strings | `[]`        | Custom classes applied to the toast.                                                                                                                  |
| bodyClassName    | String or Array of Strings | `[]`        | Custom classes applied to the body of the toast.                                                                                                      |
| hideProgressBar  | Boolean                    | `false`     | Whether or not the progress bar is hidden.                                                                                                            |
| hideCloseButton  | Boolean                    | `false`     | Whether or not the close button is hidden.                                                                                                            |
| icon             | Boolean or String          | `true`      | Custom icon class to be used. When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon.            |

⚠️️ _Toast options supersede Plugin Registration props_  ⚠️

# Acknowledgements
This project was heavily inspired by the beautiful [React Toastify](https://github.com/fkhadra/react-toastify) project and [other](https://github.com/shakee93/vue-toasted) [great](https://github.com/ankurk91/vue-toast-notification) Vue libraries.

# License
Copyright (C) 2019 [Maronato](https://github.com/Maronato). Licensed under MIT
