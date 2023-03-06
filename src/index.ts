import { getInput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';
import { diff, valid } from 'semver';
import {
  ChecksListForRefResponseData,
  ReposListCommitStatusesForRefResponseData,
} from '@octokit/types';
import {
  getAllowLeap,
  getFromVersionFromPR,
  getToVersionFromPR,
  wait,
} from './utils';

const versions = ['patch', 'minor', 'major'];

const token =
  getInput('token') || process.env.GH_PAT || process.env.GITHUB_TOKEN;
if (!token) throw new Error('GitHub token not found');

const { allowLeap: mergeAllowLeap, allowPrerelease: mergePrerelease } =
  getAllowLeap('merge', versions);

const { allowLeap: approveAllowLeap, allowPrerelease: approvePrerelease } =
  getAllowLeap('approve', versions);

const octokit = getOctokit(token);

const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const ignoreStatusChecks = getInput('ignore-status-checks');

function shouldProcess(
  versionLeap: string,
  actualVersionLeap: string,
  allowPrerelease: boolean
) {
  const treatedLevel = allowPrerelease
    ? actualVersionLeap.replace('pre', '')
    : actualVersionLeap;
  if (versionLeap === 'true' && versions.includes(actualVersionLeap))
    return true;
  // If prerelease is not enabled it will be -1, so the statement will be falsy
  return versions.indexOf(versionLeap) >= versions.indexOf(treatedLevel);
}

async function addLabels(prNumber: number, labels: string) {
  console.log('addLabels', prNumber, labels);
  const addLabels = labels.split(',').map((i) => i.trim());
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: prNumber,
    labels: addLabels,
  });
}

async function doMerge(prNumber: number, prTitle: string, tryNumber = 1) {
  if (tryNumber > 10) return;
  console.log('autoMerge', prNumber, tryNumber);
  try {
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      commit_title: (
        getInput('merge-commit') ||
        `:twisted_rightwards_arrows: Merge #$PR_NUMBER ($PR_TITLE)`
      )
        .replace('$PR_NUMBER', prNumber.toString())
        .replace('$PR_TITLE', prTitle),
    });
  } catch (error) {
    console.log(error);
    await wait(tryNumber * 1000);
    await doMerge(prNumber, prTitle, tryNumber + 1);
  }
}

async function doApprove(prNumber: number) {
  // TODO: sometimes the request fails for no reason, retry it
  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event: 'APPROVE',
    });
  } catch (error) {}
}

interface DependabotPR {
  number: number;
  title: string;
  checkRuns: ChecksListForRefResponseData['check_runs'];
  uniqueStatuses: ReposListCommitStatusesForRefResponseData;
  first: string | null;
  last: string | null;
  version: string | null;
}

async function getDependabotPRs(): Promise<DependabotPR[]> {
  const pullRequests = await octokit.pulls.list({ owner, repo, state: 'open' });
  const dependabotPRs = pullRequests.data.filter(
    (pr) => pr.user.login === 'dependabot[bot]'
  );

  return await Promise.all(
    dependabotPRs.map(async (pr) => {
      const lastCommitHash = pr._links.statuses.href.split('/').pop() || '';
      const params = {
        owner,
        repo,
        ref: lastCommitHash,
      };

      const checkRuns = await octokit.checks.listForRef(params);
      const statuses = await octokit.repos.listCommitStatusesForRef(params);
      const uniqueStatuses = statuses.data.filter(
        (item, index, self) =>
          self.map((i) => i.context).indexOf(item.context) === index
      );

      let version: string | null = '';
      let first = '';
      let last = '';
      try {
        first = getFromVersionFromPR(pr.title);
        last = getToVersionFromPR(pr.title);
        if (first && last) version = diff(first, last);
      } catch (error) {}

      return {
        number: pr.number,
        title: pr.title,
        checkRuns: checkRuns.data.check_runs,
        uniqueStatuses,
        first: valid(first),
        last: valid(last),
        version,
      };
    })
  );
}

export async function run() {
  const dependabotPRs = await getDependabotPRs();
  console.table(dependabotPRs);

  for (const pr of dependabotPRs) {
    console.log('\nStarting PR', pr.number, '-', pr.title);

    if (!ignoreStatusChecks) {
      // Skip if not all check are successful
      const allChecksHaveSucceeded = pr.checkRuns.every(
        ({ conclusion }) => conclusion === 'success' || conclusion === 'skipped'
      );
      // Skip if status are not ok
      const areAllStatusOk = pr.uniqueStatuses.every(
        ({ state }) => state === 'success'
      );
      if (!allChecksHaveSucceeded && !areAllStatusOk) {
        console.log('Not all status check have succeded');
        continue;
      }
    }

    console.log(`Diff version is (${pr.first} -> ${pr.last}) ${pr.version}`);

    if (!pr.version) {
      console.log('Invalid version bump');
      continue;
    }

    const labels = getInput(`labels-${pr.version}`);
    if (labels) {
      await addLabels(pr.number, labels);
      console.log('Labeled');
    }

    // Autolabel - TODO Deprecated
    if (getInput('auto-label') || getInput(`auto-label-${pr.version}`)) {
      await addLabels(pr.number, pr.version);
      console.log('Auto labeled');
    }

    // Auto approve
    if (
      approveAllowLeap &&
      shouldProcess(approveAllowLeap, pr.version, approvePrerelease)
    ) {
      doApprove(pr.number);
      console.log('Approved');
    }

    // Auto merge
    if (
      mergeAllowLeap &&
      shouldProcess(mergeAllowLeap, pr.version, mergePrerelease)
    ) {
      doMerge(pr.number, pr.title);
      console.log('Merged');
    }
  }

  console.log('\nAll done!');
}

run()
  .then(() => {})
  .catch((error) => {
    console.error('ERROR', error);
    setFailed(error.message);
  });
