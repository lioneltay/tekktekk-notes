import React, { useEffect } from "react"
import styled from "styled-components"

import Header from "./components/Header"
import Drawer from "./components/Drawer"
import TaskAdder from "./components/TaskAdder"
import MainView from "./components/MainView"
import WarningFooter from "./components/WarningFooter"

import { background_color } from "../constants"

import { firebase } from "services/firebase"
import { Observable } from "rxjs"

import { connect, setTouchEnabled, selectTaskList } from "services/state"
import { showWarningFooter } from "services/state/modules/warning-footer"

import {
  getTaskLists,
  createDefaultTaskList,
} from "services/state/modules/task-lists"
import { ConnectedDispatcher } from "lib/rxstate"

const PageContainer = styled.div`
  background: ${background_color};
  min-height: 100vh;
`

const StickySection = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`

const user$ = new Observable<User | null>(observer => {
  return firebase.auth().onAuthStateChanged(user => observer.next(user))
})

type Props = {
  setTouchEnabled: (enabled: boolean) => void
  showWarningFooter: (show: boolean) => void
  selectTaskList: (id: ID) => void
  getTaskLists: ConnectedDispatcher<typeof getTaskLists>
  createDefaultTaskList: ConnectedDispatcher<typeof createDefaultTaskList>
}

const Root: React.FunctionComponent<Props> = ({
  setTouchEnabled,
  showWarningFooter,
  selectTaskList,
  getTaskLists,
  createDefaultTaskList,
}) => {
  useEffect(
    () => {
      const subscription = user$.subscribe(async user =>
        showWarningFooter(!user),
      )
      return () => subscription.unsubscribe()
    },
    [user$],
  )

  useEffect(
    () => {
      const subscription = user$.subscribe(async user => {
        const user_id = user ? user.uid : null
        const lists = await getTaskLists(user_id)
        let primary_list = lists.find(list => list.primary)
        if (!primary_list) {
          primary_list = await createDefaultTaskList(user_id)
        }
        selectTaskList(primary_list.id)
      })
      return () => subscription.unsubscribe()
    },
    [user$],
  )

  useEffect(() => {
    const handler = () => setTouchEnabled(true)
    window.addEventListener("touchstart", handler)
    return () => window.removeEventListener("touchstart", handler)
  })

  return (
    <PageContainer>
      <StickySection>
        <Header />
        <TaskAdder />
      </StickySection>
      <Drawer />
      <MainView />
      <WarningFooter />
    </PageContainer>
  )
}

export default connect(
  null,
  {
    setTouchEnabled,
    showWarningFooter,
    selectTaskList,
    createDefaultTaskList,
    getTaskLists,
  },
)(Root)
