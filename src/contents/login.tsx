import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://*.yzrdm.cdleadus.com/login*", "*://*.192.168.1.168/login*"],
  css: ["../styles/login.scss"],
  all_frames: true
}

function appendRegisterLink() {
  const loginForm = $("#login-form form")
  if (loginForm.length) {
    const registerLink = $(
      `
      <div>
        <a class="register" href="/account/register">注册</a>
        <a class="lost_password" href="/account/lost_password">忘记密码</a>
      </div>
      `
    )
    loginForm.append(registerLink)
  }
}

const Login = () => {
  useEffect(() => {
    $(".lost_password").remove()

    const pop_top_img_url = chrome.runtime.getURL("assets/images/login-bg.png")
    $("#wrapper").css({
      "background-image": `url(${pop_top_img_url})`,
      "background-repeat": "no-repeat",
      "background-position": "center center",
      "background-size": "cover"
    })
    $("#username").attr("placeholder", "请输入用户名")
    $("#password").attr("placeholder", "请输入密码")

    // 在 #login-form 头部插入欢迎标题
    const welcomeTitle = $("<h1 style='margin-bottom: 20px;'>欢迎使用</h1>")
    $("#login-form").prepend(welcomeTitle)

    appendRegisterLink()
    $("#login-form").show()
  }, [])
}

export default Login
