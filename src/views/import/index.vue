<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

import UploadExcel from '@/components/UploadExcel'

export default {
  name: '',
  components: {
    UploadExcel
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // header 表示 excel 表格的表头信息，result 表示表格的内容，result是数组套对象的格式
    async success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []

      // 这段代码的目的是将表格对象的属性名从中文变为英文，
      // 怎么知道表格对象里都有什么，直接打印 result 表格内容
      results.forEach((item) => {
        const userInfo = {}
        Object.keys(item).forEach((key) => {
          userInfo[userRelations[key]] = item[key]
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            // 只有这样, 才能入库
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')
            )
          }
        })
        arr.push(userInfo)
      })
      await importEmployee(arr) // 调用导入接口
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style scoped>
</style>
