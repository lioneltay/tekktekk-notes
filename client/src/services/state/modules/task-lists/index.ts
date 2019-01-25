import { createReducer } from "lib/rxstate"
import { State, state_s as all_state_s } from "services/state"
import { createDispatcher } from "services/state/tools"
import { firestore, dataWithId } from "services/firebase"
import { map, switchMap, withLatestFrom } from "rxjs/operators"

import * as api from "./api"
import { from } from "rxjs"

export const addTaskList = createDispatcher(api.addTaskList)

export const removeTaskList = createDispatcher(api.removeTaskList)

export const editTaskList = createDispatcher(api.editTaskList)

export const createDefaultTaskList = createDispatcher(api.createDefaultTaskList)

export const getTaskLists = createDispatcher(api.getTaskLists)

export const updateCurrentTaskListTaskCount = createDispatcher(
  () => (state: State) => {
    const { selected_task_list_id, tasks } = state

    if (!tasks) {
      throw Error("No lists")
    }

    if (!selected_task_list_id) {
      throw Error("No selected task list")
    }

    return editTaskList({
      list_id: selected_task_list_id,
      list_data: { number_of_tasks: tasks.length },
    })
  },
)

export const setPrimaryTaskList = createDispatcher(api.setPrimaryTaskList)

export const reducer_s = createReducer<State>([
  addTaskList.pipe(
    switchMap(val => from(val)),
    map(list => {
      if (list.primary) {
        api.setPrimaryTaskList({
          user_id: list.user_id,
          task_list_id: list.id,
        })
      }

      return (state: State) => state
    }),
  ),
])
