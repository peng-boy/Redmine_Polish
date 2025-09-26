import $ from "jquery"

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

/**
 * 查找并注入“预览”按钮到目标元素。
 *
 * @param {HTMLElement | JQuery} scope - 要搜索按钮的范围（如整个文档、新增的行或父容器）。
 */
function injectPreviewButton(scope) {
  // 确保 scope 是一个 jQuery 对象
  const $scope = $(scope)

  // 目标选择器：表格行中的 .subject 单元格
  // 假设你的目标是在所有表格行（tr）中查找 .subject 元素
  const $targetCells = $scope.is(".subject") ? $scope : $scope.find(".subject")

  $targetCells.each(function () {
    const $subjectCell = $(this)

    // 确保按钮不存在，避免重复插入
    if ($subjectCell.find(".preview-button").length === 0) {
      $subjectCell.append("<div class='preview-button'>预览</div>")
    }
  })
}

/**
 * 启动 MutationObserver，监听表格或内容区域中新增的表格行。
 * @param {string} targetSelector - 要监听的父容器的选择器，例如 '#content'
 */
export function setupObserver(targetSelector) {
  const targetNode = document.querySelector(targetSelector)

  if (!targetNode) {
    console.warn(`[Observer] 目标节点未找到: ${targetSelector}`)
    return
  }

  const config = { childList: true, subtree: true }

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          // 仅处理元素节点
          if (node.nodeType === 1) {
            // 将新增的节点作为搜索范围，调用注入函数
            injectPreviewButton(node)
          }
        })
      }
    }
  }

  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)
  // console.log("[Observer] 已启动，监听表格动态加载。")
}
