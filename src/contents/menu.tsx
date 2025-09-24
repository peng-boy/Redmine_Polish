import $ from "jquery"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoRender
} from "plasmo"
import { useEffect, useState } from "react"
import type { FC } from "react"
import { createRoot } from "react-dom/client"

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
    const aTags = doc.querySelectorAll("ul.projects.root li.root div.root a")

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
  exclude_matches: [
    "*://*.yzrdm.cdleadus.com/login*",
    "*://*.192.168.1.168/login*"
  ],
  css: ["../styles/menu-style.scss"],
  all_frames: true,
  run_at: "document_start"
}

export const getRootContainer = () =>
  new Promise((resolve, rejects) => {
    let timeout = 10000 // 10秒超时
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.getElementById("wrapper")
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        rootContainer.id = "project-list"
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      } else {
        timeout -= 100
        if (timeout <= 0) {
          clearInterval(checkInterval)
          rejects("getRootContainer timeout")
        }
      }
    }, 100)
  })

const MenuRevamp: FC<PlasmoCSUIProps> = () => {
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

  /**点击项目跳转 */
  function handleProjectClick(url: string) {
    window.location.href = url
  }

  return (
    <>
      <div className="project-list-title">研发管理系统</div>
      {projects.map((project) => {
        return (
          <div
            key={project.name}
            className={
              window.location.href.startsWith(project.url)
                ? "project-item project-item-active"
                : "project-item"
            }
            onClick={() => handleProjectClick(project.url)}>
            <a className="project-link" href={project.url}>
              {project.name}
            </a>
          </div>
        )
      })}
    </>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<MenuRevamp />)
}

export default MenuRevamp
