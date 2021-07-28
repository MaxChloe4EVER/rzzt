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
          <TreeTools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
        <!-- /树形结构 -->
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'

import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(res.depts, '')
      console.log(this.departs)
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
