import { PopupStle } from "assets/css/poppup"
import { useEffect, useState } from "react"

import { addTask, deleteTask, getTaskList, updateTask } from "~api"
import HeadName from "~components/HeadName"
import List from "~components/List"
import NewTask from "~components/NewTask"
import Tabs from "~components/Tabs"

import "assets/css/common.css"
import "@/assets/tailwind.css"

export interface ITask {
  id: number
  content: string
  status: boolean
  time: string
  title: string
}

enum TABS {
  ALL = 0, // 全部
  UNFINISHED = 1, // 完成
  FINISHED = 2 // 未完成
}

function IndexPopup() {
  const { currentTab, setActiveTab } = useTabsChange()
  const { creatTaskHandle, taskList } = useCreateTask(currentTab)
  return (
    <div className="flex flex-col items-center justify-center h-screen w-[500px]">
      <div className="text-2xl font-bold">Hello World</div>
    </div>
  )
  return (
    <PopupStle>
      <HeadName />
      <NewTask newTask={creatTaskHandle} />
      <List taskData={taskList} />
      <Tabs setActiveTab={setActiveTab} />
    </PopupStle>
  )
}

function useCreateTask(currentTab: number) {
  const [taskData, setTaskData] = useState<ITask[]>([
    {
      id: 0,
      title: `任务0`,
      content: `任务0,任务详情`,
      status: true,
      time: "2022-03-01"
    },
    {
      id: 1,
      title: `任务1`,
      content: `任务1,任务详情`,
      status: false,
      time: "2022-03-01"
    }
  ])

  const [taskList, setTaskList] = useState<ITask[]>(taskData)

  useEffect(() => {
    getTaskList().then((res) => {
      setTaskData(res.data)
    })
  }, [])

  useEffect(() => {
    switch (currentTab) {
      case TABS.ALL:
        setTaskList(taskData)
        break
      case TABS.FINISHED:
        setTaskList(taskData.filter((item) => !item.status))
        break
      case TABS.UNFINISHED:
        setTaskList(taskData.filter((item) => item.status))
        break
    }
  }, [currentTab, taskData])

  const creatTaskHandle = (newTask) => {
    // 创建任务
    console.log("新任务", newTask)
    const task = {
      id: 2,
      title: newTask,
      content: `任务2,任务详情`,
      status: false,
      time: "2022-03-01"
    }
    // 获取最新的任务 调接口 => 赋值
    setTaskData((old) => [...old, task])
  }
  return {
    creatTaskHandle,
    taskList
  }
}

function useTabsChange() {
  const [currentTab, setCurrentTab] = useState(0)
  const setActiveTab = (index: number) => {
    setCurrentTab(index)
  }
  return {
    currentTab,
    setActiveTab
  }
}

export default IndexPopup
