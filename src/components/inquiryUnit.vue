<template>
  <div class="content">
       <div class="key-word-wrap" :id="node.id + 'keyword'" v-if="node.keyWord.value">
         <span>收集到其它时</span>
         <span class="key-word">{{node.keyWord.value}}</span>
         <span>时</span>
         <span class="visual-endpoint-dom"></span>
       </div>
       <img src="../assets/block-preview.png" v-else>
      <el-button class="btn" type="primary">关联词槽，配置单元跳转</el-button>
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
    text-align: center;
    width: 100%;
    .btn{
      margin-top:10px;
    }
    img{
      display: inline-block;
      width:120px;
      height:60px;
      margin: 24px auto;
    }
    .key-word-wrap{
      position: relative;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: rgb(104, 124, 138);
      font-weight: bold;
      margin: 0px;
      .key-word{
        max-width: 100px;
        color: rgb(31, 119, 243);
        font-style: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0px 3px;
        overflow: hidden;
      }
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
