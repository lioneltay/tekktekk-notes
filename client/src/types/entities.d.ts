import firebase from "firebase"
import { Theme as _Theme } from "theme"

declare global {
  export type Theme = _Theme

  export type ID = string

  export type User = firebase.User

  export type Settings = {
    id: ID
    user_id: ID | null
    dark: boolean
    created_at: number
    updated_at: number
  }

  export type RawTaskList = {
    id: ID
    name: string
    createdAt: number
    updatedAt: number | null
    numberOfCompleteTasks: number
    numberOfIncompleteTasks: number
    primary: boolean
    userId: ID
  }

  export type TaskList = {
    id: ID
    userId: ID
    name: string
    createdAt: Date
    updatedAt: Date | null
    numberOfCompleteTasks: number
    numberOfIncompleteTasks: number
    primary: boolean
  }

  export type Task = {
    id: ID
    listId: ID
    userId: ID | null
    archived: boolean
    complete: boolean
    createdAt: Date
    updatedAt: Date | null
    notes: string
    title: string
  }
}

export {}
