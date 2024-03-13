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

const name = "cdktf-cdk8s";

const githubActionPinnedVersions = {
  "actions/checkout": "b4ffde65f46336ab88eb53be808477a3936bae11", // v4.1.1
  "actions/download-artifact": "c850b930e6ba138125429b7e5c93fc707a7f8427", // v4.1.4
  "actions/github-script": "60a0d83039c74a4aee543508d2ffcb1c3799cdea", // v7.0.1
  "actions/setup-node": "60edb5dd545a775178f52524783378180af0d1f8", // v4.0.2
  "actions/upload-artifact": "5d5d22a31266ced268874388b861e4b58bb5c2f3", // v4.3.1
  "amannn/action-semantic-pull-request":
    "e9fabac35e210fea40ca5b14c0da95a099eff26f", // v5.4.0
  "peter-evans/create-pull-request": "a4f52f8033a6168103c2538976c07b467e8163bc", // v6.0.1
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
  jsiiVersion: "~5.2.0",
  typescriptVersion: "~5.2.0", // should always be the same major/minor as JSII
});

new CustomizedLicense(project);
new AutoApprove(project);
new Automerge(project);
new UpgradeCDKTF(project);

project.addPeerDeps(
  "constructs@^10.3.0",
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
    uses: "hashicorp/setup-copywrite@867a1a2a064a0626db322392806428f7dc59cb3e", // v1.1.2
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

project.synth();
