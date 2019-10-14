// Licensed under MIT © cristijora
// Originally from https://github.com/BinarCode/vue2-transitions

export default {
    inheritAttrs: false,
    props: {
      /**
       * Transition duration. Number for specifying the same duration for enter/leave transitions
       * Object style {enter: 300, leave: 300} for specifying explicit durations for enter/leave
       */
      duration: {
        type: [Number, Object],
        default: 750
      },
      /**
       * Transition delay. Number for specifying the same delay for enter/leave transitions
       * Object style {enter: 300, leave: 300} for specifying explicit durations for enter/leave
       */
      delay: {
        type: [Number, Object],
        default: 0
      },
      /**
       * Whether the component should be a `transition-group` component.
       */
      group: Boolean,
      /**
       * Transition tag, in case the component is a `transition-group`
       */
      tag: {
        type: String,
        default: 'span'
      },
      /**
       *  Transform origin property https://tympanus.net/codrops/css_reference/transform-origin/.
       *  Can be specified with styles as well but it's shorter with this prop
       */
      origin: {
        type: String,
        default: ''
      },
      /**
       * Element styles that are applied during transition. These styles are applied on @beforeEnter and @beforeLeave hooks
       */
      styles: {
        type: Object,
        default: () => {
          return {
            animationFillMode: 'both',
            animationTimingFunction: 'ease-out'
          }
        }
      }
    },
    computed: {
      componentType() {
        return this.group ? 'transition-group' : 'transition'
      },
      hooks() {
        return {
          ...this.$listeners,
          beforeEnter: this.beforeEnter,
          afterEnter: (el) => {
            this.cleanUpStyles(el)
            this.$emit('after-enter', el)
          },
          beforeLeave: this.beforeLeave,
          leave: this.leave,
          afterLeave: (el) => {
            this.cleanUpStyles(el)
            this.$emit('after-leave', el)
          },
        }
      }
    },
    methods: {
      beforeEnter(el) {
        let enterDuration = this.duration.enter ? this.duration.enter : this.duration
        el.style.animationDuration = `${enterDuration}ms`

        let enterDelay = this.delay.enter ? this.delay.enter : this.delay
        el.style.animationDelay = `${enterDelay}ms`

        this.setStyles(el)
        this.$emit('before-enter', el)
      },
      cleanUpStyles(el) {
        Object.keys(this.styles).forEach(key => {
          const styleValue = this.styles[key]
          if (styleValue) {
            el.style[key] = ''
          }
        })
        el.style.animationDuration = ''
        el.style.animationDelay = ''
      },
      beforeLeave(el) {
        let leaveDuration = this.duration.leave ? this.duration.leave : this.duration
        el.style.animationDuration = `${leaveDuration}ms`

        let leaveDelay = this.delay.leave ? this.delay.leave : this.delay
        el.style.animationDelay = `${leaveDelay}ms`

        this.setStyles(el)
        this.$emit('before-leave', el)
      },
      leave(el, done) {
        this.setAbsolutePosition(el)
        this.$emit('leave', el, done)
      },
      setStyles(el) {
        this.setTransformOrigin(el)
        Object.keys(this.styles).forEach(key => {
          const styleValue = this.styles[key]
          if (styleValue) {
            el.style[key] = styleValue
          }
        })
      },
      setAbsolutePosition(el) {
        if (this.group) {
          el.style.left = el.offsetLeft + 'px';
          el.style.top = el.offsetTop + 'px';
          el.style.position = 'absolute'
        }
        return this
      },
      setTransformOrigin(el) {
        if (this.origin) {
          el.style.transformOrigin = this.origin
        }
        return this
      }
    }
  }
