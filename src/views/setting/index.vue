<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="名称"
                width="240"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(scope.row.id)"
                  >编辑</el-button>
                  <!-- scope.row 是获取的表格内这一行的数据 -->
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(scope.row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.total"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑或新增角色弹层 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
// import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // 员工详情
      roleForm: {},
      // 角色的校验规则
      rules: {
        name: [{
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        }]
      },
      // 公司详情
      formData: {},
      // 员工列表
      list: [],
      // 页码等信息
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      currentPage: 1,
      // 弹出层显示与隐藏
      showDialog: false
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['companyId']),
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleList(this.page)
      this.list = res.rows
      this.page.total = res.total
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList(this.page)
    },
    // 获取公司信息
    async getCompanyInfo() {
      try {
        this.formData = await getCompanyInfo(this.companyId)
      } catch (error) {
        console.log(error)
      }
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        deleteRole(id)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (error) {
        console.log(error)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 编辑角色信息
    async editRole(id) {
      // 先把未编辑的角色信息传给弹层
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 弹出层确认按钮
    async btnOK() {
      try {
        // 先进行表单校验
        await this.$refs.roleForm.validate()
        // 如果 roleForm 有 id，则进行编辑操作
        if (this.roleForm.id) {
          // 调用编辑角色的接口
          await updateRole(this.roleForm)
        } else {
          // 如果 roleForm 没有 id，则进行新增操作
          await addRole(this.roleForm)
        }
      } catch (error) {
        console.log(error)
      }
      // 重新获取角色列表
      this.getRoleList()
      // 关闭弹窗
      this.showDialog = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
    },
    // 弹出层取消按钮
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>
</style>
