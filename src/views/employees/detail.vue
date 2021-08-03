<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :model="userInfo"
              :rules="rules"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" />
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        password2: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 9,
            message: '密码长度6-12位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserDetailById()
  },
  mounted() {},
  methods: {
    // 根据id获取员工基本信息
    async getUserDetailById() {
      const res = await getUserDetailById(this.userId)
      this.userInfo.username = res.username
    },

    // 保存员工信息
    async saveUser() {
      try {
        this.$refs.userForm.validate()
        await saveUserDetailById(
          { ...this.userInfo,
            // 这里是将 password2 的数据赋值给 接口需要的 password，这样既不影响接口接收数据，也便于我们拿到用户未加密的密码
            password: this.userInfo.password2
          }
        )
        this.$message.success('保存成功')
        console.log(this.userInfo)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
</style>
