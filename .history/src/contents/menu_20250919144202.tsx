// import redmineCss from "data-text:~/assets/redmine.css"
import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { MenuStyle } from "../styles/menu-style"

import "src/styles/tailwind.css" // 引入tailwind

async function getData() {
  try {
    // 定义要访问的 URL
    const url = "http://192.168.1.168/projects"

    // 使用 fetch API 发起 GET 请求
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("网络请求失败，状态码: " + response.status)
    }

    const htmlString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")

    // 使用 querySelectorAll 获取所有符合条件的 <a> 标签
    const aTags = doc.querySelectorAll("ul.projects.root li.root a")

    // 将数据转换为数组对象
    const projectData = Array.from(aTags).map((a: Element) => ({
      name: a.textContent?.trim() || "",
      url: (a as HTMLAnchorElement).href
    }))

    return projectData
  } catch (error) {
    console.error("获取或解析数据时发生错误:", error)
    return []
  }
}

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  css: ["../styles/menu-style.scss"],
  all_frames: true,
  run_at: "document_start"
}

const MenuRevamp = () => {
  const [projects, setProjects] = useState<
    Array<{ name: string; url: string }>
  >([])

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getData()
      setProjects(data)
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (projects.length === 0) return

    const wrapper = $("#wrapper")
    const newDom = $("<div id='project-list'></div>")
    // 获取当前页面的URL
    const currentUrl = window.location.href.split("?")[0] // 移除查询参数

    // 创建项目列表
    projects.forEach((project) => {
      // 移除项目URL中的查询参数进行比较
      const projectUrl = project.url.split("?")[0]
      // 修改匹配逻辑：当前URL包含项目URL时也认为是激活状态
      const isActive = currentUrl.startsWith(projectUrl)

      const projectItem = $("<div></div>")
        .addClass("project-item")
        .addClass(isActive ? "project-item-active" : "")

      const projectLink = $("<a class='project-link'></a>")
        .attr("href", project.url)
        .text(project.name)

      const projectInfo = $("<div class='project-item-info'></div>").text(
        project.name
      )

      projectItem.append(projectLink)
      projectItem.append(projectInfo)
      newDom.append(projectItem)
    })

    wrapper.append(newDom)

    // 清理函数
    return () => {
      wrapper.find(".project-list").remove()
    }
  }, [projects])

  return null

  return (
    <MenuStyle>
      {projects.map((project) => {
        return (
          <div key={project.name} className="project-item">
            <a href={project.url}>{project.name}</a>
          </div>
        )
      })}
    </MenuStyle>
  )
}

export default MenuRevamp
