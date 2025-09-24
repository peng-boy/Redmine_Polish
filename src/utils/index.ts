/**
 * 安全地将 HTML 字符串渲染到指定的 DOM 容器中，并执行其中的脚本。
 *
 * @param {string} htmlString - 包含 HTML 和脚本的字符串。
 * @param {HTMLElement} container - 目标容器元素，HTML 将被渲染到这里。
 */
export function renderHtmlWithScripts(htmlString, container) {
  if (!container || typeof container.innerHTML === "undefined") {
    console.error("目标容器无效或不存在。")
    return
  }

  // 1. 创建一个临时容器来解析 HTML 字符串
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlString

  // 2. 找到所有 <script> 标签，将它们从临时容器中移除
  const scripts = Array.from(tempDiv.querySelectorAll("script"))
  scripts.forEach((script) => script.remove())

  // 3. 将不含脚本的 HTML 内容渲染到目标容器中
  container.innerHTML = tempDiv.innerHTML

  // 4. 手动创建并执行脚本
  scripts.forEach((script) => {
    // 创建一个新的 <script> 元素
    const newScript = document.createElement("script")

    // 复制原始脚本的所有属性（如 type, async, defer 等）
    Array.from(script.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value)
    })

    if (script.src) {
      // 如果是外部脚本，设置 src 属性
      newScript.src = script.src
    } else {
      // 如果是内联脚本，设置文本内容
      newScript.textContent = script.textContent
    }

    // 将新脚本添加到文档的 <head> 或 <body> 中，以确保其被执行
    document.head.appendChild(newScript)

    // 监听脚本加载完成或错误，然后将其从文档中移除以保持 DOM 整洁
    newScript.onload = newScript.onerror = () => {
      newScript.remove()
    }
  })
}
