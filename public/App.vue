<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height">
        <v-row>
          <v-col cols="12">
            <v-row justify="center" class="text-center">
              <v-col cols="12" md="6">
                <h1 class="display-4 font-weight-light d-none d-lg-block">
                  {{ title }}
                </h1>
                <h1
                  class="display-3 font-weight-light d-none d-sm-block d-lg-none"
                >
                  {{ title }}
                </h1>
                <h1 class="display-2 font-weight-light d-sm-none">
                  {{ title }}
                </h1>
                <span class="title">Light, easy and beautiful toasts</span>
              </v-col>
              <v-col cols="12">
                <v-btn
                  outlined
                  elevation="4"
                  href="https://github.com/Maronato/vue-toastification"
                  class="mr-sm-5 mt-2 black white--text"
                >
                  Check the code
                  <v-icon right>fab fa-github</v-icon>
                </v-btn>
                <v-btn
                  outlined
                  raised
                  elevation="4"
                  href="https://github.com/Maronato/vue-toastification/stargazers/"
                  class="yellow black--text mt-2"
                >
                  Give it a star
                  <v-icon right>fas fa-star</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col order="1" cols="12" sm="8" md="4">
            <v-row>
              <v-col cols="12">
                <h1 class="display-1 font-weight-light">
                  Customize your toast
                </h1>
              </v-col>
              <v-col cols="6">
                <h3 class="title font-weight-thin">Type</h3>
                <v-radio-group v-model="type" class="mt-0">
                  <v-radio
                    v-for="t in types"
                    :key="t.value"
                    :label="t.text"
                    :value="t.value"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="6">
                <h3 class="title font-weight-thin">Position</h3>
                <v-radio-group v-model="position" class="mt-0">
                  <v-radio
                    v-for="t in positions"
                    :key="t.value"
                    :label="t.text"
                    :value="t.value"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="title font-weight-thin">Content</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="contentType"
                  :items="contentTypes"
                  label="Type"
                ></v-select>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-if="contentType === 'text'"
                  v-model="content"
                  label="Content"
                ></v-text-field>
                <v-select
                  v-else
                  v-model="content"
                  :items="components"
                  label="Custom component"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="title font-weight-thin">Toast Options</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="body-1 font-weight-thin">
                  Toast timeout
                  <code>{{ computedTimeout }}</code>
                </h3>
                <v-slider
                  v-model.number="options.timeout"
                  max="10000"
                ></v-slider>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="options.closeOnClick"
                  label="Close on click"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="body-1 font-weight-thin">
                  Drag percentage
                  <code>{{ options.draggablePercent / 100 }}</code>
                </h3>
                <v-slider
                  v-model.number="options.draggablePercent"
                  min="10"
                  max="200"
                  :disabled="!options.draggable"
                ></v-slider>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.draggable"
                  label="Drag toast to close"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.pauseOnFocusLoss"
                  label="Pause when out of focus"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.pauseOnHover"
                  label="Pause on hover"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.hideCloseButton"
                  label="Hide close button"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.showCloseButtonOnHover"
                  label="Only show close button on hover"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.hideProgressBar"
                  label="Hide progress bar"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-combobox
                  v-model="options.icon"
                  :hide-no-data="!iconSearch"
                  :items="iconOptions"
                  :search-input.sync="iconSearch"
                  :filter="filterIcons"
                  label="Icon"
                >
                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="title font-weight-thin">Plugin Options</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="body-1 font-weight-thin">
                  Max toasts
                  <code>{{ pluginOptions.maxToasts }}</code>
                </h3>
                <v-slider
                  v-model.number="pluginOptions.maxToasts"
                  max="30"
                  min="1"
                ></v-slider>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="pluginOptions.transition"
                  :items="transitionOptions"
                  label="Transition"
                ></v-select>
              </v-col>
              <v-col md="6">
                <v-switch
                  v-model="pluginOptions.newestOnTop"
                  label="Newest on top"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="customFilter"
                  :items="customFilterOptions"
                  label="Custom filters"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col order="2" cols="12" sm="8" md="4">
            <v-row>
              <v-col order="1" order-md="0" cols="12">
                <h1 class="display-1 font-weight-light">Preview the code</h1>
              </v-col>
              <v-col order="3" order-md="3" cols="12">
                <v-card class="pa-5">
                  <Prism language="javascript">{{ pluginCode }}</Prism>
                </v-card>
              </v-col>
              <v-col cols="12" order="2" order-md="1">
                <v-card class="pa-5">
                  <Prism language="javascript">{{ toastCode }}</Prism>
                </v-card>
              </v-col>
              <v-col
                v-show="contentType !== 'text'"
                order="3"
                order-md="3"
                cols="12"
              >
                <v-card class="pa-5">
                  <Prism language="html">{{
                    customComponentCodeExample
                  }}</Prism>
                </v-card>
              </v-col>
              <v-col cols="12" order="0" order-md="2">
                <v-btn color="primary" block large rounded @click="launch"
                  >Show toast!</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AltText from "./components/AltText.vue";
