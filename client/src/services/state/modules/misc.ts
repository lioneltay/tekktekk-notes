import { createReducer } from "lib/rxstate"
import { firestore, dataWithId } from "services/firebase"

import { Observable } from "rxjs"
import { map, switchMap } from "rxjs/operators"

import { user$ } from "./auth"
import { State } from "services/state"
import { createDispatcher } from "services/state/tools"

const createCurrentListsStream = (user_id: ID | null) =>
  new Observable<TaskList[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("task_lists")
      .where("user_id", "==", user_id)
      .onSnapshot(snapshot => {
        const lists: TaskList[] = snapshot.docs.map(dataWithId) as TaskList[]
        observer.next(lists)
      })
  })

export const toggleDrawer = createDispatcher()
export const setTouchEnabled = createDispatcher((enabled: boolean) => enabled)
export const selectTaskList = createDispatcher(
  (task_list_id: ID) => task_list_id,
)

const lists_s = user$.pipe(
  switchMap(user => createCurrentListsStream(user ? user.uid : null)),
)

export const reducer_s = createReducer<State>([
  lists_s.pipe(map(task_lists => (state: State) => ({ ...state, task_lists }))),

  setTouchEnabled.pipe(
    map(touch_screen => (state: State) => ({ ...state, touch_screen })),
  ),

  toggleDrawer.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: !state.show_drawer,
    })),
  ),

  selectTaskList.pipe(
    map(selected_task_list_id => (state: State) => ({
      ...state,
      selected_task_list_id,
      show_drawer: false,
    })),
  ),
])
