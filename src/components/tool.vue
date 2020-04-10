<template>
<div class="menu">
<draggable v-for="(item,index) in navData"
               :key="index"
               @end="addNode"
               @choose="move(index)"
               :options="draggableOptions">
      <div class="item">
        <img :src="item.icon">
        <span>{{item.name}}</span>
      </div>
    </draggable>
</div>    
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: -1,
  top: -1
}
export default {
  data () {
    return {
      navData: [
        {
          icon: require('../assets/icon-ask.png'),
          name: '询问填槽单元',
          type: 'askNode'
        },
        {
          icon: require('../assets/icon-single.png'),
          name: '单槽接口单元',
          type: 'singleNode'
        },
        {
          icon: require('../assets/icon-multiple.png'),
          name: '多槽接口单元',
          type: 'multipleNode'
        },
        {
          icon: require('../assets/icon-operation.png'),
          name: '词槽运算单元',
          type: 'operationNode'
        },
        {
          icon: require('../assets/icon-destination.png'),
          name: '意图终点单元',
          type: 'destinationNode'
        }
      ],
      draggableOptions: {
        preventOnFilter: false
      },
      defaultOpeneds: ['group0', 'group1'],
      type: '' // 模块类型
    }
  },
  components: {
    draggable
  },
  created () {
    /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    // 根据类型获取左侧菜单对象
    move (type) {
      this.type = type
    },

    // 添加节点
    addNode (evt, e) {
      console.log(evt, e)
      this.$emit('addNode', evt, this.navData[this.type], mousePosition)
    },
    // 是否是火狐浏览器
    isFirefox () {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {   
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
   .menu {
    width: inherit;
    height: 100%;
    display: inline-block;
   .item {
    position: relative;
    width: 230px;
    height: 72px;
    box-shadow: rgb(236, 238, 240) 0px -1px 0px 0px inset;
    line-height: 72px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    background: rgb(255, 255, 255);
    transition: all 0.3s ease 0s;
    color: rgb(0, 0, 0);
    font-family: PingFang-SC;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 20px;
    }
    &:hover {
      box-shadow: rgba(66, 91, 109, 0.4) 0px 4px 8px 0px;
      z-index: 1;
      transform: scale(1.02);
    }
  }
  }
</style>
