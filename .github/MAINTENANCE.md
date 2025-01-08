# Maintenance Guide

This document is intended for maintainers of this repository and outlines how to perform various maintenance-related activities, including descriptions of what processes are currently automated and which are not (yet).

This repository contains extensive GitHub Actions [workflows](https://github.com/cdktf/cdktf-cdk8s/tree/main/.github/workflows) that automate as much of the project's lifecycle as possible. The project is built using [Projen](https://projen.io/) and as such **these workflows should not be edited directly**. Their sources can be found in the [`.projenrc/`](https://github.com/cdktf/cdktf-cdk8s/tree/main/projenrc) directory, and new workflows are added to the project in [`.projenrc.ts`](https://github.com/cdktf/cdktf-cdk8s/blob/main/.projenrc.ts).

This project is considered experimental, and does not offer any support or maintenance guarantees.


## Security & Dependency Management

Dependency upgrades (for security purposes as well as a best practice) can be divided into three categories: fully-automated, semi-automated, and not automated.

### Fully Automated

The following Actions exist to automate various dependency upgrades:

- [upgrade-main](https://github.com/cdktf/cdktf-cdk8s/actions/workflows/upgrade-main.yml): This is a Projen built-in/default workflow that handles automated dependency updates. It currently runs on a weekly basis, which can be configured [here](https://github.com/cdktf/cdktf-cdk8s/blob/341c9668dcf16c80fc999f852244c7119914e5f9/.projenrc.ts#L55). Projen will upgrade itself as part of this process. This process is 100% automated; as long as the build succeeds and any tests pass, the PR that is generated will be automatically merged without any human intervention.

Dependabot is also [configured](https://github.com/cdktf/cdktf-cdk8s/blob/main/.github/dependabot.yml) to check for new security updates daily and, if found, make changes to the lockfile only. This is because Dependabot can sometimes address security issues in dependencies more quickly than Projen due to its atomic nature. While you could tweak the Dependabot settings, note that Projen and Dependabot do not generally play nicely together; in particular, Dependabot cannot make changes to `package.json` because Projen would just override these changes (hence the reason why Dependabot is currently limited to lockfile-only). If you wanted to fully automate dependency management using Dependabot, you would want to disable Projen's [automatic updates](https://projen.io/docs/api/typescript#projen.typescript.TypeScriptProjectOptions.property.depsUpgrade).

### Semi-Automated

The following Actions either need to be manually triggered or require significant manual effort as part of the upgrade process:

- [upgrade-cdktf](https://github.com/cdktf/cdktf-cdk8s/actions/workflows/upgrade-cdktf.yml): This is a custom workflow (source [here](https://github.com/cdktf/cdktf-cdk8s/blob/main/projenrc/upgrade-cdktf.ts)) that runs four times a day and checks whether there is a new minor version of CDKTF itself (e.g. `0.19`, `0.20`, `0.21`, etc.), using the latest version published to npm as the source of truth. If a new version is found, it runs [this](https://github.com/cdktf/cdktf-cdk8s/blob/main/scripts/update-cdktf.sh) script to update the CDKTF version in all the right places, and then it creates a draft PR. The reason for the draft status is because a few steps related to the upgrade cannot be automated and must be done manually by an engineer; these are outlined step-by-step in the PR body. Once the steps are completed, the PR can be marked as ready for review & approved in order to complete the upgrade.
- [upgrade-jsii-typescript](https://github.com/cdktf/cdktf-cdk8s/actions/workflows/upgrade-jsii-typescript.yml): This is a custom workflow (source [here](https://github.com/cdktf/cdktf-cdk8s/blob/main/projenrc/upgrade-jsii-typescript.ts)) that must be manually triggered because there currently is no programmatic way to determine when a JSII version is no longer supported. This means that somebody should be monitoring the [JSII support timeline](https://github.com/aws/jsii-compiler/blob/main/README.md#gear-maintenance--support) to determine when it's time to upgrade. The script takes as input the desired new version, and all the steps afterwards are fully automated. The code for the upgrade itself lives in [this](https://github.com/cdktf/cdktf-cdk8s/blob/main/scripts/update-jsii-typescript.sh) script.

### Not Automated

- **GitHub Actions version pinning**: Because this project leverages Projen, HashiCorp Security's [tsccr-helper](https://github.com/hashicorp/security-tsccr?tab=readme-ov-file#tsccr-helper-cli) CLI and other tooling cannot be used to manage/upgrade GitHub Actions versions. Instead, we have consolidated all of the versions into a single [object](https://github.com/cdktf/cdktf-cdk8s/blob/341c9668dcf16c80fc999f852244c7119914e5f9/.projenrc.ts#L19-L30) in code that must be manually updated. Historically, one of the maintainers has followed these manual steps on a roughly monthly basis:
  1. Look up the latest supported versions [here](https://github.com/hashicorp/security-tsccr/tree/main/components/github_actions)
  2. Update the [object](https://github.com/cdktf/cdktf-cdk8s/blob/341c9668dcf16c80fc999f852244c7119914e5f9/.projenrc.ts#L19-L30)
  3. Run `npx projen`
  4. Create a new PR with the title `chore(deps): update pinned versions of GitHub Actions`
- **`constructs` library upgrades**: Because `constructs` is a peer dependency, the `upgrade-main` script described above will _never_ increment its version; this will always need to be done manually by [editing](https://github.com/cdktf/cdktf-cdk8s/blob/341c9668dcf16c80fc999f852244c7119914e5f9/.projenrc.ts#L79) `.projenrc.ts`. This could _in theory_ be (semi)automated like some of our other upgrade workflows described above for things like CDKTF, Node, and JSII, but in practice we currently have no logic or criteria that governs when `constructs` should be updated; as such, creating a custom workflow for it felt like more effort than it's really worth.
- **`cdk8s` library upgrades**: Ditto everything said above about `constructs` but for `cdk8s`. Right now, upgrading the latter also will always need to be done manually by [editing](https://github.com/cdktf/cdktf-cdk8s/blob/341c9668dcf16c80fc999f852244c7119914e5f9/.projenrc.ts#L81) `.projenrc.ts`.

Also worth noting: Unlike many of our other Projen-based projects, this one does not have a script that automatically upgrades Node.js because this library does not enforce a `minNodeVersion`. If we did at some point want to start enforcing a `minNodeVersion`, we should copy over the `upgrade-node` script that our other Projen projects use.


## Releasing

Releases are fully automated by Projen and require no manual intervention whatsoever. In general, this repository is configured to publish a new release for each pull request that gets merged. The only way to force it to create one release that combines multiple merged PRs is to ensure that all of these PRs get merged into `main` at exactly the same time. The new version number is automatically calculated by Projen using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [Semantic Versioning](https://semver.org/).

If you wanted to change the logic that governs when releases are triggered (such as running them on a schedule, or only for certain types of commits), see Projen's [documentation](https://projen.io/docs/publishing/releases-and-versioning) on this subject.

### Package Managers

This library is currently published to these package managers:

- **npm**: The package is called [cdktf-cdk8s](https://www.npmjs.com/package/cdktf-cdk8s), and publishing is done using an access token associated with the shared [cdktf-team](https://www.npmjs.com/~cdktf-team) account. Credentials to access this account can be found in the CDK for Terraform Team 1Password Vault.
- **PyPi**: The package is called [cdktf-cdk8s](https://pypi.org/project/cdktf-cdk8s), and publishing is done using an access token associated with the shared [cdktf-team](https://pypi.org/user/cdktf-team/) account. Credentials to access this account can be found in the CDK for Terraform Team 1Password Vault.
