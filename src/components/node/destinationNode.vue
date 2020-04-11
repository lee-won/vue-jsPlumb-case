<template>
  <div class="node-content">
    跳转到下个意图
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    node: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.node-content {
  font-size: 12px;
  font-weight: 700;
}
</style>
