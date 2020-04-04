import * as functions from "firebase-functions"
import axios from "axios"
import { githubAccessToken } from "../config"


export const sendFeedback = functions.https.onCall(
  async (data: CallableFunction.SendFeedbackData, context) => {
    if (!data.subject) {
      return
    }

    const response = await axios.post(
      `https://api.github.com/repos/lioneltay/onyamind/issues?access_token=${githubAccessToken}`,
      {
        title: data.subject,
        body: data.description || "",
        milestone: 1,
        labels: ["feedback"],
      },
    )

    return response.data
  },
)
