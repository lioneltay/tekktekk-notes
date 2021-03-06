import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import * as api from "services/api"

const setUser = (user: User | null) =>
  ({ type: "SET_USER", payload: { user } } as const)

// const signinPending = () => ({ type: "SIGNIN|PENDING" } as const)
// const signinFailure = () => ({ type: "SIGNIN|FAILURE" } as const)
// const signinSuccess = (user: User) =>
//   ({ type: "SIGNIN|SUCCESS", payload: { user } } as const)
// const signin = () => (dispatch: Dispatch) => {
//   dispatch(signinPending())
//   return api
//     .linkAnonymousAccountWithGoogle()
//     .then((user) => dispatch(signinSuccess(user)))
//     .catch((e) => {
//       dispatch(signinFailure())
//       throw e
//     })
// }

// const signoutPending = () => ({ type: "SIGNOUT|PENDING" } as const)
// const signoutFailure = () => ({ type: "SIGNOUT|FAILURE" } as const)
// const signoutSuccess = () => ({ type: "SIGNOUT|SUCCESS" } as const)
// const signout = () => (dispatch: Dispatch) => {
//   dispatch(signoutPending())
//   return api
//     .signOut()
//     .then(() => dispatch(signoutSuccess()))
//     .catch((e) => {
//       dispatch(signoutFailure())
//       throw e
//     })
// }

const Action = {
  setUser,

  // signinPending,
  // signinFailure,
  // signinSuccess,

  // signoutPending,
  // signoutFailure,
  // signoutSuccess,
}

export const actionCreators = {
  setUser,
  // signin,
  // signout,
}

export type Action = ActionsUnion<typeof Action>
export type ActionType = ActionTypesUnion<typeof Action>

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}
