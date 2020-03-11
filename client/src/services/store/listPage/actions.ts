import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { State } from "services/store/listPage/reducer"
import * as selectors from "services/store/listPage/selectors"
import * as api from "services/api"

type GetState = () => State

const setTaskLists = (taskLists: TaskList[]) =>
  ({ type: "SET_TASK_LISTS", payload: { taskLists } } as const)

const setTasks = (tasks: Task[]) => ({ type: "SET_TASKS", tasks } as const)

const toggleTaskSelection = (taskId: ID) =>
  ({ type: "TOGGLE_TASK_SELECTION", taskId } as const)

const selectAllTasks = () => ({ type: "SELECT_ALL_TASKS" } as const)

const deselectAllTasks = () => ({ type: "DESELECT_ALL_TASKS" } as const)

const setUser = (user: User) =>
  ({ type: "SET_USER", payload: { user } } as const)

const selectTaskList = (listId: ID | null) =>
  ({
    type: "SELECT_TASK_LIST",
    payload: { listId },
  } as const)

const setEditingTask = (taskId: ID | null) =>
  ({
    type: "SET_EDITING_TASK",
    payload: { taskId },
  } as const)

const completeSelectedTasksPending = () =>
  ({ type: "COMPLETE_SELECTED_TASKS|Pending" } as const)
const completeSelectedTasksFailure = () =>
  ({ type: "COMPLETE_SELECTED_TASKS|FAILURE" } as const)
const completeSelectedTasksSuccess = () =>
  ({ type: "COMPLETE_SELECTED_TASKS|SUCCESS" } as const)
const completeSelectedTasks = async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(completeSelectedTasksPending())
  const selectedTasks = selectors.selectedTasks(getState())
  return api
    .editTasks(selectedTasks.map(task => ({ ...task, complete: true })))
    .then(() => dispatch(completeSelectedTasksSuccess()))
    .catch(e => {
      dispatch(completeSelectedTasksFailure())
      throw e
    })
}

const decompleteSelectedTasksPending = () =>
  ({ type: "DECOMPLETE_SELECTED_TASKS" } as const)
const decompleteSelectedTasksFailure = () =>
  ({ type: "DECOMPLETE_SELECTED_TASKS" } as const)
const decompleteSelectedTasksSuccess = () =>
  ({ type: "DECOMPLETE_SELECTED_TASKS" } as const)
const decompleteSelectedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(decompleteSelectedTasksPending())
  const selectedTasks = selectors.selectedTasks(getState())
  return api
    .editTasks(selectedTasks.map(task => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteSelectedTasksSuccess()))
    .catch(e => {
      dispatch(decompleteSelectedTasksFailure())
      throw e
    })
}

const decompleteCompletedTasksPending = () =>
  ({ type: "DECOMPLETE_COMPLETED_TASKS|PENDING" } as const)
const decompleteCompletedTasksFailure = () =>
  ({ type: "DECOMPLETE_COMPLETED_TASKS|FAILURE" } as const)
const decompleteCompletedTasksSuccess = () =>
  ({ type: "DECOMPLETE_COMPLETED_TASKS|SUCCESS" } as const)
const decompleteCompletedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(decompleteCompletedTasksPending())
  const selectedTasks = selectors.selectedTasks(getState())
  return api
    .editTasks(selectedTasks.map(task => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteCompletedTasksSuccess()))
    .catch(e => {
      dispatch(decompleteCompletedTasksFailure())
      throw e
    })
}

const deleteCompletedTasksPending = () =>
  ({ type: "DELETE_COMPLETED_TASKS|PENDING" } as const)
const deleteCompletedTasksFailure = () =>
  ({ type: "DELETE_COMPLETED_TASKS|FAILURE" } as const)
const deleteCompletedTasksSuccess = () =>
  ({ type: "DELETE_COMPLETED_TASKS|SUCCESS" } as const)
const deleteCompletedTasks = () => (dispatch: Dispatch, getState: GetState) => {
  dispatch(deleteCompletedTasksPending())
  const tasks = selectors.completedTasks(getState())
  return api
    .deleteTasks(tasks.map(task => task.id))
    .then(res => dispatch(deleteCompletedTasksSuccess()))
    .catch(e => {
      dispatch(deleteCompletedTasksFailure())
      throw e
    })
}

const createTaskPending = () => ({ type: "CREATE_TASK|PENDING" } as const)
const createTaskFailure = () => ({ type: "CREATE_TASK|FAILURE" } as const)
const createTaskSuccess = () => ({ type: "CREATE_TASK|SUCCESS" } as const)
type CreateTaskInput = {
  userId: ID
  listId: ID
  title?: string
  notes?: string
}
const createTask = ({
  title = "",
  notes = "",
  userId,
  listId,
}: CreateTaskInput) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(createTaskPending())
  return api
    .createTask({ listId, userId, title, notes })
    .then(res => dispatch(createTaskSuccess()))
    .catch(e => {
      dispatch(createTaskFailure())
      throw e
    })
}

