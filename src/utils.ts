import { getInput } from '@actions/core';

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function getFromVersionFromPR(title: string) {
  return title
    .split('from ')[1]
    .split(' ')[0]
    .split('\n')[0]
    .substr(0, 8)
    .trim();
}

export function getToVersionFromPR(title: string) {
  return title
    .split(' to ')[1]
    .split(' ')[0]
    .split('\n')[0]
    .substr(0, 8)
    .trim();
}

export function getLegacyAllowLeap(task: string) {
  const res = { allowLeap: '', allowPrerelease: false };

  if (getInput(`${task}-premajor`)) {
    res.allowLeap = 'major';
    res.allowPrerelease = true;
  } else if (getInput(`${task}-major`)) res.allowLeap = 'major';
  else if (getInput(`${task}-preminor`)) {
    res.allowLeap = 'minor';
    res.allowPrerelease = true;
  } else if (getInput(`${task}-minor`)) res.allowLeap = 'minor';
  else if (getInput(`${task}-prepatch`)) {
    res.allowLeap = 'patch';
    res.allowPrerelease = true;
  } else if (getInput(`${task}-patch`)) res.allowLeap = 'patch';

  return res;
}

export function getAllowLeap(task: string, versions: string[]) {
  let allowLeap = getInput(task).toLowerCase();
  let allowPrerelease = !!getInput(`${task}-prerelease`);

  // Remove on major bump
  if (!allowLeap) {
    return getLegacyAllowLeap(task);
  }

  if (allowLeap && !versions.includes(allowLeap))
    throw new Error(`Invalid ${task} version`);

  return { allowLeap, allowPrerelease };
}
