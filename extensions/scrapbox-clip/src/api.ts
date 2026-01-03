import { getProfile, importPages } from '@cosense/std/rest';
import { isErr, unwrapOk } from 'option-t/plain_result';
import type { GuestUser, MemberUser } from '@cosense/types/rest';

export function isLoggedIn(user: MemberUser | GuestUser): user is MemberUser {
  return 'id' in user && !('isGuest' in user && user.isGuest);
}

export async function checkScrapboxLogin(): Promise<MemberUser> {
  const result = await getProfile();
  if (isErr(result)) {
    throw new Error('Failed to get profile');
  }
  const user = unwrapOk(result);
  if (!isLoggedIn(user)) {
    throw new Error('Not logged in');
  }
  return user;
}

export async function importPageToScrapbox(
  project: string,
  title: string,
  lines: string[]
): Promise<void> {
  const result = await importPages(project, {
    pages: [{ title, lines }],
  });

  if (isErr(result)) {
    throw new Error(`Import failed: ${JSON.stringify(result)}`);
  }
}
