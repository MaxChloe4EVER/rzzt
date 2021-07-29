<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: '',
  components: {},
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async operateDepts(type) {
      if (type === 'add') {
        // 将当前父节点的信息存储起来，传递给 department的index 组件
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        console.log('编辑')
      } else {
        this.$confirm('是否删除此部门?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          // 点击“是”跳到这一步，调接口删除对应id的部门
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 调接口成功后跳到这一步，更新父组件的数据并提示
          this.$emit('delDepts')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
