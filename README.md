# 📦 Dependabot Pull Request Action

This action is based on [koj-co/dependabot-pr-action](https://github.com/koj-co/dependabot-pr-action)

A GitHub Action to automatically label, approve, and merge pull requests made by Dependabot. This was built because the auto-merge feature was removed when Dependabot became a native-GitHub feature.

[![Build CI](https://github.com/mitto98/dependabot-automerge-action/workflows/Release%20CI/badge.svg)](https://github.com/koj-co/dependabot-pr-action/actions?query=workflow%3A%22Build+CI%22)

## ⭐ Get started

You can run this workflow, for example, two times a day:

```yaml
name: Automerge dependabot pr

on:
  schedule:
    - cron: '0 7,12 * * *'

jobs:
  automerge:
    name: Auto-merge patch updates
    runs-on: ubuntu-latest
    steps:
      - uses: mitto98/dependabot-automerge-action@master
        with:
          token: ${{ github.token }}
          merge-patch: true
```

### Inputs

#### `token` (required)

Your GitHub token, usually `{{ github.token }}` or a personal access token if you have a bot account.

#### Optional inputs

To add labels to the Dependabot pull request, you can specify a comma-separated string of labels:

| Input               | Description                    |
| ------------------- | ------------------------------ |
| `labels-major`      | Labels for major releases      |
| `labels-minor`      | Labels for minor releases      |
| `labels-patch`      | Labels for patch releases      |
| `labels-premajor`   | Labels for premajor releases   |
| `labels-preminor`   | Labels for preminor releases   |
| `labels-prepatch`   | Labels for prepatch releases   |
| `labels-prerelease` | Labels for prerelease releases |

To configure the workflow, you can set any of these inputs to `true`:

| Input                   | Description                    |
| ----------------------- | ------------------------------ |
| `approve`               | Approve all releases           |
| `approve-major`         | Approve major releases         |
| `approve-minor`         | Approve minor releases         |
| `approve-patch`         | Approve patch releases         |
| `approve-premajor`      | Approve premajor releases      |
| `approve-preminor`      | Approve preminor releases      |
| `approve-prepatch`      | Approve prepatch releases      |
| `approve-prerelease`    | Approve prerelease releases    |
| `auto-label`            | Auto label all releases        |
| `auto-label-major`      | Auto label major releases      |
| `auto-label-minor`      | Auto label minor releases      |
| `auto-label-patch`      | Auto label patch releases      |
| `auto-label-premajor`   | Auto label premajor releases   |
| `auto-label-preminor`   | Auto label preminor releases   |
| `auto-label-prepatch`   | Auto label prepatch releases   |
| `auto-label-prerelease` | Auto label prerelease releases |
| `merge`                 | Merge all releases             |
| `merge-major`           | Merge major releases           |
| `merge-minor`           | Merge minor releases           |
| `merge-patch`           | Merge patch releases           |
| `merge-premajor`        | Merge premajor releases        |
| `merge-preminor`        | Merge preminor releases        |
| `merge-prepatch`        | Merge prepatch releases        |
| `merge-prerelease`      | Merge prerelease releases      |

- If you set any `auto-label` parameter to `true`, the release type (major, minor, etc.) label will be added to the pull request automatically, if all checks have passed
- If you set any `merge` parameter to `true`, the resulting pull request will be auto-merged, if all checks have passed
- If you set any `approve` parameter to `true`, the pull request will be automatically approved (with a pull request review), if all checks have passed

If you don't want to check for status checks, you can set the input `ignore-status-checks` to `true`. You can also set the `merge-commit` input if you want a custom merge commit message.
