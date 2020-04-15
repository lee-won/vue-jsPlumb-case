<template>
  <div class="node-content"
       v-if="node.nodeData.slot">
    <div :id="item.id"
         :key="item.id"
         class="branch-jump"
         v-for="(item) in node.nodeData.branchJump">
      <span class="blue">{{node.nodeData.slot}}</span>
      <span class="gray">{{item.ruleEnumCode | setRuleEnumCode}}</span>
      <span class="blue"> {{item.content}}</span>
      <span class="visual-endpoint-dom"></span>
    </div>
    <div class="slot"
         :id="node.nodeData.defaultJump.id">
      <span class="gray">收集到 </span>
      <span class="blue">{{node.nodeData.slot}}</span>
      <span class="gray"> 时</span>
      <span class="visual-endpoint-dom"></span>
    </div>
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
@import "../../scss/node";
</style>
