<template>
  <div class="node-content">
    <div class="content"
         :id="node.nodeData.defaultJump.id">
      <img class="icon"
           :src="node.icon" />
      <span>{{node.name}}</span>
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
.node-content {
  font-size: 12px;
  font-weight: 700;
  .content {
    height: 40px;
    display: flex;
    align-items: center;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin: 0 10px;
  }
  .visual-endpoint-dom {
    position: absolute;
    top: 50%;
    right: -8px;
    width: 14px;
    height: 14px;
    margin-top: -9px;
    border-width: 3px;
    border-style: solid;
    border-color: rgb(142, 156, 168);
    border-image: initial;
    border-radius: 8px;
    background: rgb(255, 255, 255);
    box-sizing: border-box;
    &:hover {
      background: rgb(31, 119, 243);
      border: none;
    }
  }
}
</style>
