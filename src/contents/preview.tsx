import previewStyle from "data-text:../styles/preview-style.scss"
import $ from "jquery"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  all_frames: true,
  run_at: "document_end"
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = previewStyle
  return style
}

async function getIssuesData(ttId: string) {
  // http://192.168.1.168/issues/342
  const response = await fetch(`http://192.168.1.168/issues/${ttId}`)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  //   response是个html页面

  return response.text()
}

const PreviewComponent = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [issueData, setIssueData] = useState<any>(null)
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
      getIssuesData(ttId).then((data) => {
        setIssueData(data)
        setShowPreview(true)
      })
    })
  }, [])

  useEffect(() => {
    // 插入一个半透明背景层
    if (showPreview) {
      $("body").append(
        "<div id='preview-background' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;'></div>"
      )
    } else {
      $("#preview-background").remove()
    }
  }, [showPreview])

  return (
    <div>
      {showPreview ? (
        <div id="preview">
          <div className="header">
            <div>标题</div>
            <div>
              <button>进入主题</button>
              <button onClick={() => setShowPreview(false)}>关闭</button>
            </div>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: issueData }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default PreviewComponent
