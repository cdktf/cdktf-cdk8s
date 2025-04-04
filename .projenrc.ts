/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Stability } from "projen/lib/cdk";
import { ConstructLibraryCdktf } from "projen/lib/cdktf";
import { UpgradeDependenciesSchedule } from "projen/lib/javascript";
import { AutoApprove } from "./projenrc/auto-approve";
import { Automerge } from "./projenrc/automerge";
import { CustomizedLicense } from "./projenrc/customized-license";
import { UpgradeCDKTF } from "./projenrc/upgrade-cdktf";
import { UpgradeJSIIAndTypeScript } from "./projenrc/upgrade-jsii-typescript";

const name = "cdktf-cdk8s";
const constructsVersion = "10.3.0";
/** JSII and TS should always use the same major/minor version range */
const typescriptVersion = "~5.5.0";

const githubActionPinnedVersions = {
  "actions/checkout": "11bd71901bbe5b1630ceea73d27597364c9af683", // v4.2.2
  "actions/download-artifact": "fa0a91b85d4f404e444e00e005971372dc801d16", // v4.1.8
  "actions/github-script": "60a0d83039c74a4aee543508d2ffcb1c3799cdea", // v7.0.1
  "actions/setup-node": "39370e3970a6d050c480ffad4ff0ed4d3fdee5af", // v4.1.0
  "actions/setup-python": "0b93645e9fea7318ecaed2b359559ac225c90a2b", // v5.3.0
  "actions/upload-artifact": "6f51ac03b9356f520e9adb1b1b7802705f340c2b", // v4.5.0
  "amannn/action-semantic-pull-request":
    "0723387faaf9b38adef4775cd42cfd5155ed6017", // v5.5.3
  "hashicorp/setup-copywrite": "32638da2d4e81d56a0764aa1547882fc4d209636", // v1.1.3
  "peter-evans/create-pull-request": "67ccf781d68cd99b580ae25a5c18a1cc84ffff1f", // v7.0.6
};

const project = new ConstructLibraryCdktf({
  name,
  repositoryUrl: "https://github.com/cdktf/cdktf-cdk8s.git",
  description:
    "A compatibility layer for using cdk8s constructs within Terraform CDK.",
  author: "HashiCorp",
  authorAddress: "https://hashicorp.com",
  authorOrganization: true,
  defaultReleaseBranch: "main",
  bundledDeps: ["yaml@2.3.4"],
  licensed: false,
  projenrcTs: true,
  prettier: true,
  eslintOptions: {
    dirs: ["src"],
    ignorePatterns: ["**/node_modules/**", "**/test/imports/**"],
  },
  pullRequestTemplate: false,
  docgen: false,
  mergify: false,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ["auto-approve", "automerge", "dependencies"],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  workflowGitIdentity: {
    name: "team-tf-cdk",
    email: "github-team-tf-cdk@hashicorp.com",
  },
  stability: Stability.EXPERIMENTAL,
  publishToPypi: {
    distName: name,
    module: name.replace(/-/g, "_"),
  },
  cdktfVersion: "0.20.0",
  typescriptVersion,
  jsiiVersion: typescriptVersion,
});

new CustomizedLicense(project);
new AutoApprove(project);
new Automerge(project);
new UpgradeCDKTF(project);
new UpgradeJSIIAndTypeScript(project, typescriptVersion);

project.addPeerDeps(
  `constructs@^${constructsVersion}`,
  "@cdktf/provider-kubernetes@>=11.0.0",
  "cdk8s@>=2.8.0",
  "cdktf@>=0.20.0"
);

project.addDevDeps("cdk8s-cli@>=2.3", "ts-node@10.9.1");

project.testTask.prependExec(
  `cd ./test && cdk8s import k8s --language typescript`
);

project.addPackageIgnore("scripts");
project.addPackageIgnore("examples");
project.addPackageIgnore("projenrc");
project.addPackageIgnore("/.projenrc.ts");

project.addPackageIgnore(".copywrite.hcl");
// Run copywrite tool to add copyright headers to all files
project.buildWorkflow?.addPostBuildSteps(
  {
    name: "Setup Copywrite tool",
    uses: "hashicorp/setup-copywrite",
  },
  { name: "Add headers using Copywrite tool", run: "copywrite headers" }
);

// Use pinned versions of github actions
Object.entries(githubActionPinnedVersions).forEach(([action, sha]) => {
  project.github?.actions.set(action, `${action}@${sha}`);
});

const releaseWorkflow = project.tryFindObjectFile(
  ".github/workflows/release.yml"
);
releaseWorkflow?.addOverride("on.push", {
  branches: ["main"],
  "paths-ignore": [
    // don't do a release if the change was only to these files/directories
    "examples/**",
    ".github/ISSUE_TEMPLATE/**",
    ".github/CODEOWNERS",
    ".github/dependabot.yml",
    ".github/**/*.md",
  ],
});
// always publish a new GitHub release, even when publishing to a particular package manager fails
releaseWorkflow?.addOverride("jobs.release_github.needs", "release");

project.synth();
