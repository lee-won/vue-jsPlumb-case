<template>
  <div ref="node"
       :id="node.id"
       :style="flowNodeContainer"
       :class="['node',active ? 'active' : '']"
       @mousedown="setActiveData"
       @mouseup="changeNodeSite">
    <section :class="['visual-block', node.type==='triggerNode' ? 'trigger' : '']">
      <div class="header"
           v-if="node.type !== 'triggerNode'">
        <div class="header-left">
          <img class="icon"
               :src="node.icon" />
          <span>{{node.name}}</span>
        </div>
        <div class="header-right"
             v-if="node.type !== 'destinationNode'">
          <a href="#"
             class="icon"
             @click="editNode"><img src="../assets/edit.png"></a>
          <a href="#"
             class="icon"
             @click.stop.prevent="deleteNode"><img src="../assets/delete.png"></a>
        </div>
      </div>

      <span class="block-endpoint-dom"
            v-if="node.type !== 'triggerNode'"></span>
      <div class="no-msg"
           v-if="!node.nodeData.slot &&  !['triggerNode', 'destinationNode'].includes(node.type)">
        <span>暂无对话消息，点击单元添加</span>
        <img class="no-msg-bg"
             src="../assets/block-preview.png" />
      </div>
      <component :is="node.type"
                 :node="node"></component>

    </section>
  </div>
</template>

<script>
import triggerNode from './node/triggerNode'
import askNode from './node/askNode'
import singleNode from './node/singleNode'
import multipleNode from './node/multipleNode'
import operationNode from './node/operationNode'
import destinationNode from './node/destinationNode'
export default {
  components: {
    triggerNode,
    askNode,
    singleNode,
    multipleNode,
    operationNode,
    destinationNode
  },
  props: {
    node: Object,
    active: Boolean
  },
  data () {
    return {
      // 控制节点操作显示
      mouseEnter: false
    }
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get () {
        return {
          // position: 'absolute',
          top: this.node.top,
          left: this.node.left
        }
      }
    }
  },
  methods: {
    setActiveData () {
      this.$parent.activeData = this.node
    },
    // 删除节点
    deleteNode () {
      this.$emit('deleteNode', this.node)
    },
    // 编辑节点
    editNode () {
      this.setActiveData()
      this.$emit('editNode')
    },
    // 鼠标移动后抬起
    changeNodeSite () {
      // 避免抖动
      if (this.node.left === this.$refs.node.style.left && this.node.top === this.$refs.node.style.top) {
        return
      }
      this.$emit('changeNodeSite', {
        id: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.node {
  position: absolute;
  z-index: 1;
  &.active {
    z-index: 2;
    .visual-block {
      border-width: 2px;
      border-style: solid !important;
      border-color: rgb(31, 119, 243);
    }
  }
  &:hover {
    .visual-block {
      border-width: 2px;
      border-style: dashed;
      border-color: rgb(31, 119, 243);
    }
  }
}
.visual-block {
  position: relative;
  width: 256px;
  padding-bottom: 16px;
  box-shadow: rgba(66, 91, 109, 0.4) 0px 2px 4px 0px;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  border-image: initial;
  background: rgb(255, 255, 255);
  transition: all 0.3s ease 0s;
  box-sizing: border-box;
  &:hover {
    border: 2px dashed rgb(31, 119, 243);
  }
  &.active {
    border-width: 2px;
    border-style: solid;
    border-color: rgb(31, 119, 243);
  }
  &.trigger {
    width: 100px !important;
    padding-bottom: 0;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    font-size: 12px;
    font-weight: 700;
    padding: 0 10px;
    .header-left {
      display: flex;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .header-right {
      text-align: right;
      .icon {
        margin-left: 15px;
      }
    }
  }
  .no-msg {
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 10px 20px;
    color: rgb(0, 0, 0);
    position: relative;
    text-align: center;
    .no-msg-bg {
      display: block;
      width: 150px;
      margin: 20px auto;
    }
  }
  .block-endpoint-dom {
    position: absolute;
    top: 50%;
    left: -9px;
    width: 14px;
    height: 14px;
    margin-top: -7px;
    border-width: 3px;
    border-style: solid;
    border-color: rgb(142, 156, 168);
    border-image: initial;
    border-radius: 8px;
    background: rgb(142, 156, 168);
    box-sizing: border-box;
    z-index:1;
  }
}
</style>
