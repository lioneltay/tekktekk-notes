import React from "react"
import { noopTemplate as css } from "lib/utils"

import PlainModal, { PlainModalProps } from "./PlainModal"
import { Text, Button } from "lib/components"
import { IconButton, Divider } from "@material-ui/core"

import { ClearIcon } from "lib/icons"

export type ModalProps = Omit<PlainModalProps, "title"> & {
  title?: React.ReactNode
  actions?: { label: string; action?: (onClose: () => void) => void }[] | null
}

const Modal = ({ title, actions, children, onClose, ...rest }: ModalProps) => {
  return (
    <PlainModal
      onClose={onClose}
      css={css`
        width: 400px;
        max-width: 100vw;
      `}
      {...rest}
    >
      <div className="fj-sb fa-c fa-c pl-4">
        <Text variant="h6">{title}</Text>

        <IconButton onClick={onClose}>
          <ClearIcon />
        </IconButton>
      </div>

      <Divider />

      <div className="p-4">
        {children}

        {actions ? (
          <div className="mt-4 fj-e">
            {actions.map?.(({ label, action }) => (
              <Button
                key={label}
                onClick={() => action?.(onClose)}
                variant="outlined"
                color="primary"
                className="ml-3"
              >
                {label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </PlainModal>
  )
}

export default Modal
