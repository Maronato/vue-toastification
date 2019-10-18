<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height">
        <v-row justify="center">
          <v-col order="2" order-md="1" cols="12" sm="8" md="4">
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
                <h3 class="title font-weight-thin">Options</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="8">
                <h3 class="body-1 font-weight-thin">
                  Toast timeout
                  <code>{{ computedTimeout }}</code>
                </h3>
                <v-slider
                  v-model.number="options.timeout"
                  max="10000"
                ></v-slider>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.closeOnClick"
                  class="py-0 my-0"
                  label="Close on click"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.pauseOnFocusLoss"
                  class="py-0 my-0"
                  label="Pause when out of focus"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.pauseOnHover"
                  class="py-0 my-0"
                  label="Pause on hover"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="options.draggable"
                  class="py-0 my-0"
                  label="Drag toast to close"
                ></v-switch>
              </v-col>
            </v-row>
          </v-col>
          <v-col order="1" order-md="2" cols="12" sm="8" md="4">
            <v-col cols="12">
              <h1 class="display-1 font-weight-light">
                Le code
              </h1>
            </v-col>
            <v-col v-show="contentType !== 'text'" order="0" cols="12">
              <v-card class="pa-5">
                <Prism language="html">{{ customComponentCodeExample }}</Prism>
              </v-card>
            </v-col>
            <v-col cols="12" order="2" order-md="1">
              <v-card class="pa-5">
                <Prism language="javascript">{{ toastCode }}</Prism>
              </v-card>
            </v-col>
            <v-col cols="12" order="1" order-md="2">
              <v-col cols="12">
                <v-btn color="primary" block large rounded @click="launch"
                  >Show toast!</v-btn
                >
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AltText from "./components/AltText";
import SimpleAction from "./components/SimpleAction";
import Events from "./components/Events";
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

export default {
  components: { Prism },
  data: () => ({
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
        text: "Alt Text",
        value: AltText
      },
      {
        text: "Simple action",
        value: SimpleAction
      },
      {
        text: "With events",
        value: Events
      }
    ],
    options: {
      pauseOnHover: true,
      draggable: true,
      pauseOnFocusLoss: true,
      closeOnClick: true,
      timeout: 5000
    }
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
      }
      return eventsCode;
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
      const options = `{
  position: "${this.position}",
  timeout: ${this.options.timeout || "false"},
  closeOnClick: ${this.options.closeOnClick},
  pauseOnFocusLoss: ${this.options.pauseOnFocusLoss},
  pauseOnHover: ${this.options.pauseOnHover},
  draggable: ${this.options.draggable}
}`;
      const code = `${pre}const toastId = this.$toast${type}(${content}, ${options});`;
      return code;
    }
  },
  watch: {
    contentType(val) {
      if (val === "text") {
        this.content = "I'm a toast!";
      } else {
        this.content = AltText;
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
      const options = { ...this.options };
      if (options.timeout === 0) {
        options.timeout = false;
      }
      this.$toast(content, {
        position: this.position,
        type: this.type,
        ...options
      });
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
