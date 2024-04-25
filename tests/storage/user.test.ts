import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import fs from 'fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let testEnv: RulesTestEnvironment;

describe('demo-users-storage-rules-test', async () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-users-storage-rules-test',
      storage: {
        host: 'localhost',
        port: 9199,
        rules: fs.readFileSync('./storage.rules', 'utf8'),
      },
    });
  });
  beforeEach(async () => await testEnv.clearStorage());
  afterAll(async () => await testEnv.cleanup());

  it('Should allow user upload its avatar', async () => {
    const storage = testEnv.authenticatedContext('user_abc').storage();
    const mockImageFile = new File(['(⌐□_□)'], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    await assertSucceeds(
      storage.ref('users/user_abc/avatar').put(mockImageFile).then()
    );
  });

  it('Should not allow user upload invalid avatar type', async () => {
    const storage = testEnv.authenticatedContext('user_abc').storage();
    const mockImageFile = new File(['(⌐□_□)'], 'avatar.html', {
      type: 'text/html',
    });

    await assertFails(
      storage.ref('users/user_abc/avatar').put(mockImageFile).then()
    );
  });

  it('Should not allow user upload avatar larger than 2MB', async () => {
    const storage = testEnv.authenticatedContext('user_abc').storage();
    const mockImageFile = new File(
      ['(⌐□_□)'.repeat(1024 * 1024)],
      'avatar.jpg',
      {
        type: 'image/jpeg',
      }
    );

    await assertFails(
      storage.ref('users/user_abc/avatar').put(mockImageFile).then()
    );
  });

  it('Should not allow user upload avatar without authentication', async () => {
    const storage = testEnv.unauthenticatedContext().storage();
    const mockImageFile = new File(['(⌐□_□)'], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    await assertFails(
      storage.ref('users/user_abc/avatar').put(mockImageFile).then()
    );
  });

  it('Should not allow user upload avatar to other user', async () => {
    const storage = testEnv.authenticatedContext('user_abc').storage();
    const mockImageFile = new File(['(⌐□_□)'], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    await assertFails(
      storage.ref('users/user_xyz/avatar').put(mockImageFile).then()
    );
  });
});
