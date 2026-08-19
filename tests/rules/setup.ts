import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
  type RulesTestContext,
} from '@firebase/rules-unit-testing';
import { ADMIN_EMAILS } from '../../src/lib/admin';

const PROJECT_ID = 'frangc-test';
const rulesPath = resolve(process.cwd(), 'firestore.rules');

export async function makeEnv(): Promise<RulesTestEnvironment> {
  const env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(rulesPath, 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
  return env;
}

export function signedIn(
  env: RulesTestEnvironment,
  uid: string,
  email: string,
): RulesTestContext {
  return env.authenticatedContext(uid, { email });
}

export function admin(env: RulesTestEnvironment): RulesTestContext {
  return env.authenticatedContext('admin-uid', { email: ADMIN_EMAILS[0] });
}

export function anonymous(env: RulesTestEnvironment): RulesTestContext {
  return env.unauthenticatedContext();
}

export async function seed(
  env: RulesTestEnvironment,
  fn: (ctx: RulesTestContext) => Promise<void>,
): Promise<void> {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await fn(ctx);
  });
}
