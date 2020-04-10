<template>
  <div class="jump-relation-container">
    <div class="jump-relation"
         v-if="node.nodeData.slot">
      <div class="title">需要跳转的单元</div>
      <div class="content">
        <div class="default-jump">
          <div class="header">默认跳转</div>
          <div class="text">如果词槽中的值不满足分支跳转条件，那么进入单元</div>
          <el-select style="width:100%"
                     size="medium"
                     clearable
                     v-model="node.nodeData.defaultJump.nextId"
                     placeholder="空">
            <el-option v-for="(item) in filterUnitList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="branch-jump"
             v-for="(item,index) in node.nodeData.branchJump"
             :key="item.id"
             @click="selectBranchJump(index)">
          <i class="el-icon-close"
             @click="deleteBranchJump(index)"></i>
          <div class="header">分支跳转</div>
          <div class="text">当词槽「{{node.nodeData.slot}}」获取到的值</div>
          <div class="condition-wrap">
            <div class="condition-left">
              <el-select size="medium"
                         v-model="item.ruleEnumCode"
                         placeholder="空"
                         clearable>
                <el-option v-for="item in conditions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="condition-right">
              <el-input style="width:100%;"
                        size="medium"
                        v-model="item.content"
                        clearable
                        placeholder="必填项，请选择或者输入值"></el-input>
            </div>
          </div>

          <div class="text">进入单元：</div>
          <el-select style="width:100%"
                     size="medium"
                     v-model="item.nextId"
                     clearable
                     placeholder="空">
            <el-option v-for="(item) in filterUnitList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="add-btn"
             @click="addBranchJump">
          <i class="el-icon-circle-plus"></i>
          添加跳转关系
        </div>
      </div>
    </div>
    <div class="no-slot"
         v-else>
      <img class="pic"
           src="../../assets/block-preview.png" />
      <div class="text">请关联词槽，配置单元跳转</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { util } from '@/utils/util'
export default {
  data () {
    return {
      entity: '',
      state: '',
      value: '',
      defaultJump: '',
      condition: 1,
      conditions: [
        {
          value: 1,
          label: '等于'
        },
        {
          value: 2,
          label: '不等于'
        },
        {
          value: 3,
          label: '大于'
        },
        {
          value: 4,
          label: '大于等于'
        },
        {
          value: 5,
          label: '小于'
        },
        {
          value: 6,
          label: '小于等于'
        },
        {
          value: 7,
          label: '包含'
        },
        {
          value: 8,
          label: '不包含'
        },
        {
          value: 9,
          label: '属于实体'
        },
        {
          value: 10,
          label: '不属于实体'
        },
        {
          value: 11,
          label: '符合正则'
        },
        {
          value: 12,
          label: '不符合正则'
        },
        {
          value: 13,
          label: '不满足条件'
        },
        {
          value: 500,
          label: '异常'
        },
        {
          value: 200,
          label: '有结果'
        },
        {
          value: 201,
          label: '无结果'
        }
      ],
      activeBranchIndex: ''
    }
  },
  props: {
    node: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    // node: {
    //   handler(val) {
    //     this.$nextTick(() => {
    //       this.defaultJump = this.node.relationVos.empty ? this.node.relationVos.empty.nextId : ''
    //       if (!this.node.relationVos.empty) this.node.relationVos.empty = { nextId: '' }

    //       if (this.node.relationVos.skipRule.length) {
    //         console.log(this.getEntityIdToNameList)
    //         this.node.relationVos.skipRule.forEach(item => {
    //           item.nextRule.entityName = this.getEntityIdToNameList.get(item.nextRule.entityId)
    //         })
    //       }
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  computed: {
    ...mapGetters(['getNodeList']),
    // 过滤掉自身单元和触发器的列表
    filterUnitList () {
      // this.unitList.unshift({ id: '', nodeName: '空' })
      return this.getNodeList.filter((item) => {
        return (item.id !== this.node.id) && (item.type !== 'triggerNode')
      })
    }
  },
  methods: {
    // 新增分支跳转
    addBranchJump () {
      const temp = {
        id: this.node.id + '_' + util.getRandomId(), // 拼接单元id,方便监听连线时找到对应单元
        ruleEnumCode: '',
        content: '',
        nextId: ''
      }
      this.node.nodeData.branchJump.push(temp)
    },
    // 删除分支跳转
    deleteBranchJump (index) {
      this.node.nodeData.branchJump.splice(index, 1)
    },
    // 分支跳转项被点击时
    selectBranchJump (index) {
      this.activeBranchIndex = index
      console.log(this.activeBranchIndex)
    }
  }

}
</script>
<style lang="scss" scoped>
.jump-relation-container {
  .jump-relation {
    .title {
      width: 100%;
      color: rgb(66, 91, 109);
      padding-top: 12px;
      line-height: 36px;
      font-weight: 600;
      position: relative;
    }
    .branch-jump {
      position: relative;
      .el-icon-close {
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 20px;
        cursor: pointer;
      }
      .header {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: rgb(66, 91, 109);
        margin-bottom: 16px;
      }
      .text {
        line-height: 36px;
        font-size: 14px;
        color: rgb(142, 156, 168);
        margin-bottom: 5px;
        &::before {
          content: "";
          width: 3px;
          height: 8px;
          margin-right: 3px;
          background: rgb(255, 62, 39);
          border-radius: 3px;
        }
      }
      .condition-wrap {
        display: flex;
        .condition-left {
          flex: 0 0 150px;
        }
        .condition-right {
          flex: 1;
          padding-left: 10px;
        }
      }
      width: 100%;
      position: relative;
      margin-bottom: 8px;
      border-radius: 8px;
      background: rgb(245, 247, 247);
      padding: 16px 16px 24px;
      box-sizing: border-box;
    }
    .add-btn {
      width: 100%;
      height: 56px;
      line-height: 56px;
      font-size: 14px;
      color: rgb(142, 156, 168);
      border-width: initial;
      border-style: none;
      border-color: initial;
      border-image: initial;
      background: rgb(245, 247, 247);
      text-align: center;
      cursor: pointer;
    }
    .default-jump {
      .header {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: rgb(66, 91, 109);
        margin-bottom: 16px;
      }
      .text {
        line-height: 36px;
        font-size: 14px;
        color: rgb(142, 156, 168);
        margin-bottom: 5px;
      }
      width: 100%;
      position: relative;
      margin-bottom: 8px;
      border-radius: 8px;
      background: rgb(245, 247, 247);
      padding: 16px 16px 24px;
      box-sizing: border-box;
    }
  }
  .no-slot {
    width: 100%;
    position: relative;
    margin-bottom: 8px;
    border-radius: 8px;
    background: rgb(245, 247, 247);
    padding: 16px 16px 24px;
    text-align: center;
    box-sizing: border-box;
    .pic {
      height: 80px;
      margin: 40px auto;
    }
    .text {
      text-align: center;
      color: rgb(179, 189, 197);
    }
  }
}
</style>
