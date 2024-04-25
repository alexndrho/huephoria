import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import fs from 'fs';

let testEnv: RulesTestEnvironment;

describe('Palettes collection', async () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-palettes-collection-rules-test',
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
  it('Should allow user create palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(
      db
        .collection('palettes')
        .doc('palette_abc')
        .set({
          uid: 'user_abc',
          title: 'palette_abc',
          description: 'description_abc',
          isCreator: true,
          colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
          tags: ['tag1', 'tag2'],
          createdAt: new Date(),
        })
    );
  });

  it('Should not allow user create invalid palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(
      db
        .collection('palettes')
        .doc('palette_abc')
        .set({
          uid: 'user_abc',
          title: 'palette_abc',
          description: 'description_abc',
          isCreator: true,
          colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
          tags: ['tag1', 'tag2'],
        })
    );
  });

  it('Should not allow user create palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db
        .collection('palettes')
        .doc('palette_abc')
        .set({
          uid: 'user_abc',
          title: 'palette_abc',
          description: 'description_abc',
          isCreator: true,
          colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
          tags: ['tag1', 'tag2'],
          createdAt: new Date(),
        })
    );
  });

  it('Should not allow user create palette for other user', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(
      db
        .collection('palettes')
        .doc('palette_xyz')
        .set({
          uid: 'user_xyz',
          title: 'palette_xyz',
          description: 'description_xyz',
          isCreator: true,
          colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
          tags: ['tag1', 'tag2'],
          createdAt: new Date(),
        })
    );
  });

  // read
  it('Should allow unauthenticated user read palettes collection', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(db.collection('palettes').get());
  });

  it('Should allow user read its palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('palettes').doc('palette_abc').get());
  });

  it('Should allow user read palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(db.collection('palettes').doc('palette_abc').get());
  });

  it('Should allow user read other user palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(db.collection('palettes').doc('palette_xyz').get());
  });

  // update
  it('Should allow user update its palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    db.collection('palettes')
      .doc('palette_abc')
      .set({
        uid: 'user_abc',
        title: 'palette_abc',
        description: 'description_abc',
        isCreator: true,
        colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
        tags: ['tag1', 'tag2'],
        createdAt: new Date(),
      });

    await assertSucceeds(
      db.collection('palettes').doc('palette_abc').update({
        title: 'palette_abc_updated',
      })
    );
  });

  it('Should not allow user update palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.collection('palettes').doc('palette_abc').update({
        title: 'palette_abc_updated',
      })
    );
  });

  it('Should not allow user update other user palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(
      db.collection('palettes').doc('palette_xyz').update({
        title: 'palette_xyz_updated',
      })
    );
  });

  // delete
  it('Should allow user delete its palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    db.collection('palettes')
      .doc('palette_abc')
      .set({
        uid: 'user_abc',
        title: 'palette_abc',
        description: 'description_abc',
        isCreator: true,
        colors: ['#000000', '#01F000', '#aBcDeF', '#123456'],
        tags: ['tag1', 'tag2'],
        createdAt: new Date(),
      });

    await assertSucceeds(db.collection('palettes').doc('palette_abc').delete());
  });

  it('Should not allow user delete palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('palettes').doc('palette_abc').delete());
  });

  it('Should not allow user delete other user palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertFails(db.collection('palettes').doc('palette_xyz').delete());
  });
});

describe('Palettes collection - Likes subcollection', async () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-palettes-collection-rules-test',
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
  it('Should allow user likes palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(
      db
        .collection('palettes')
        .doc('palette_abc')
        .collection('likes')
        .doc('user_abc')
        .set({
          createdAt: new Date(),
        })
    );
  });

  it('Should not allow user likes palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db
        .collection('palettes')
        .doc('palette_abc')
        .collection('likes')
        .doc('user_abc')
        .set({
          createdAt: new Date(),
        })
    );
  });

  // read
  it('Should allow user read likes authenticated', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    await assertSucceeds(
      db.collection('palettes').doc('palette_abc').collection('likes').get()
    );
  });

  it('Should allow user read likes unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      db
        .collection('palettes')
        .doc('palette_abc')
        .collection('likes')
        .doc('user_abc')
        .get()
    );
  });

  // delete
  it('Should allow user unlike palette', async () => {
    const db = testEnv.authenticatedContext('user_abc').firestore();
    db.collection('palettes')
      .doc('palette_abc')
      .collection('likes')
      .doc('user_abc')
      .set({
        createdAt: new Date(),
      });

    await assertSucceeds(
      db
        .collection('palettes')
        .doc('palette_abc')
        .collection('likes')
        .doc('user_abc')
        .delete()
    );
  });

  it('Should not allow user unlike palette unauthenticated', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db
        .collection('palettes')
        .doc('palette_abc')
        .collection('likes')
        .doc('user_abc')
        .delete()
    );
  });
});
