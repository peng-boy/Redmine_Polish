// import redmineCss from "data-text:~/assets/redmine.css"
import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import "src/styles/tailwind.css" // 引入tailwind

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/*", "*://*.192.168.1.168/*"],
  css: ["../styles/common.css", "../styles/my-styles.scss"],
  all_frames: true
  // run_at: "document_start"
}

const RedminePlugin = () => {
  console.log("=============")

  return null
}

export default RedminePlugin
