import previewStyle from "data-text:../styles/preview-style.scss"
import $ from "jquery"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetStyle,
  PlasmoMountShadowHost,
  PlasmoRender
} from "plasmo"
import { useEffect, useRef, useState } from "react"
import type { FC } from "react"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  css: ["../styles/preview-style.scss"],
  all_frames: true
}

/** 使用 getRootContainer 那么getStyle便不会生效 */
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = previewStyle
  return style
}

export const getRootContainer = () =>
  new Promise((resolve, rejects) => {
    let timeout = 10000 // 10秒超时
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.body
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
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

async function getIssuesData(ttId: string): Promise<any> {
  // http://192.168.1.168/issues/342
  const response = await fetch(`http://192.168.1.168/issues/${ttId}`)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.text()
}

const PreviewComponent: FC<PlasmoCSUIProps> = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [ttId, setTtId] = useState<string | null>(null) // 当前预览的主题ID
  const [title, setTitle] = useState<string>("") // 当前预览的主题标题
  const [issueData, setIssueData] = useState<any>(null)
  const previewContentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    /**
     * 插入一个div.preview-button到table tbody tr .subject
     * 点击preview-button将showPreview设为true
     */
    $("table tbody tr .subject").append(
      "<div class='preview-button'>预览</div>"
    )
    $(document).on("click", ".preview-button", function () {
      const ttId = $(this).closest("tr").data("tt-id")
      setTtId(ttId)
      getIssuesData(ttId).then((data) => {
        const tempHtml = $(data)
        const title = tempHtml.find(".subject h3").first().text()
        setTitle(title)

        tempHtml.find("#history .tabs ul li a").each(function () {
          const $this = $(this)
          // $this.removeAttr("href")
          // const newID = $this.attr("id").replace("tab-", "")
          // $this.attr(
          //   "onclick",
          //   `showIssueHistory(${newID},${window.location.href}); return false;`
          // )
          $this.on("click", function (event) {
            // 阻止默认的浏览器跳转行为
            event.preventDefault()

            // showIssueHistory()
          })
        })
        const tempDiv = document.createElement("div")
        $(tempDiv).append(tempHtml) // 使用 .append() 将所有根元素都添加到 tempDiv 中
        const processedHtmlString = tempDiv.innerHTML
        if (previewContentRef.current) {
          previewContentRef.current.innerHTML = processedHtmlString
        }

        setIssueData(tempHtml)
        setShowPreview(true)
      })
    })
  }, [])

  useEffect(() => {
    // 插入一个半透明背景层
    if (showPreview) {
      $("body").append("<div id='preview-background'></div>")
    } else {
      $("#preview-background").remove()
    }
  }, [showPreview])

  /** 进入主题 */
  function enterTopic() {
    if (ttId) {
      window.open(`/issues/${ttId}`, "_blank")
    }
  }

  return (
    <div id="preview" className={showPreview ? "preview-show" : ""}>
      <div className="header">
        <div className="preview-title">{title}</div>
        <div>
          <button onClick={enterTopic}>进入主题</button>
          <button
            className="close-button"
            onClick={() => setShowPreview(false)}>
            关闭
          </button>
        </div>
      </div>
      <div id="preview-content" ref={previewContentRef} />
    </div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<PreviewComponent />)
}

export default PreviewComponent