type EditTaskInput = {
  taskId: ID
  title?: string
  notes?: string
}

const editTaskPending = () => ({ type: "EDIT_TASK|PENDING" } as const)
const editTaskFailure = () => ({ type: "EDIT_TASK|FAILURE" } as const)
const editTaskSuccess = () => ({ type: "EDIT_TASK|SUCCESS" } as const)
const editTask = ({ taskId, title, notes }: EditTaskInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(editTaskPending())
  return api
    .editTask({ taskId, data: { title, notes } })
    .then(res => dispatch(editTaskSuccess()))
    .catch(e => {
      dispatch(editTaskFailure())
      throw e
    })
}

const deleteTaskPending = () => ({ type: "DELETE_TASK|PENDING" } as const)
const deleteTaskFailure = () => ({ type: "DELETE_TASK|FAILURE" } as const)
const deleteTaskSuccess = () => ({ type: "DELETE_TASK|SUCCESS" } as const)
const deleteTask = (taskId: ID) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(deleteTaskPending())
  return api
    .deleteTask(taskId)
    .then(res => dispatch(deleteTaskSuccess()))
    .catch(e => {
      dispatch(deleteTaskFailure())
      throw e
    })
}

const archiveTaskPending = () => ({ type: "ARCHIVE_TASK|PENDING" } as const)
const archiveTaskFailure = () => ({ type: "ARCHIVE_TASK|FAILURE" } as const)
const archiveTaskSuccess = () => ({ type: "ARCHIVE_TASK|SUCCESS" } as const)
const archiveTask = (taskId: ID) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(archiveTaskPending())
  return api
    .editTask({ taskId, data: { archived: true } })
    .then(res => dispatch(archiveTaskSuccess()))
    .catch(e => {
      dispatch(archiveTaskFailure())
      throw e
    })
}

const unarchiveTaskPending = () => ({ type: "UNARCHIVE_TASK|PENDING" } as const)
const unarchiveTaskFailure = () => ({ type: "UNARCHIVE_TASK|FAILURE" } as const)
const unarchiveTaskSuccess = () => ({ type: "UNARCHIVE_TASK|SUCCESS" } as const)
const unarchiveTask = (taskId: ID) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(unarchiveTaskPending())
  return api
    .editTask({ taskId, data: { archived: false } })
    .then(res => dispatch(unarchiveTaskSuccess()))
    .catch(e => {
      dispatch(unarchiveTaskFailure())
      throw e
    })
}

const emptyTrashPending = () => ({ type: "EMPTY_TRASH|PENDING" } as const)
const emptyTrashFailure = () => ({ type: "EMPTY_TRASH|FAILURE" } as const)
const emptyTrashSuccess = () => ({ type: "EMPTY_TRASH|SUCCESS" } as const)
const emptyTrash = () => (dispatch: Dispatch, getState: GetState) => {
  dispatch(emptyTrashPending())
  const tasks = selectors.trashTasks(getState())
  return api
    .deleteTasks(tasks.map(task => task.id))
    .then(res => dispatch(emptyTrashSuccess()))
    .catch(e => {
      dispatch(emptyTrashFailure())
      throw e
    })
}

const completeTaskPending = () => ({ type: "COMPLETE_TASK|PENDING" } as const)
const completeTaskFailure = () => ({ type: "COMPLETE_TASK|FAILURE" } as const)
const completeTaskSuccess = () => ({ type: "COMPLETE_TASK|SUCCESS" } as const)
const completeTask = (taskId: ID) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(completeTaskPending())
  return api
    .editTask({ taskId, data: { complete: true } })
    .then(res => dispatch(completeTaskSuccess()))
    .catch(e => {
      dispatch(completeTaskFailure())
      throw e
    })
}

const decompleteTaskPending = () =>
  ({ type: "DECOMPLETE_TASK|PENDING" } as const)
const decompleteTaskFailure = () =>
  ({ type: "DECOMPLETE_TASK|FAILURE" } as const)
const decompleteTaskSuccess = () =>
  ({ type: "DECOMPLETE_TASK|SUCCESS" } as const)
const decompleteTask = (taskId: ID) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(decompleteTaskPending())
  return api
    .editTask({ taskId, data: { complete: false } })
    .then(res => dispatch(decompleteTaskSuccess()))
    .catch(e => {
      dispatch(decompleteTaskFailure())
      throw e
    })
}

