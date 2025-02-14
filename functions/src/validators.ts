import * as functions from "firebase-functions";
import {db} from "./index";

export function validateUserIsLoggedIn(context: { auth?: { uid: string } }) {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called with a logged in user"
    );
  }
}

export async function validateUserIsSuperAdmin(context: { auth?: { uid: string } }) {
  validateUserIsLoggedIn(context);
  const ref = db.collection("users").doc(context.auth!.uid);
  const user = await ref.get();
  if (!user.exists || !user.data()?.roles["superadmin"]) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called with a logged in user, with superadmin role on the DB"
    );
  }
}
