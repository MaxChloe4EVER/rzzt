<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @update:visible="$emit('update', $event)"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model.trim="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model.trim="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
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
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model.trim="formData.introduce"
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
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 获取部门的全部接口
import { getDepartments, addDepartment, getDepartDetail, updateDepartments } from '@/api/departments'

// 获取员工列表的接口
import { getEmployeeSimple } from '@/api/employees'

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
    // 判断添加或编辑的下级部门编码是否与其他部门相同
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 这里不需要筛选同一树节点下的所有子节点了，因为部门编码在整个组织架构内是唯一的
      let isRepeat = false
      if (this.formData.id) {
        // 前面的条件是保证 要编辑的节点 与其他所有子节点的 id 都不相同
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value)
      } else {
        isRepeat = depts.some(item => {
        // 有可能item.code 和 value 是两个null,所以后面要加 &&value 保证 value 不是null
          item.code === value && value
        })
      }
      isRepeat ? callback(`组织架构中已经有部门使用${value}编码`) : callback()
    }

    // 判断添加或编辑的下级部门名称是否与其他下级部门同名
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 判断是否有重名的部门，是则返回 true，否则返回 false
      let isRepeat = false // 先假定没有重复的
      if (this.formData.id) {
        // 编辑操作的校验规则
        isRepeat = depts.filter(item => {
          // 前面的条件是保证 要编辑的节点 与 除它以外的所有子节点 id 都不相同 && 后面的条件是保证 编辑的节点与其他节点有同一个父节点，两者共同作用就得到了一个除要编辑的部门之外，其他所有同级部门组成的数组
          return item.id !== this.formData.id && item.pid === this.treeNode.pid
        }).some(item => {
          // 判断 同级节点中 有没有跟 要编辑的部门名称重名
          return item.name === value
        })
      } else {
        isRepeat = depts.filter(item =>
        // 筛选当前树节点里所有的子节点，有没有同名部门的前提是处于同一树节点下面，不同的树节点是可以有相同的部门的
          item.pid === this.treeNode.id
        ).some(item => {
        // 判断输入的子节点名称 value 是否已经存在
          return item.name === value
        })
      }
      // 如果有重复的部门，则抛出错误，如果没有则直接放行
      isRepeat ? callback(new Error(`同级部门下已经有${value}部门了`)) : callback()
    }

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
          { validator: checkNameRepeat, trigger: 'blur' }
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
  computed: {
    // 使用计算属性可以将数据缓存，再次加载时不需要再获取
    showTitle() {
      // 在第181行中，已经将需要编辑的部门详情赋值给了 formData，因此判断 formData 中是否有 id 这个属性，就可以判断是编辑还是新增
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取员工列表
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      this.peoples = res
    },
    btnOK() {
      this.$refs.deptForm.validate(async(isOK) => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments({ ...this.formData })
          } else {
            await addDepartment({
              ...this.formData,
              // 传入pid 就能确认 父节点，就可以根据之前的递归立体化数据
              pid: this.treeNode.id
            })
          }
          // 触发父组件的事件，重新获取并渲染组织架构
          this.$emit('addDepts')
          // 关闭弹窗
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 关闭弹窗
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
      // 因为 resetFields() 方法只能清除表单上的数据，表单以外的数据无法清除，因此通过直接赋值，每次关闭将this.formData.id 设为空，否则 title 会一直处于编辑部门的状态
      this.formData.id = ''
      // 也可以直接将 formData 指向一个空对象
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    // 这个方法是 专供父组件调用的，用于获取目标部门的详情
    // 传入的参数是父组件中的数据
    // props传值是异步的微任务，我们在调用这个方法时，如果传入 this.treeNode.id 是不一定获取到的，因此要绕过 props，父组件直接调用并传参
    async getDepartDetail(id) {
      // 将要编辑的部门信息赋值给 formData
      this.formData = await getDepartDetail(id)
    }
  }
}

</script>

<style scoped>
</style>
