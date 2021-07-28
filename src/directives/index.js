// 图片加载失败时触发的自定义事件
export const imageerror = {
  insert(el, binding) {
    el.onerror = function() {
      // binding.value接收自定义事件传入的参数
      el.src = binding.value
    }
  }
}
