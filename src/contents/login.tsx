import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/login*", "*://*.192.168.1.168/login*"],
  css: ["../styles/login.scss"],
  all_frames: true
}

const Login = () => {
  useEffect(() => {
    const loginForm = $("#login-form form")
    if (loginForm.length) {
      const registerLink = $(
        '<a class="register" href="/account/register">注册</a>'
      )
      loginForm.append(registerLink)
    }
  }, [])
}

export default Login
