// import redmineCss from "data-text:~/assets/redmine.css"
import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import "src/styles/tailwind.css" // 引入tailwind

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  css: ["../styles/my-styles.scss"],
  all_frames: true,
  run_at: "document_start"
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if ($(node).is("tr")) {
          node.classList.add("h-[40px]", "py-8")
          const inputElement = node.querySelector<HTMLInputElement>(
            ".checkbox.hide-when-print input"
          )
          if (inputElement) {
            inputElement.style.width = "16px"
            inputElement.style.height = "16px"
          }
          node.querySelector("tbody tr").classList.add("h-[40px]", "py-8")
        }
      })
      tableHandler(mutation.target.closest("table"), true)
    } else if (mutation.type === "attributes") {
      // console.log("属性变化:", mutation)
    }
  }
})

/** 顶部菜单处理 */
function TopMenuHandler() {
  const $loggedas = $("#top-menu #loggedas")
  const $ul = $("#top-menu>ul")
  const $menu = $("#top-menu")

  // $menu.css({backgroundColor: 'pink'})

  if ($loggedas.length && $ul.length) {
    // 创建一个 div 包裹
    const $container = $("<div>").addClass("w-[300px] flex justify-end")
    $container.append($loggedas).append($ul) // 将元素移入容器中
    $menu.append($container) // 插入到 #top-menu 中
  }

  $("#sidebar").addClass("w-sm")

  $menu.css({ height: "fit-content", padding: "1em", fontSize: "12px" })
  $menu.addClass("flex justify-between items-center")
}

function tableHandler(targetTable?, newAdd?: boolean) {
  if (newAdd) {
    const $table = targetTable ? $(targetTable) : $("#issues-tree")

    $table.find("tbody tr td.buttons").each(function () {
      const $td = $(this)
      if (!$td.find(".table-handle-btn").length) {
        // 如果还没有按钮，才插入
        $td.addClass("flex justify-center items-center")
          .html(`        <a class="table-handle-btn">编辑</a>
        <a class="table-handle-btn">状态</a>
        <a class="js-contextmenu">更多</a>
      `)
      }
    })

    return
  }

  const theadBtn = $("#issues-tree thead tr th.buttons")
  theadBtn.html("<a>操作</a>").css({ width: "150px" })

  const bodyBtn = $("#issues-tree tbody tr td.buttons")
  bodyBtn.addClass("flex justify-center items-center")
  bodyBtn.html(`
    <a class="table-handle-btn">编辑</a>
    <a class="table-handle-btn">状态</a>
    <a class="js-contextmenu">更多</a>
  `)

  // const editBtn = $("<a>").text("编辑").addClass("table-handle-btn");
  // const stateBtn = $("<a>").text("状态").addClass("table-handle-btn");
  // const moveBtn = $("<a>").text("更多").addClass("js-contextmenu");

  // $('.icon-only.icon-actions.js-contextmenu').html("更多")

  // bodyBtn.prepend(editBtn, stateBtn, moveBtn);
}

// 使用 document 做事件委托，确保动态内容也能绑定
$(document).on(
  "click",
  "#issues-tree tbody tr td.buttons .table-handle-btn",
  function () {
    const tr = $(this).closest("tr")
    const issueID = tr.attr("id")?.replace("issue-", "") || ""
    window.open(`${window.location.origin}/issues/${issueID}/edit`)
  }
)

const RedminePlugin = () => {
  console.log("=============")

  return null
}

export default RedminePlugin
