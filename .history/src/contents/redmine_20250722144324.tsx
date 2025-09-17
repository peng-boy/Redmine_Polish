import redmineCss from "data-text:~/assets/redmine.css"
import cssText from "data-text:~/assets/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import $ from "jquery";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  //   matches: ["<all_urls>"],
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/projects/*"],
  all_frames: true
}

const myMenu = () => {
  const li = document.createElement("li")
  const a = document.createElement("a")
  li.appendChild( a)
  return li
}

const RedminePlugin = () => {
  const [data, setData] = useState("")

  function setDomID_TopMenu() {
    $("#top-menu").css({height: '3em'});
    $("#top-menu").addClass("flex items-center")
  }

  useEffect(() => {
    console.log("百度插件初始化")
    const TopMenu = document.querySelector("#top-menu > ul")
    TopMenu?.appendChild(myMenu())
    setDomID_TopMenu()
  }, [])

  const handleClick = () => {
    console.log("百度插件点击事件")
  }

  return (
    <></>
  )
}

export default RedminePlugin
