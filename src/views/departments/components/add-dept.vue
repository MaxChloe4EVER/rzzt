<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" porp="name">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" porp="code">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" porp="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" porp="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 过去全部部门的接口
import { getDepartments } from '@/api/departments'

// 获取员工列表的接口
import { getEmployeeSimple } from '@/api/employees'

// 判断添加的下级部门名称是否与其他下级部门同名
const checkNamwRepeat = (value, callback) => {
  const { depts } = getDepartments()
  // 是否有重名的部门，是则返回 true，否则返回 false
  const isRepeat = depts.filter(item => {
    // 筛选当前树节点里所有的子节点，有没有同名部门的前提是处于同一树节点下面，不同的树节点是可以有相同的部门的
    item.pid === this.treeNode.id
  }).some(item => {
    // 判断输入的子节点名称 value 是否已经存在
    item.name === value
  })
  // 如果有重复的部门，则抛出错误，如果没有则直接放行
  isRepeat ? callback(new Error(`同级部门下已经有${value}部门了`)) : callback()
}

// 判断添加的下级部门编码是否与其他部门相同
const checkCodeRepeat = (value, callback) => {
  const { depts } = getDepartments()
  // 这里不需要筛选同一树节点下的所有子节点了，因为部门编码在整个组织架构内是唯一的
  const isRepeat = depts.some(item => {
    // 有可能item.code 和 value 是两个空字符串,所以后面要加 &&value 保证 value 不是个空字符串
    item.code === value && value
  })
  isRepeat ? callback(`组织架构中已经有部门使用${value}编码`) : callback()
}

export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 定义表单校验字段
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义表单校验规则
      rules: {
        // 校验部门名称
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          // 这里不需要在写 message，在自定义校验规则中已经写了
          { validator: checkNamwRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      peoples: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      this.peoples = res
    }
  }
}
</script>

<style scoped>
</style>
