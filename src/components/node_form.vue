<template>
  <el-drawer :visible.sync="visible"
             direction="ltr"
             :show-close="false"
             :before-close="handleClose"
             ref="drawer">
    <template slot="title">
      <div class="header">
        <div class="header-left">{{node.name}}</div>
        <div class="header-right">
          <el-button size="medium"
                     @click="visible=false">取消</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="save">保存</el-button>
        </div>
      </div>
    </template>
    <div class="container">
      <el-collapse v-model="activeNames"
                   @change="handleChange">
        <el-collapse-item title="基础配置"
                          name="1">
          <div class="label-wrap">
            <div class="label-name">询问单元</div>
            <el-input size="medium"
                      v-model="node.name"></el-input>
          </div>
          <div class="label-wrap"
               v-if="node.nodeData">
            <div class="label-name">关联词槽</div>
            <el-select size="medium"
                       v-model="node.nodeData.slot"
                       placeholder="请选择"
                       clearable
                       style="width:100%;">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
        <el-collapse-item title="跳转关系"
                          name="2">
          <div class="label-wrap">
            <jumpRelationContainer :node="node"></jumpRelationContainer>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-drawer>

</template>

<script>
import { util } from '../utils/util'
import jumpRelationContainer from './jumpRelationContainer/jumpRelationContainer'
export default {
  components: {
    jumpRelationContainer
  },
  data () {
    return {
      activeNames: ['1', '2', '3', '4'],
      visible: false,
      node: {},
      options: [{
        value: '姓名',
        label: '姓名'
      }, {
        value: '手机号',
        label: '手机号'
      }, {
        value: '确认信息',
        label: '确认信息'
      }, {
        value: '身份',
        label: '身份'
      }],
      value: ''
    }
  },
  methods: {
    // 深复制
    init (node, bool) {
      this.visible = bool
      this.node = util.deepCopy(node)
      console.log(this.node)
    },
    addMessage (index) {
      if (index !== this.node.messageArr.length - 1) return
      console.log('enter')
      this.node.messageArr.push(this.getMessageItem())
    },
    getMessageItem () {
      return { text: '', hasEndPoint: false }
    },
    handleChange (val) {
      console.log(val)
    },
    handleClose () { },
    save () {
      if (this.node.nodeData.branchJump.length) {
        const index = this.node.nodeData.branchJump.findIndex((item) => {
          return !item.ruleEnumCode || !item.content
        })
        if (index !== -1) {
          this.$message.error('请完善分支跳转条件信息！')
          return
        }
      }
      this.visible = false
      this.$emit('saveUnitData', this.node)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 0 20px;
  box-sizing: border-box;
  .label-wrap {
    .label-name {
      color: rgb(66, 91, 109);
      padding-top: 12px;
      line-height: 36px;
      font-weight: 600;
      position: relative;
      text-align: left;
    }
    .add-btn {
      margin-top: 20px;
    }
  }
}
</style>
