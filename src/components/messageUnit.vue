<template>
  <div class="content">
    <div class="message-item" :id="node.id + 'message' + index" v-for="(message, index) in node.messageArr">
       <span>{{message.text}}</span>
       <span class="visual-endpoint-dom"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    node: {
      type: Object,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  .message-item{
    position:relative;
    width: inherit;
    font-size: 14px;
    font-weight: 900;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 10px 20px;
    text-align: left;
    .visual-endpoint-dom{
        position: absolute;
        top: 50%;
        right: -7px;
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
    }
    &:hover{
      background:#eee;
       .visual-endpoint-dom{
         background: rgb(31, 119, 243);
         border:none;
       }
    }
  }
}
</style>
