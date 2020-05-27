Vue.component('v-modal', {
  template: `
    <transition :name="transitionName">
      <div class="v-modal" v-if="visible" :style="boxStyle">
        <div class="top-header">{{label}}</div>
        <div class="content" style="height:100%;padding: 40px 5px 40px 20px;">
          <b-scrollbar style="height: 100%;" always>
            <slot></slot>
          </b-scrollbar>
        </div>
        <div class="angle top-left"></div>
        <div class="angle top-right"></div>
        <div class="angle bottom-left"></div>
        <div class="angle bottom-right"></div>
        <i class="iconfont icon-ios-close" @click="onClose"></i>
      </div>
    </transition>`,
  props: {
    label: {
      type: String,
      default: '主标题'
    },
    transitionName: {
      type: String,
      default: 'zoom-in-bottom'
    },
    rect: {
      type: Array, // x,y,w,h [460,462],[940,944]
      default () {
        return [40, 20, 460, 462, 1000]
      }
    },
    value: Boolean
  },
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.visible = this.value
  },
  watch: {
    value (val) {
      this.visible = val
      this.$emit('input', val)
    }
  },
  computed: {
    boxStyle () {
      return {
        position: 'absolute',
        left: this.rect[0] + 'px',
        top: this.rect[1] + 'px',
        width: this.rect[2] + 'px',
        height: this.rect[3] + 'px',
        zIndex: this.rect[4] ? this.rect[4] : 1000
      }
    }
  },
  methods: {
    onClose () {
      this.visible = false
      this.$emit('input', this.visible)
      this.$emit('on-close')
    }
  }
})
