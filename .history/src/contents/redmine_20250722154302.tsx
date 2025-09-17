import redmineCss from "data-text:~/assets/redmine.css"
import cssText from "data-text:~/assets/tailwind.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import $ from "jquery";

export const getStyle = () => {

  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement

  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  //   matches: ["<all_urls>"],
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
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
    $("#top-menu").css({height: '3em', padding:'0.5em'});
    $("#top-menu").addClass("flex justify-between items-center")
  }

  useEffect(() => {
    // const link = document.createElement("link");
    // link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    // link.rel = "stylesheet";
    // document.head.appendChild(link);

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
