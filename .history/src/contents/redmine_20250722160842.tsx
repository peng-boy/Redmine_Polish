import redmineCss from "data-text:~/assets/redmine.css"
// import cssText from "data-text:~/assets/tailwind.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import $ from "jquery";
import "data-text:~/assets/tailwind.css"


export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = redmineCss
  return style
}

const RedminePlugin = () => {
  const [data, setData] = useState("")

  function setDomID_TopMenu() {
    $("#top-menu").css({height: '3em', padding:'0.5em'});
    $("#top-menu").addClass("flex justify-between items-center")
  }

  useEffect(() => {
    // const link = document.createElement("link");
    // link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    // link.rel = "stylesheet";
    // document.head.appendChild(link);

    setDomID_TopMenu()
  }, [])


  return (
    <div className="flex flex-col items-center justify-center h-screen w-[500px] bg-fff bg-black">
      <div className="text-2xl font-bold">Hello World</div>
    </div>
  )
}

export default RedminePlugin
