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

export const config: PlasmoCSConfig = {
  matches: [
    "*://*.yzrdm.cdleadus.com/*",
    "*://*.192.168.1.168/*",
    "*://*.demo.redminecloud.net/*"
  ],
  exclude_matches: [
    "*://*.yzrdm.cdleadus.com/login*",
    "*://*.192.168.1.168/login*",
    "*://*.demo.redminecloud.net/login*"
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

// 定义项目类型，支持二级菜单
interface SubMenuItem {
  title: string
  url: string
}

interface ProjectData {
  name: string
  url: string
  subMenu?: SubMenuItem[]
}

async function getWikiArticles(projectUrl: string): Promise<SubMenuItem[]> {
  try {
    // 从项目URL中提取项目标识符
    // projectUrl 应该是 http://192.168.1.168/projects/yz-share 的形式
    const urlParts = projectUrl.split("/")
    const projectId = urlParts[urlParts.length - 1]
    const originalUrl = window.location.origin
    const fullUrl = `${originalUrl}/projects/${projectId}/wiki/date_index`

    const response = await fetch(fullUrl)
    if (!response.ok) {
      throw new Error("获取知识库文章失败，状态码: " + response.status)
    }

    const htmlString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")

    // 解析知识库文章数据
    const articles: SubMenuItem[] = [
      {
        title: "起始页",
        url: "/projects/yz-share/wiki"
      }
    ]
    const h3Elements = doc.querySelectorAll("#content h3")

    h3Elements.forEach((h3, index) => {
      const ul = h3.nextElementSibling as HTMLUListElement
      if (ul && ul.tagName === "UL") {
        const links = ul.querySelectorAll("li a")
        links.forEach((link: Element) => {
          const a = link as HTMLAnchorElement
          articles.push({
            title: a.textContent?.trim() || "",
            url: a.href
          })
        })
      }
    })

    return articles
  } catch (error) {
    console.error("获取知识库文章时发生错误:", error)
    return []
  }
}

async function getData(): Promise<ProjectData[]> {
  const originalUrl = window.location.origin
  try {
    // 定义要访问的 URL
    const url = originalUrl + "/projects"

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
    const projects = await Promise.all(
      Array.from(aTags).map(async (a: Element) => {
        const projectUrl = (a as HTMLAnchorElement).href
        const projectData: ProjectData = {
          name: a.textContent?.trim() || "",
          url: projectUrl
        }

        // 如果是知识库项目，获取二级菜单
        if (projectData.name === "知识库") {
          const wikiArticles = await getWikiArticles(projectUrl)
          projectData.subMenu = wikiArticles
        }

        return projectData
      })
    )

    return projects
  } catch (error) {
    console.error("获取或解析数据时发生错误:", error)
    return []
  }
}

const MenuRevamp: FC<PlasmoCSUIProps> = () => {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [expandedProject, setExpandedProject] = useState<string | null>(
    "知识库"
  )

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

  /**点击子菜单项 */
  function handleSubMenuClick(url: string) {
    window.location.href = url
  }

  /**切换下拉菜单 */
  function toggleSubMenu(projectName: string, hasSubMenu: boolean) {
    if (hasSubMenu) {
      setExpandedProject(expandedProject === projectName ? null : projectName)
    }
  }

  return (
    <>
      <div className="project-list-title">研发管理系统</div>
      {projects.map((project) => {
        const hasSubMenu = project.subMenu && project.subMenu.length > 0

        return (
          <div key={project.name} className="project-container">
            <div
              className={
                window.location.href.startsWith(project.url)
                  ? "project-item project-item-active"
                  : "project-item"
              }>
              <span
                className="project-link"
                onClick={() => {
                  if (hasSubMenu) {
                    toggleSubMenu(project.name, hasSubMenu)
                  } else {
                    handleProjectClick(project.url)
                  }
                }}>
                {project.name}
              </span>
              {hasSubMenu && (
                <div className="project-actions">
                  <span
                    className={`submenu-toggle ${expandedProject === project.name ? "expanded" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSubMenu(project.name, hasSubMenu)
                    }}>
                    ▶
                  </span>
                </div>
              )}
            </div>

            {/* 二级菜单 */}
            {hasSubMenu && expandedProject === project.name && (
              <div className="submenu">
                {project.subMenu!.map((subItem) => (
                  <div
                    key={subItem.url}
                    className={`submenu-item ${
                      window.location.href === subItem.url
                        ? "submenu-item-active"
                        : ""
                    }`}
                    onClick={() => handleSubMenuClick(subItem.url)}>
                    <a className="submenu-link" href={subItem.url}>
                      {subItem.title}
                    </a>
                  </div>
                ))}
              </div>
            )}
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
