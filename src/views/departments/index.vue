<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :tree-node="company" :is-root="true" />
        <!-- 树形结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
          style="width: 100%"
        >
          <!-- 树形结构内部会自动遍历传入的数据，得到每一个树节点 -->
          <TreeTools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
        <!-- /树形结构 -->
      </el-card>
    </div>
    <AddDept :show-dialog="showDialog" :tree-node="node" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'

import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 是否弹出 添加部门 的弹出框
      showDialog: false,
      // 记录在哪个节点下新增部门
      node: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: '负责人',
        id: ''
      }
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts(node) {
      this.showDialog = true
      // 将 treeTools 组件传来的父节点信息储存起来，传递给add-dept组件
      this.node = node
      console.log(node)
    }
  }
}
</script>

<style scoped>
.tree-card {
  width: 100%;
  padding: 30px 140px;
  font-size: 14px;
}
</style>
