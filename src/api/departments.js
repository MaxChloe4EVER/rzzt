import request from '@/utils/request'

// 获取组织架构
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 新增部门接口
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 获取部门详情接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门接口
export function updateDepartments(data) {
  return request({
    // 动态参数和请求体参数都用到了
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
