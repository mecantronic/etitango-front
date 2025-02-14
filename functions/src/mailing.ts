import { Change, EventContext } from 'firebase-functions';
import * as functions from 'firebase-functions';
import { db } from './index';
import { Signup, SignupFirestore, SignupStatus } from '../../src/shared/signup';
import { firestore } from 'firebase-admin';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { validateUserIsSuperAdmin } from './validators';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

exports.retryFailedMails = functions.https.onCall(
  async (etiEventId: string, context: CallableContext) => {
    await validateUserIsSuperAdmin(context);
    const mailRef = db.collection('mail');

    // Query for documents with delivery.state = 'ERROR'
    const snapshot = await mailRef
      .where('delivery.state', '==', 'ERROR')
      .where('delivery.startTime', '>=', new Date(1694110611574))
      .get();

    // Array to store update promises
    const updatePromises: any[] = [];

    snapshot.forEach((doc) => {
      // For each document found, update the delivery.state to 'RETRY'
      const updatePromise = doc.ref.update({
        'delivery.state': 'RETRY'
      });
      updatePromises.push(updatePromise);
    });

    // Wait for all updates to finish
    await Promise.all(updatePromises);

    // Send a response
    return `Updated ${updatePromises.length} documents to state 'RETRY'.`;
  }
);

exports.onUpdateSignup = functions.firestore
  .document('signups/{signupId}')
  // @ts-ignore
  .onUpdate(async (change: Change<DocumentSnapshot<Signup>>, context: EventContext) => {
    const signupId = context.params.signupId;
    console.info(`onUpdate triggered for ${signupId}`);
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) return;
    if (before.status !== after.status) {
      const ref = change.after.ref;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref.set({ lastModifiedAt: new Date() }, { merge: true });
      const mailRef = db.collection('mail');
      await mailRef.add({
        to: [after.email],
        template: {
          name: after.status,
          data: {
            userName: after.nameFirst
          }
        },
        signupId
      });
    }
  });

exports.onCreateSignup = functions.firestore
  .document('signups/{signupId}')
  // @ts-ignore
  .onCreate(async (snapshot: QueryDocumentSnapshot<SignupFirestore>, context: EventContext) => {
    console.info(`OnCreate triggered for signups/${context.params.signupId}`);
    await snapshot.ref.set(
      {
        status: SignupStatus.WAITLIST,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lastModifiedAt: new Date()
      },
      { merge: true }
    );
  });
