<template>
  <div class="home"
       v-if="easyFlowVisible">
    <div class="header">
      <el-button size="meduim"
                 type="primary"
                 @click="loadFlow">加载流程</el-button>
      <el-button size="meduim"
                 type="primary"
                 @click="saveFlow">保存流程</el-button>
    </div>
    <div class="content">
      <div class="navMenu"
           ref="navMenu">
        <flow-tool @addNode="addNode"></flow-tool>
      </div>
      <div class="flow-content">
        <div id="flowContianer"
             class="container">
          <template v-for=" (node) in data.nodeList">
            <flow-node :key="node.id"
                       :node="node"
                       :active="activeData && (activeData.id === node.id)"
                       @deleteNode="deleteNode"
                       @changeNodeSite="changeNodeSite"
                       @editNode="editNode"></flow-node>
          </template>
        </div>
      </div>
    </div>
    <node-form v-if="nodeFormVisible"
               ref="nodeForm"
               :nodeData="activeData"
               :nodelist=data.nodeList
               @saveUnitData="saveUnitData"></node-form>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import { util } from '@/utils/util'
import { mapActions, mapGetters } from 'vuex'
import flowNode from '../components/node'
import flowTool from '../components/tool'
import nodeForm from '../components/node_form'
const triggerId = util.getRandomId()
const triggerNode = {
  id: triggerId,
  left: 50 + 'px',
  top: 50 + 'px',
  show: true,
  icon: require('../assets/icon-trigger.png'),
  name: '触发器',
  type: 'triggerNode',
  nodeData: {
    defaultJump: {
      id: triggerId + '_' + util.getRandomId(),
      nextId: ''
    }
  }
}
const sourceOption = {
  anchors: ['Right'],
  isSource: true
}
// 默认设置参数
const jsplumbSetting = {
  // 动态锚点、位置自适应
  Container: 'flowContianer',
  // 连线的样式 StateMachine、Flowchart
  // Connector: 'Flowchart',
  Connector: [
    'Flowchart',
    { stub: [40, 60], gap: 7, cornerRadius: 5, alwaysRespectStubs: true }
  ],
  // 鼠标不能拖动删除线
  ConnectionsDetachable: false,
  // 删除线的时候节点不删除
  DeleteEndpointsOnDetach: true,
  // 连线的端点
  Endpoint: ['Dot', { radius: 7 }],
  // 线端点的样式
  EndpointStyle: { fill: 'transparent' },
  LogEnabled: true, // 是否打开jsPlumb的内部日志记录
  // 绘制线
  PaintStyle: { stroke: '#999', strokeWidth: 4, fill: 'transparent' },
  // 绘制箭头
  HoverPaintStyle: {
    strokeWidth: 4,
    stroke: '#409EFF'
  },
  // Overlays: [['Arrow', { width: 15, length: 15, location: 1 }]],
  RenderMode: 'svg'
}
export default {
  data () {
    return {
      jsPlumb: null, // jsPlumb 实例
      easyFlowVisible: true,
      flowInfoVisible: false,
      nodeFormVisible: false,
      loadEasyFlowFinish: false,
      // 数据
      data: {
        nodeList: [triggerNode],
        lineList: []
      },
      activeData: null
    }
  },
  components: {
    flowNode,
    flowTool,
    nodeForm
  },
  mounted () {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      this.jsPlumbInit()
      this.loadEasyFlowFinish = true
    })
  },
  watch: {
    'data.nodeList': {
      handler (val) {
        this.listenNodeListChange(this.data.nodeList)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['getScrollPosition'])
  },
  methods: {
    ...mapActions(['listenNodeListChange', 'listenScrollPosition']),
    setActiveData (data) {
      console.log(data)
      this.activeData = data
      console.log(this.activeData)
    },
    jsPlumbInit () {
      const _this = this
      this.jsPlumb.ready(function () {
        // 导入默认配置
        _this.jsPlumb.importDefaults({
          ...jsplumbSetting,
          ConnectionOverlays: [
            [
              'Arrow',
              {
                location: 1,
                visible: true,
                width: 11,
                length: 11,
                id: 'ARROW',
                events: {
                  click: function () {
                    alert('you clicked on the arrow overlay')
                  }
                }
              }
            ],
            [
              'Label',
              {
                location: 0.5,
                id: 'label',
                cssClass: 'aLabel',
                visible: false,
                events: {
                  tap: function (e) {
                    _this.jsPlumb.deleteConnection(e.component)
                  }
                }
              }
            ]
          ]
        })
      })
      // 初始化流程图
      _this.initFlow()
      // 会使整个jsPlumb立即重绘。
      _this.jsPlumb.setSuspendDrawing(false, true)
      // 监听生成连线时
      _this.jsPlumb.bind('connection', function (evt) {
        let from = evt.source.id
        let to = evt.target.id
        console.log(evt.source.id, evt.target.id, '监听线连接时')
        if (_this.loadEasyFlowFinish) {
          _this.data.lineList.push({
            from: from,
            to: to
          })
        }
        _this.listenLineHandle(from, to, 'connect')

        // evt.connection.getOverlay('label').setLabel(evt.sourceId + '-' + evt.targetId)
      })

      // 删除连线
      _this.jsPlumb.bind('click', function (conn, originalEvent) {
        // console.log(conn)
        // _this.jsPlumb.deleteConnection(conn)
      })

      // 鼠标放到元素上时
      _this.jsPlumb.bind('mouseover', function (conn, originalEvent) {
        if (conn.getOverlays().label) conn.getOverlays().label.setVisible(true)

        // _this.jsPlumb.deleteConnection(conn)
      })

      // 鼠标移出元素上时
      _this.jsPlumb.bind('mouseout', function (conn, originalEvent) {
        if (conn.getOverlays().label) {
          conn.getOverlays().label.setVisible(false)
        }
        // _this.jsPlumb.deleteConnection(conn)
      })

      // 监听线被删除
      _this.jsPlumb.bind('connectionDetached', function (evt) {
        _this.deleteLine(evt.sourceId, evt.targetId)
      })

      // 监听线被连接时不允许自己与自己相连
      _this.jsPlumb.bind('beforeDrop', function (conn) {
        return !conn.sourceId.includes(conn.targetId)
      })
    },

    // 删除线的数据
    deleteLine (from, to) {
      console.log(this.data.lineList)
      this.data.lineList = this.data.lineList.filter(function (line) {
        return line.from !== from || line.to !== to
      })
      console.log(this.data.lineList)
      this.listenLineHandle(from, to, 'del')
    },

    // 解析加载的数据
    initFlow () {
      if (this.data.nodeList.length > 0) {
        this.data.nodeList.forEach((item, index) => {
          // 触发器只有源点，其它单元都有终点
          if (item.type !== 'triggerNode') {
            this.jsPlumb.addEndpoint(item.id, {
              anchors: ['Left'],
              isTarget: true,
              maxConnections: -1,
              paintStyle: {
                fill: 'transparent',
                radius: 7
              }
            })
          }
          this.createSourcePoint(item)
          console.log('加载数据', item)
          this.jsPlumb.draggable(item.id, {
            containment: 'parent'
          })
        })
      }
      //  初始化连线
      this.data.lineList.forEach((line, index) => {
        this.jsPlumb.connect({
          source: line.from,
          target: line.to,
          anchors: ['Right', 'Left']
        })
      })
      console.log(this.jsPlumb)
      this.jsPlumb.repaintEverything()
    },

    // 添加新的节点
    addNode (evt, type, mousePosition) {
      console.log('添加节点', evt, type, mousePosition)
      let width = this.$refs.navMenu.offsetWidth
      let id = util.getRandomId()
      var left = mousePosition.left
      var top = mousePosition.top
      if (mousePosition.left < 0) {
        console.log(evt.originalEvent.layerX, evt.originalEvent.clientY)
        left = document.getElementsByClassName('flow-content')[0].scrollLeft + evt.originalEvent.layerX - width
      }
      if (mousePosition.top < 0) {
        top = document.getElementsByClassName('flow-content')[0].scrollTop + evt.originalEvent.clientY - 100
        console.log(left)
      }
      let node = {
        id: id,
        left: left + 'px',
        top: top + 'px',
        show: true,
        nodeData: {
          slot: '',
          defaultJump: {
            id: id + '_' + util.getRandomId(),
            nextId: ''
          },
          branchJump: []
        },
        ...type

      }
      this.data.nodeList.push(node)
      console.log(typeof node.id)
      this.$nextTick(function () {
        this.jsPlumb.addEndpoint(node.id, {
          anchors: ['Left'],
          isTarget: true,
          maxConnections: -1,
          endpointStyle: {
            fill: 'transparent',
            radius: 7
          }
        })
        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })
      })
    },
    // nodeRightMenu (node.id, evt) {
    //   this.menu.show = true
    //   this.menu.curNodeId = node.id
    //   this.menu.left = evt.x + 'px'
    //   this.menu.top = evt.y + 'px'
    // },
    // 改变节点的位置
    changeNodeSite (data) {
      // console.log(data, '改变节点位置')
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.id) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    deleteNode (data) {
      console.log(this.jsPlumb)
      this.$confirm('确定要删除节点' + data.id + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          // this.data.nodeList.forEach(function (node) {
          //   if (node.id === data.id) {
          //     node.show = false
          //   }
          //   // return node.id !== data.id
          // })
          this.jsPlumb.remove(data.id)
          this.jsPlumb.repaintEverything()
          this.data.nodeList = this.data.nodeList.filter(item => {
            console.log(item)
            return item.id !== data.id
          })
          console.log(this.data.nodeList)
        })
        .catch((e) => {
          console.log(e)
        })
      return true
    },
    // 编辑节点
    editNode () {
      this.nodeFormVisible = true

      this.$nextTick(() => {
        // 保存滚动条位置
        const flowWindow = document.getElementsByClassName('flow-content')[0]
        this.listenScrollPosition({ top: flowWindow.scrollTop, left: flowWindow.scrollLeft })
        this.$refs.nodeForm.init(this.activeData, true)
      })
    },
    // 保存节点编辑的数据
    saveUnitData (data) {
      this.nodeFormVisible = false
      const nodeIndex = this.data.nodeList.findIndex(item => {
        console.log(item)
        return data.id === item.id
      })
      this.data.nodeList[nodeIndex] = data
      // 判断默认跳转关系是否有指向其它节点
      if (data.nodeData.defaultJump.nextId) {
        this.addLine({ from: data.nodeData.defaultJump.id, to: data.nodeData.defaultJump.nextId })
      }
      if (data.nodeData.branchJump.length) {
        data.nodeData.branchJump.forEach((item) => {
          // 判断分支跳转关系是否有指向其它节点
          if (item.nextId) {
            this.addLine({ from: item.id, to: item.nextId })
          }
        })
      }
      this.easyFlowVisible = false
      this.$nextTick(() => {
        this.easyFlowVisible = true
        this.jsPlumb = jsPlumb.getInstance()
        this.$nextTick(() => {
          this.jsPlumbInit()
          // 设置滚动条位置
          const flowWindow = document.getElementsByClassName('flow-content')[0]
          flowWindow.scrollTo(this.getScrollPosition)
        })
      })
    },
    // 创建单元源点
    createSourcePoint (data) {
      if (data.type === 'triggerNode') {
        this.jsPlumb.addEndpoint(data.nodeData.defaultJump.id, sourceOption)
      }
      if (data.nodeData.defaultJump.id && data.nodeData.slot) {
        this.jsPlumb.addEndpoint(data.nodeData.defaultJump.id, sourceOption)
      }
      if (data.nodeData.branchJump && data.nodeData.branchJump.length) {
        data.nodeData.branchJump.forEach((item) => {
          this.jsPlumb.addEndpoint(item.id, sourceOption)
        })
      }
    },
    // 新增连线关系并去重复的线
    addLine (line) {
      // 先删除该线的源点已连接的线,然后再生成新的线
      this.data.lineList = this.data.lineList.filter((item) => {
        return item.from !== line.from
      })
      this.data.lineList.push(line)
    },
    // 监听线的操作,删除或连接时改变单元数据   type值 connect: '连接时'， del: '删除时'
    listenLineHandle (from, to, type) {
      const sourceNode = this.data.nodeList.find((item) => {
        console.log(from.split('_')[0])
        return item.id === from.split('_')[0]
      })
      if (sourceNode.nodeData.defaultJump.id === from) {
        sourceNode.nodeData.defaultJump.nextId = type === 'connect' ? to : ''
        return
      }
      if (sourceNode.nodeData.branchJump.length) {
        sourceNode.nodeData.branchJump.map((item) => {
          if (item.id === from) {
            item.nextId = type === 'connect' ? to : ''
          }
          return item
        })
      }
    },
    // 保存流程
    saveFlow () {
      window.localStorage.setItem('flowData', JSON.stringify(this.data))
      this.$message({
        message: '流程图已保存',
        type: 'success'
      })
    },
    // 加载流程图
    loadFlow () {
      if (!window.localStorage.getItem('flowData')) {
        this.$message({
          message: '您暂未保存过流程图',
          type: 'error'
        })
      }
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(_ => {
        // 这里模拟后台获取数据、然后加载
        let data = window.localStorage.getItem('flowData')
        this.easyFlowVisible = true
        this.data = JSON.parse(data)
        this.jsPlumb = jsPlumb.getInstance()
        this.$nextTick(() => {
          this.jsPlumbInit()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  .header {
    position: relative;
    width: 100%;
    background: #fff;
    box-shadow: 2px 2px 2px 2px #eee;
    text-align: right;
    padding: 0 20px;
    box-sizing: border-box;
    height: 80px;
    line-height: 80px;
    z-index: 2;
  }
  .content {
    position: relative;
    height: calc(100vh - 80px);
    .navMenu {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 230px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .flow-content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 230px;
      right: 0;
      height: inherit;
      overflow: auto;
      box-sizing: border-box;
      & /deep/ .jtk-endpoint {
        z-index: 10 !important;
      }
      .container {
        width: 2000px;
        height: 1000px;
        overflow: hidden;
        background: url(../assets/grid-background.png);
        background-size: 50px 50px;
        box-sizing: border-box;
        position: relative;
      }
    }
  }

}
</style>
