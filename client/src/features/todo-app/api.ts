import { firestore, dataWithId } from "services/firebase"
import { Task, ID } from "./types"

export const addTask = async (
  task: Omit<Task, "id" | "created_at" | "updated_at" | "complete">,
): Promise<Task> => {
  return firestore
    .collection("tasks")
    .add({
      ...task,
      uid: task.uid || null,
      completed: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as Task
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

export const editTask = async (
  task_id: ID,
  task_data: Partial<Omit<Task, "id">>,
): Promise<Task> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .update({
      ...task_data,
      updated_at: Date.now(),
    })

  const edited_task = await firestore
    .collection("tasks")
    .doc(task_id)
    .get()
    .then(dataWithId)

  return edited_task as Task
}

export const removeTask = async (task_id: ID): Promise<ID> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .delete()
  return task_id
}