const moveTaskPending = () => ({ type: "MOVE_TASK|PENDING" } as const)
const moveTaskFailure = () => ({ type: "MOVE_TASK|FAILURE" } as const)
const moveTaskSuccess = () => ({ type: "MOVE_TASK|SUCCESS" } as const)
type MoveTaskInput = {
  taskId: ID
  listId: ID
}
const moveTask = ({ taskId, listId }: MoveTaskInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(moveTaskPending())
  return api
    .editTask({ taskId, data: { listId } })
    .then(res => dispatch(moveTaskSuccess()))
    .catch(e => {
      dispatch(moveTaskFailure())
      throw e
    })
}

const createTaskListPending = () =>
  ({ type: "CREATE_TASK_LIST|PENDING" } as const)
const createTaskListFailure = () =>
  ({ type: "CREATE_TASK_LIST|FAILURE" } as const)
const createTaskListSuccess = () =>
  ({ type: "CREATE_TASK_LIST|SUCCESS" } as const)
type CreateTaskListInput = {
  userId: ID
  name: string
  primary?: boolean
}
const createTaskList = ({
  userId,
  primary = true,
  name,
}: CreateTaskListInput) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(createTaskListPending())
  return api
    .createTaskList({ userId, primary, name })
    .then(res => dispatch(createTaskListSuccess()))
    .catch(e => {
      dispatch(createTaskListFailure())
      throw e
    })
}

const editTaskListPending = () => ({ type: "EDIT_TASK_LIST|PENDING" } as const)
const editTaskListFailure = () => ({ type: "EDIT_TASK_LIST|FAILURE" } as const)
const editTaskListSuccess = () => ({ type: "EDIT_TASK_LIST|SUCCESS" } as const)
type EditTaskListInput = {
  taskListId: ID
  name: string
  primary?: boolean
}
const editTaskList = ({ name, primary, taskListId }: EditTaskListInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(editTaskListPending())
  return api
    .editTaskList({ taskListId, data: { name, primary } })
    .then(res => dispatch(editTaskListSuccess()))
    .catch(e => {
      dispatch(editTaskListFailure())
      throw e
    })
}

const deleteTaskListPending = () =>
  ({ type: "DELETE_TASK_LIST|PENDING" } as const)
const deleteTaskListFailure = () =>
  ({ type: "DELETE_TASK_LIST|FAILURE" } as const)
const deleteTaskListSuccess = () =>
  ({ type: "DELETE_TASK_LIST|SUCCESS" } as const)
const deleteTaskList = (listId: ID) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(deleteTaskListPending())
  return api
    .deleteTaskList(listId)
    .then(res => dispatch(deleteTaskListSuccess()))
    .catch(e => {
      dispatch(deleteTaskListFailure())
      throw e
    })
}

const Action = {
  setTaskLists,
  setTasks,
  toggleTaskSelection,
  selectAllTasks,
  deselectAllTasks,
  setUser,
  selectTaskList,
  setEditingTask,

  completeSelectedTasksPending,
  completeSelectedTasksFailure,
  completeSelectedTasksSuccess,

  decompleteCompletedTasksPending,
  decompleteCompletedTasksFailure,
  decompleteCompletedTasksSuccess,

  deleteCompletedTasksPending,
  deleteCompletedTasksFailure,
  deleteCompletedTasksSuccess,

  createTaskPending,
  createTaskFailure,
  createTaskSuccess,

  editTaskPending,
  editTaskFailure,
  editTaskSuccess,

  deleteTaskPending,
  deleteTaskFailure,
  deleteTaskSuccess,

  archiveTaskPending,
  archiveTaskFailure,
  archiveTaskSuccess,

  unarchiveTaskPending,
  unarchiveTaskFailure,
  unarchiveTaskSuccess,

  emptyTrashPending,
  emptyTrashFailure,
  emptyTrashSuccess,

  completeTaskPending,
  completeTaskFailure,
  completeTaskSuccess,

  decompleteTaskPending,
  decompleteTaskFailure,
  decompleteTaskSuccess,

  moveTaskPending,
  moveTaskFailure,
  moveTaskSuccess,

  createTaskListPending,
  createTaskListFailure,
  createTaskListSuccess,

  editTaskListPending,
  editTaskListFailure,
  editTaskListSuccess,

  deleteTaskListPending,
  deleteTaskListFailure,
  deleteTaskListSuccess,
}

export const actionCreators = {
  setTaskLists,
  setTasks,
  toggleTaskSelection,
  selectAllTasks,
  deselectAllTasks,
  selectTaskList,
  setEditingTask,
  setUser,
  completeSelectedTasks,
  decompleteSelectedTasks,
  decompleteCompletedTasks,
  deleteCompletedTasks,
  createTask,
  editTask,
  deleteTask,
  archiveTask,
  unarchiveTask,
  emptyTrash,
  completeTask,
  decompleteTask,
  moveTask,
  createTaskList,
  editTaskList,
  deleteTaskList,
}

export type Action = ActionsUnion<typeof Action>
export type ActionType = ActionTypesUnion<typeof Action>

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}