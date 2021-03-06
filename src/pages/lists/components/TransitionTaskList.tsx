import React from "react"
import { useTransition, animated } from "react-spring"
import { noopTemplate as css } from "lib/utils"

import { List } from "@material-ui/core"
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd"
import { useTheme } from "theme"

import Task, { TaskProps } from "./Task"

const MAX_HEIGHT = 98

type TaskItem = Pick<TaskProps, "id" | "title" | "complete" | "notes">

type TransitionTaskListProps = {
  tasks: TaskItem[]
  onDragEnd: OnDragEndResponder
} & Pick<
  TaskProps,
  | "onSwipeLeft"
  | "onSwipeRight"
  | "swipeLeftIcon"
  | "swipeRightIcon"
  | "onSelectTask"
  | "onItemClick"
>

const TransitionTaskList = ({
  tasks,
  onDragEnd,
  ...taskProps
}: TransitionTaskListProps) => {
  const theme = useTheme()
  const [immediate, setImmediate] = React.useState(true)

  React.useEffect(() => {
    setImmediate(false)
  })

  const transitions = useTransition(tasks, (task) => task.id, {
    immediate,
    config: {
      mass: 1,
      tension: 240,
      // tension: 80,
      friction: 24,
      clamp: true,
      precision: 0.1,
    },
    from: { maxHeight: 0, opacity: 0 },
    enter: (item: any) => async (next: any) => {
      await next({ opacity: 1 })
      await next({ maxHeight: MAX_HEIGHT })
    },
    leave: (item: any) => async (next: any) => {
      await next({ opacity: 0 })
      await next({ maxHeight: -41 })
    },
  } as any)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="dropzone">
        {(provided) => (
          <List
            {...provided.droppableProps}
            innerRef={provided.innerRef}
            className="p-0"
            style={{ background: theme.backgroundColor }}
          >
            {transitions.map(({ item: task, key, props }, index) => (
              <Draggable key={key} draggableId={task.id} index={index}>
                {(provided) => (
                  <animated.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...props,
                      ...provided.draggableProps.style,
                      transform: provided.draggableProps.style?.transform
                        ? provided.draggableProps.style.transform.replace(
                            /-?\d*\.?\d*px,/,
                            "0px,",
                          )
                        : undefined,
                    }}
                    css={css`
                      overflow: hidden;
                    `}
                  >
                    <Task
                      IconProps={provided.dragHandleProps}
                      backgroundColor={theme.backgroundColor}
                      id={task.id}
                      complete={task.complete}
                      title={task.title}
                      notes={task.notes}
                      {...taskProps}
                    />
                  </animated.div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TransitionTaskList