import SimpleAction from "./components/SimpleAction.vue";
import UpdateAction from "./components/UpdateAction.vue";
import Events from "./components/Events.vue";
import MyIconComponent from "./components/MyIconComponent.vue";
import Prism from "vue-prism-component";

const altTextCode = `// Component.vue (style omitted)
<template>
  <div class="container">
    <h1>Hey!</h1>
    <span>Listen!</span>
  </div>
</template>`;

const simpleActionCode = `// Component.vue (style omitted)
<template>
  <div class="container">
    <span>So easy!</span>
    <button
      class="action"
      @click.stop="clicked"
    >CLICK ME</button>
  </div>
</template>

<script>
export default {
  methods: {
    clicked() {
      alert("Clicked!");
    }
  }
};
<\/script>`;

const updateActionCode = `// Component.vue (style omitted)
<template>
  <div class="container">
    <span>Update me!</span>
    <button
      class="action"
      @click.stop="clicked"
    >CLICK ME</button>
  </div>
</template>

<script>
export default {
  props: {
    toastId: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    clicked() {
      this.$toast.update(this.toastId, {
        content: "Updated!",
        options: { type: "success" }
      });
    }
  }
};
<\/script>`;

const eventsCode = `// Component.vue (style omitted)
<template>
  <div class="container">
    <span>What about events?</span>
    <button
      class="action"
      @click.stop="clicked"
    >SEND!</button>
  </div>
</template>

<script>
export default {
  methods: {
    clicked() {
      this.$emit("myClick");
    }
  }
};
<\/script>`;

const filterToasts = toasts => {
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
};

const filterToastsCode = `filterToasts: toasts => {
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
  }`;

const filterBeforeCreate = (toast, toasts) => {
  if (toasts.filter(t => t.type === toast.type).length !== 0) {
    // Returning false discards the toast
    return false;
  }
  // You can modify the toast if you want
  return toast;
};

const filterBeforeCreateCode = `filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(
      t => t.type === toast.type
    ).length !== 0) {
      // Returning false discards the toast
      return false;
    }
    // You can modify the toast if you want
    return toast;
  }`;

const noop = x => x;

