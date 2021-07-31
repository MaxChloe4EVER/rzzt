<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="dashboard-container"
  >
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
          style="width: 100%"
        >
          <!-- 树形结构内部会自动遍历传入的数据，得到每一个树节点data -->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
        <!-- /树形结构 -->
      </el-card>
    </div>
    <AddDept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @update="showDialog = $event"
      @addDepts="getDepartments"
    />
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
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取所有部门，并将数据改造为树形结构渲染到界面上
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: '负责人',
        // 把 首部公司 的id 设为 ''，这就说明所有 pid='' 的树节点都是他的子节点，这样就将两者联系起来了
        id: ''
      }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 添加子节点
    addDepts(node) {
      this.showDialog = true
      // 将 treeTools 组件传来的父节点信息储存起来，传递给add-dept组件
      this.node = node
    },
    async editDepts(node) {
      // 将 treeTools 组件传来的父节点信息储存起来，传递给add-dept组件
      this.node = node
      // 这里是通过 ref 直接选中子组件，可以直接调用子组件中暴露的方法
      await this.$refs.addDept.getDepartDetail(node.id)
      this.showDialog = true
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
