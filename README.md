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
    - [Update toasts programmatically](#update-toasts-programmatically)
    - [Clear all toasts](#clear-all-toasts)
    - [Styling](#styling)
      - [Custom toast classes](#custom-toast-classes)
      - [Override SCSS variables](#override-scss-variables)
    - [Transitions](#transitions)
    - [Custom transitions](#custom-transitions)
      - [Named transitions](#named-transitions)
      - [Transition classes](#transition-classes)
      - [Transition durations](#transition-durations)
    - [Toast Icons](#toast-icons)
      - [Disabling icons](#disabling-icons)
      - [Using custom icons](#using-custom-icons)
    - [Close Button](#close-button)
      - [Hiding the close button](#hiding-the-close-button)
      - [Custom close button component](#custom-close-button-component)
      - [Custom close button classes](#custom-close-button-classes)
    - [Updating default options](#updating-default-options)
    - [Custom toast filters](#custom-toast-filters)
      - [`filterBeforeCreate`](#filterbeforecreate)
      - [`filterToasts`](#filtertoasts)
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
- Custom toast filtering and enqueueing with lifecycle hooks
- Remove toasts programmatically
- Update toasts programmatically
- Define behavior per toast
- Pause toast when hovering and when window loses focus 👁
- Fancy progress bar to display the remaining time
- Use your themes and animations easily
- And much more!


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

When using custom components, the prop `toastId` containing the toast ID is always passed by default. Also, an event listener for `close-toast` is attached, so you can close the toast prommatically by emmiting it from inside the component.

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

### Update toasts programmatically
You can update toasts contents and props programmatically using it's ID.

The method signature is `$toast.update(id, { content, options }, create)` with `content`, `options` and `create` being optional. Updates override previous values.

`create` is a boolean, `false` by default. If `true`, a toast will be created if no matching toast with the `id` is found.

```js
// Get the toast ID on creation
const toastId = this.$toast("Loading...");

// Update it later
this.$toast.update(toastId, { content: "Loaded!" });

// Pass your custom ID to the toast
this.$toast("my other toast", { id: "my id", timeout: false });
this.$toast.update("my id", { content: "Finished!", options: { timeout: 5000 } });
```

> **Note**: The remaining timeout of the toast will be carried on updates. To reset the timeout, simply pass a `timeout` option during the update. It can be the same as the one set during the toast creation.


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

    // For the toast body when using strings or a custom component as content
    bodyClassName: ["custom-class-1", "custom-class-2"]
});
```
```css
<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the exisiting classes as well */

    .Vue-Toastification__toast--default.my-custom-toast-class {
        background-color: red;
    }

    /* Applied to the toast body when using regular strings as content */
    .Vue-Toastification__toast-body.custom-class-1 {
        font-size: 30px;
    }

    /* Applied to a wrapper div when using a custom component as content */
    .Vue-Toastification__toast-component-body.custom-class-2 {
        width: 100%;
    }
</style>
```
These can also be defined when registering the vue plugin.

> Note: `bodyClassName`s applied to toasts that use a custom component are not applied to the custom component itself. Instead, they are applied to a `div` that wraps the custom component.

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

#### Transition durations
You can change transition timings with the `transitionDuration` option.

It can either be a number representing the transition duration for both enter and leave transitions, or you can specify both separately.

```javascript
// Set both entering and leaving transitions to 500 ms
Vue.use(Toast, {
    transitionDuration: 500
});

// Set entering to 100 and leaving to 700
Vue.use(Toast, {
    transitionDuration: {
      enter: 100,
      leave: 700
    }
});
```

### Toast Icons
By default all toasts will come with a little icon to the left representing what the message is about. These are fully customizable as you'll see.

#### Disabling icons
You can entirely disable the icon from the toast by setting `icon: false` when either registering the plugin or creating toasts. Without the icon, the toast's content will fill its place and appear closer to the edge.

```javascript
// Disable every toast's icon by default
Vue.use(Toast, {
    icon: false
});

// Disable icons per toast
this.$toast('No icon!', { icon: false });
```

#### Using custom icons
You can also use custom icons with the `icon` option. To do so, you'll probably need to install these icons in your app with a icon library, such as [FontAwesome](https://fontawesome.com/) or [Material Icons](https://google.github.io/material-design-icons/).

You can also install a Vue icon library with custom components, such as [Vue FontAwesome](https://github.com/FortAwesome/vue-fontawesome).

Using them varies between icon libraries. You can either override icon classes with `icon: "my-icon-class"`, pass a custom component / JSX, or you can setup more complex icon systems by passing an object. Let's look at the options with some examples:

```javascript
// Using Font Awesome icons
this.$toast('Icons are awesome!', { icon: 'fas fa-rocket' });

// Using Material Icons
this.$toast('Material icons!', {
  icon: {
    class: 'material-icons',  // Optional
    children: 'check_circle', // Optional
    tag: 'span'               // Optional
  }
});
```

As you can see, we can either just pass a string or define classes, children and tags for our icons.

When you just pass a string, for example `fas fa-rocket`, the rendered component will look like:
```html
<i class="fas fa-rocket"></i>
```
If your icon library supports that, then you're good to go!

Other libraries require you to define icons with [ligatures](http://alistapart.com/article/the-era-of-symbol-fonts). To support that, Vue Toastification allows you to construct your icon component through some options: `class`, `children` and `tag`.

Taking the Material Icon example from above, the rendered component would look like:
```html
<span class="material-icons">check_circle</span>
```

Both examples will actually have an extra class, `Vue-Toastification__icon`. You can see what it does [here](https://github.com/Maronato/vue-toastification/blob/master/src/scss/_icon.scss) or you can override it with your own css classes.

### Close Button
You can modify the toast close buttons in 3 ways:
- Hide it
- Use a custom component instead of the standard one
- Add extra classes to it

#### Hiding the close button
To hide it, simply set `hideCloseButton` when calling the toast or setting up the plugin
```js
this.$toast('No close button', {
  hideCloseButton: true
});
```

#### Custom close button component
You can also use custom components as close buttons. It accepts both Single File Components and JSX:
```js
this.$toast('With a custom close component', {
  closeButton: MyComponent
});
```

#### Custom close button classes
The close button can be customized with custom classes. These can be either a single string or an array of strings
```js
this.$toast('With custom classes', {
  closeButtonClassName: "my-button-class"
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

### Custom toast filters
Some applications require custom logic to select which toasts to display and how to display them. To solve this issue, Vue Toastification provides you with two callback functions that give you fine control of your toasts. These are `filterBeforeCreate` and `filterToasts`.

#### `filterBeforeCreate`
Called just before toast creation, `filterBeforeCreate` allows you to edit toast props in runtime or discard toasts entirely.

It takes two parameters:
- The new toast's [props](#toast-options-object)
- A list of existing toasts

It must return the modified toast props, or `false` to discard the toast.

Example implementation of a *preventDuplicates* feature, which prevent toasts of the same type from appearing simultaneously:
```js
// App.js

// Prevents toasts of the same type from appearing simultaneously, discarding duplicates
const filterBeforeCreate = (toast, toasts) => {
  if (toasts.filter(t => t.type === toast.type).length !== 0) {
    // Returning false discards the toast
    return false;
  }
  // You can modify the toast if you want
  return toast;
}

Vue.use(Toast, { filterBeforeCreate });
```

#### `filterToasts`
This callback enables you to filter *created* toasts from being **rendered**. It differs from `filterBeforeCreate` by allowing you to enqueue toasts, as opposed to the former, which allows you to discard them.

It takes the list of created toasts and must return a list of toasts to be rendered. Filtered toasts may be rendered later on.

Another example of `preventDuplicates` feature that enqueues toasts instead of discarding them:
```js
// App.js

// Enqueues toasts of the same type, preventing duplicates
const filterToasts = (toasts) => {
  // Keep track of existing types
  const types = {};
  return toasts.reduce((aggToasts, toast) => {
    // Check if type was not seen before
    if (!types[toast.type]) {
      aggToasts.push(toast);
      types[toast.type] = true;
    }
    return aggToasts;
  }, []);
}

Vue.use(Toast, { filterToasts });
```

## API

### Plugin registration (Vue.use)
| Option               | Type                                          | Default                      | Description                                                                                                                                                                                                 |
| -------------------- | --------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position             | String                                        | `top-right`                  | Position of the toast on the screen. Can be any of **top-right**, **top-center**, **top-left**, **bottom-right**, **bottom-center**, **bottom-left**.                                                       |
| newestOnTop          | Boolean                                       | `true`                       | Whether or not the newest toasts are placed on the top of the stack.                                                                                                                                        |
| maxToasts            | Number                                        | `20`                         | Maximum number of toasts on each stack at a time. Overflows wait until older toasts are dismissed to appear.                                                                                                |
| transition           | String or Object                              | `Vue-Toastification__bounce` | Name of the [Vue Transition](https://vuejs.org/v2/guide/transitions.html) or [object with classes](#transition-classes) to use. Only `enter-active`, `leave-active` and `move` are applied.                 |
| transitionDuration   | Number or Object                              | `750`                        | Duration of the transition. Can either be a positive integer for both enter and leave, or an object of shape `{enter: Number, leave: Number}`.                                                              |
| draggable            | Boolean                                       | `true`                       | Whether or not the toast can be dismissed by being dragged to the side.                                                                                                                                     |
| draggablePercent     | Positive Number                               | `0.6`                        | By how much of the toast width in percent (`0` to `1`) it must be dragged before being dismissed.                                                                                                           |
| pauseOnFocusLoss     | Boolean                                       | `true`                       | Whether or not the toast is paused when the window loses focus.                                                                                                                                             |
| pauseOnHover         | Boolean                                       | `true`                       | Whether or not the toast is paused when it is hovered by the mouse.                                                                                                                                         |
| closeOnClick         | Boolean                                       | `true`                       | Whether or not the toast is closed when clicked.                                                                                                                                                            |
| timeout              | Positive Integer or false                     | `5000`                       | How many milliseconds for the toast to be auto dismissed, or false to disable.                                                                                                                              |
| container            | HTMLElement                                   | `document.body`              | Container where the toasts are mounted.                                                                                                                                                                     |
| toastClassName       | String or Array of Strings                    | `[]`                         | Custom classes applied to the toast.                                                                                                                                                                        |
| bodyClassName        | String or Array of Strings                    | `[]`                         | Custom classes applied to the body of the toast.                                                                                                                                                            |
| hideProgressBar      | Boolean                                       | `false`                      | Whether or not the progress bar is hidden.                                                                                                                                                                  |
| hideCloseButton      | Boolean                                       | `false`                      | Whether or not the close button is hidden.                                                                                                                                                                  |
| icon                 | Boolean, String, Object, Vue Component or JSX | `true`                       | Custom icon class to be used. When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon. Object shape is { class: String, children: String, tag: String } |
| filterBeforeCreate   | Function                                      | `NOOP`                       | Callback to filter toasts before their creation. Takes a `toast` and `toasts` argument and returns a `toast` or `false`                                                                                     |
| filterToasts         | Function                                      | `NOOP`                       | Callback to filter created toasts. Takes a list of `toasts` argument and return a filtered list of `toasts`                                                                                                 |
| closeButtonClassName | String or Array of Strings                    | `[]`                         | Custom classes applied to the close button of the toast.                                                                                                                                                    |
| closeButton          | Vue Component or JSX                          | `<button />`                 | Custom component that can be used as the close button.                                                                                                                                                      |

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
| Option               | Type                                         | Default      | Description                                                                                                                                                                                                   |
| -------------------- | -------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | Number or String                             | `auto`       | ID of the toast.                                                                                                                                                                                              |
| type                 | String                                       | `default`    | Type of the toast. Can be any of  **success**, **error**, **default**, **info** and **warning**                                                                                                               |
| position             | String                                       | `top-right`  | Position of the toast on the screen. Can be any of **top-right**, **top-center**, **top-left**, **bottom-right**, **bottom-center**, **bottom-left**.                                                         |
| draggable            | Boolean                                      | `true`       | Whether or not the toast can be dismissed by being dragged to the side.                                                                                                                                       |
| draggablePercent     | Positive Number                              | `0.6`        | By how much of the toast width in percent (`0` to `1`) it must be dragged before being dismissed.                                                                                                             |
| pauseOnFocusLoss     | Boolean                                      | `true`       | Whether or not the toast is paused when the window loses focus.                                                                                                                                               |
| pauseOnHover         | Boolean                                      | `true`       | Whether or not the toast is paused when it is hovered by the mouse.                                                                                                                                           |
| closeOnClick         | Boolean                                      | `true`       | Whether or not the toast is closed when clicked.                                                                                                                                                              |
| onClick              | Function                                     | `NOOP`       | Callback for when the toast is clicked. A `closeToast` callback is passed as argument to `onClick` when it is called.                                                                                         |
| timeout              | Positive Integer or false                    | `5000`       | How many milliseconds for the toast to be auto dismissed, or false to disable.                                                                                                                                |
| toastClassName       | String or Array of Strings                   | `[]`         | Custom classes applied to the toast.                                                                                                                                                                          |
| bodyClassName        | String or Array of Strings                   | `[]`         | Custom classes applied to the body of the toast.                                                                                                                                                              |
| hideProgressBar      | Boolean                                      | `false`      | Whether or not the progress bar is hidden.                                                                                                                                                                    |
| hideCloseButton      | Boolean                                      | `false`      | Whether or not the close button is hidden.                                                                                                                                                                    |
| icon                 | Boolean, String, Object Vue Component or JSX | `true`       | Custom icon class to be used. When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon. Object shape is `{ class: String, children: String, tag: String }` |
| closeButtonClassName | String or Array of Strings                   | `[]`         | Custom classes applied to the close button of the toast.                                                                                                                                                      |
| closeButton          | Vue Component or JSX                         | `<button />` | Custom component that can be used as the close button.                                                                                                                                                        |

⚠️️ _Toast options supersede Plugin Registration props_  ⚠️

# Acknowledgements
This project was heavily inspired by the beautiful [React Toastify](https://github.com/fkhadra/react-toastify) project and [other](https://github.com/shakee93/vue-toasted) [great](https://github.com/ankurk91/vue-toast-notification) Vue libraries.

# License
Copyright (C) 2019 [Maronato](https://github.com/Maronato). Licensed under MIT
