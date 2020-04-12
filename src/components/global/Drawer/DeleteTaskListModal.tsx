import React from "react"

import Modal from "lib/components/Modal"
import { Text } from "lib/components"
import Button from "@material-ui/core/Button"

type Props = {
  open: boolean
  onClose: () => void
  onConfirmDelete: () => void
  taskListName?: string
}

const DeleteTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirmDelete,
  taskListName = "list",
}) => {
  return (
    <Modal
      style={{ width: 300, maxWidth: "100%" }}
      open={open}
      onClose={onClose}
      title={`Delete ${taskListName}`}
      actions={
        <Button variant="outlined" color="primary" onClick={onConfirmDelete}>
          Confirm
        </Button>
      }
    >
      <Text variant="body2">Are you sure you want to delete this list?</Text>
    </Modal>
  )
}

export default DeleteTaskListModal