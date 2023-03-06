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

#### Optional inputs

To add labels to the Dependabot pull request, you can specify a comma-separated string of labels:

| Input                   | Description                                     | Required | Values | Version    |
| ----------------------- | ----------------------------------------------- | -------- | ------ | ---------- |
| `token`                 | Your GitHub token, usually `{{ github.token }}` | yes      | string |            |
| `merge`                 | `major`, `minor` and `patch`                    |          | string |            |
| `merge-prerelease`      | Merge prerelease releases                       |          | bool   |            |
| `approve`               | `major`, `minor` and `patch`                    |          | bool   |            |
| `approve-prerelease`    | Approve prerelease releases                     |          | bool   |            |
| `labels-major`          | Labels for major releases                       |          | csv    |            |
| `labels-minor`          | Labels for minor releases                       |          | csv    |            |
| `labels-patch`          | Labels for patch releases                       |          | csv    |            |
| `labels-premajor`       | Labels for premajor releases                    |          | csv    |            |
| `labels-preminor`       | Labels for preminor releases                    |          | csv    |            |
| `labels-prepatch`       | Labels for prepatch releases                    |          | csv    |            |
| `labels-prerelease`     | Labels for prerelease releases                  |          | csv    |            |
| `merge-major`           | Merge major releases                            |          | bool   | Deprecated |
| `merge-minor`           | Merge minor releases                            |          | bool   | Deprecated |
| `merge-patch`           | Merge patch releases                            |          | bool   | Deprecated |
| `merge-premajor`        | Merge premajor releases                         |          | bool   | Deprecated |
| `merge-preminor`        | Merge preminor releases                         |          | bool   | Deprecated |
| `merge-prepatch`        | Merge prepatch releases                         |          | bool   | Deprecated |
| `approve-major`         | Approve major releases                          |          | bool   | Deprecated |
| `approve-minor`         | Approve minor releases                          |          | bool   | Deprecated |
| `approve-patch`         | Approve patch releases                          |          | bool   | Deprecated |
| `approve-premajor`      | Approve premajor releases                       |          | bool   | Deprecated |
| `approve-preminor`      | Approve preminor releases                       |          | bool   | Deprecated |
| `approve-prepatch`      | Approve prepatch releases                       |          | bool   | Deprecated |
| `auto-label`            | Auto label all releases                         |          | bool   | Deprecated |
| `auto-label-major`      | Auto label major releases                       |          | bool   | Deprecated |
| `auto-label-minor`      | Auto label minor releases                       |          | bool   | Deprecated |
| `auto-label-patch`      | Auto label patch releases                       |          | bool   | Deprecated |
| `auto-label-premajor`   | Auto label premajor releases                    |          | bool   | Deprecated |
| `auto-label-preminor`   | Auto label preminor releases                    |          | bool   | Deprecated |
| `auto-label-prepatch`   | Auto label prepatch releases                    |          | bool   | Deprecated |
| `auto-label-prerelease` | Auto label prerelease releases                  |          | bool   | Deprecated |

Setting `merge-prerelease` causes all the prerelease pr to be merged and all the lower level pr. Ex: If `merge`is set to `minor`, the script will merge `minor` and `patch` pr. Setting `merge-prerelease` to `true` will merge `preminor` and `prepatch` too.

- If you set any `auto-label` parameter to `true`, the release type (major, minor, etc.) label will be added to the pull request automatically, if all checks have passed
- If you set any `merge` parameter to `true`, the resulting pull request will be auto-merged, if all checks have passed
- If you set any `approve` parameter to `true`, the pull request will be automatically approved (with a pull request review), if all checks have passed

If you don't want to check for status checks, you can set the input `ignore-status-checks` to `true`. You can also set the `merge-commit` input if you want a custom merge commit message.
