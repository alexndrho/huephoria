import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import fs from 'fs';

let testEnv: RulesTestEnvironment;

describe('User collection', async () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-users-collection-rules-test',
      firestore: {
        host: 'localhost',
        port: 8080,
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  beforeEach(async () => testEnv.clearFirestore());
  afterAll(async () => testEnv.cleanup());

  // create
  it('Should allow user create its data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(
      db.collection('users').doc('user_abc').set({
        username: 'username_abc',
      })
    );
  });

  it('Should not allow user create data unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.collection('users').doc('user_abc').set({
        username: 'username_abc',
      })
    );
  });

  it('Should not allow user create other user data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(
      db.collection('users').doc('user_xyz').set({
        username: 'username_xyz',
      })
    );
  });

  // read
  it('Should allow user read users collection', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('users').get());
  });

  it('Should allow user read its data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('users').doc('user_abc').get());
  });

  it('Should allow user read data unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(db.collection('users').doc('user_abc').get());
  });

  it('Should allow user read other user data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('users').doc('user_xyz').get());
  });

  //update
  it('Should allow user update its data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    db.collection('users').doc('user_abc').set({
      username: 'username_abc',
    });

    await assertSucceeds(
      db.collection('users').doc('user_abc').update({
        username: 'username_abc_updated',
      })
    );
  });

  it('Should not allow user update data unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.collection('users').doc('user_abc').update({
        username: 'username_abc_updated',
      })
    );
  });

  it('Should not allow user update other user data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(
      db.collection('users').doc('user_xyz').update({
        username: 'username_xyz_updated',
      })
    );
  });

  //delete
  it('Should allow user delete its data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('users').doc('user_abc').delete());
  });

  it('Should not allow user delete data unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user_abc').delete());
  });

  it('Should not allow user delete other user data', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(db.collection('users').doc('user_xyz').delete());
  });
});