export default {
  components: { Prism },
  data: () => ({
    title: "Vue Toastification",
    valid: false,
    type: "default",
    types: [
      {
        text: "Default",
        value: "default"
      },
      {
        text: "Success",
        value: "success"
      },
      {
        text: "Info",
        value: "info"
      },
      {
        text: "Warning",
        value: "warning"
      },
      {
        text: "Error",
        value: "error"
      }
    ],
    position: "top-right",
    positions: [
      {
        text: "Top right",
        value: "top-right"
      },
      {
        text: "Top",
        value: "top-center"
      },
      {
        text: "Top left",
        value: "top-left"
      },
      {
        text: "Bottom right",
        value: "bottom-right"
      },
      {
        text: "Bottom",
        value: "bottom-center"
      },
      {
        text: "Bottom left",
        value: "bottom-left"
      }
    ],
    contentType: "text",
    contentTypes: [
      {
        text: "Text",
        value: "text"
      },
      {
        text: "Component",
        value: "component"
      }
    ],
    content: "I'm a toast!",
    components: [
      {
        text: "Alternate text",
        value: AltText
      },
      {
        text: "Simple action",
        value: SimpleAction
      },
      {
        text: "Updatable Toast",
        value: UpdateAction
      },
      {
        text: "Action with events",
        value: Events
      }
    ],
    options: {
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 60,
      pauseOnFocusLoss: true,
      closeOnClick: true,
      timeout: 5000,
      hideCloseButton: false,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      icon: {
        text: "Default icons",
        value: true
      }
    },
    transitionOptions: [
      {
        text: "Bounce (Default)",
        value: "Vue-Toastification__bounce"
      },
      {
        text: "Fade In / Out",
        value: "Vue-Toastification__fade"
      },
      {
        text: "Slide In / Out Blurred",
        value: "Vue-Toastification__slideBlurred"
      },
      {
        text: "Custom Fade",
        value: "my-custom-fade"
      }
    ],
    customFilter: false,
    customFilterOptions: [
      {
        text: "None",
        value: false
      },
      {
        text: "Discarding preventDuplicates",
        value: "filterBeforeCreate"
      },
      {
        text: "Enqueueing preventDuplicates",
        value: "filterToasts"
      }
    ],
    pluginOptions: {
      transition: "Vue-Toastification__bounce",
      maxToasts: 20,
      newestOnTop: true,
      filterBeforeCreate: noop,
      filterToasts: noop
    },
    iconSearch: "",
    iconOptions: [
      { header: "Select an option or type the name of a FontAwesome icon" },
      {
        text: "Default icons",
        value: true
      },
      {
        text: "Disable icon",
        value: false
      },
      "fas fa-rocket",
      {
        text: "Icon Component",
        value: { component: { MyIconComponent } }
      },
      {
        text: "Material Icons code",
        value: {
          class: "material-icons",
          children: "code",
          tag: "span"
        }
      }
    ]
  }),
  computed: {
    computedTimeout() {
      if (this.options.timeout === 0) {
        return "disabled";
      } else if (this.options.timeout < 1000) {
        return `${this.options.timeout} ms`;
      } else {
        return `${Math.round(this.options.timeout / 100) / 10} s`;
      }
    },
    customComponentCodeExample() {
      if (this.content === AltText) {
        return altTextCode;
      } else if (this.content === SimpleAction) {
        return simpleActionCode;
      } else if (this.content === UpdateAction) {
        return updateActionCode;
      }
      return eventsCode;
    },
    toastIconExample() {
      switch (typeof this.toastIcon) {
        case "boolean":
          return this.toastIcon.toString();
        case "object": {
          if (this.toastIcon.component) {
            return Object.keys(this.toastIcon.component)[0];
          }
          return `{
    class: "${this.toastIcon.class}",
    children: "${this.toastIcon.children || ""}",
    tag: "${this.toastIcon.tag || "i"}"
  }`;
        }
        default:
          return `"${this.toastIcon}"`;
      }
    },
    toastCodeOptions() {
      const options = `position: "${this.position}",
  timeout: ${this.options.timeout || "false"},
  closeOnClick: ${this.options.closeOnClick},
  pauseOnFocusLoss: ${this.options.pauseOnFocusLoss},
  pauseOnHover: ${this.options.pauseOnHover},
  draggable: ${this.options.draggable},
  draggablePercent: ${this.options.draggablePercent / 100},
  hideCloseButton: ${this.options.hideCloseButton},
  showCloseButtonOnHover: ${this.options.showCloseButtonOnHover},
  hideProgressBar: ${this.options.hideProgressBar},
  icon: ${this.toastIconExample}`;
      return options;
    },
    pluginCode() {
      let cf = "";
      if (this.customFilter) {
        if (this.customFilter === "filterToasts") {
          cf = `,
  ${filterToastsCode}`;
        } else {
          cf = `,
  ${filterBeforeCreateCode}`;
        }
      }
      const code = `// YourApp.vue

import Vue from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast, {
  transition: "${this.pluginOptions.transition}",
  maxToasts: ${this.pluginOptions.maxToasts},
  newestOnTop: ${this.pluginOptions.newestOnTop}${cf}
});
`;
      return code;
    },
    toastCode() {
      let type = "";
      let content = "";
      let pre = "";
      if (this.type !== "default") {
        type = `.${this.type}`;
      }
      if (this.contentType === "text") {
        content = `"${this.content}"`;
      } else {
        pre = `import Component from "./Component.vue";

// ...

`;
        if (this.content !== Events) {
          content = `Component`;
        } else {
          content = `{
  component: Component,
  listeners: {
    myClick: () => this.$toast.success("Event received!")
  }
}`;
        }
      }

      const code = `${pre}this.$toast${type}(${content}, {
  ${this.toastCodeOptions}
});`;
      return code;
    },
    toastIcon() {
      if (typeof this.options.icon === "object") {
        return this.options.icon.value;
      }
      return this.options.icon;
    }
  },
  watch: {
    contentType(val) {
      if (val === "text") {
        this.content = "I'm a toast!";
      } else {
        this.content = AltText;
      }
    },
    pluginOptions: {
      handler(val) {
        this.$toast.updateDefaults(val);
      },
      deep: true
    },
    customFilter(val) {
      this.pluginOptions.filterToasts = noop;
      this.pluginOptions.filterBeforeCreate = noop;
      if (val === "filterToasts") {
        this.pluginOptions.filterToasts = filterToasts;
      } else if (val === "filterBeforeCreate") {
        this.pluginOptions.filterBeforeCreate = filterBeforeCreate;
      }
    }
  },
  methods: {
    launch() {
      let content;
      content = this.content;
      if (content === Events) {
        content = {
          component: content,
          listeners: {
            click: () => this.$toast.success("Event received!")
          }
        };
      }
      const options = {
        ...this.options,
        draggablePercent: this.options.draggablePercent / 100,
        icon: this.toastIcon.component
          ? Object.values(this.toastIcon.component)[0]
          : this.toastIcon
      };
      if (options.timeout === 0) {
        options.timeout = false;
      }
      this.$toast(content, {
        position: this.position,
        type: this.type,
        ...options
      });
    },
    filterIcons(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = val => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    }
  }
};
</script>

<style>
.v-application code,
.v-application pre {
  background-color: white;
  box-shadow: none;
}
</style>

<style lang="scss">
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
.my-custom-fade-enter-active {
  animation-name: fadeIn;
}
.my-custom-fade-leave-active {
  animation-name: fadeOut;
}
.my-custom-fade-move {
  transition-timing-function: ease-in-out;
  transition-property: all;
  transition-duration: 400ms;
}
</style>
