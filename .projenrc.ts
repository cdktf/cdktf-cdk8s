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
  "actions/checkout": "8ade135a41bc03ea155e62e844d188df1ea18608", // v4.1.0
  "actions/download-artifact": "9bc31d5ccc31df68ecc42ccf4149144866c47d8a", // v3.0.2
  "actions/github-script": "d7906e4ad0b1822421a7e6a35d5ca353c962f410", // v6.4.1
  "actions/setup-node": "5e21ff4d9bc1a8cf6de233a3057d20ec6b3fb69d", // v3.8.1
  "actions/upload-artifact": "a8a3f3ad30e3422c9c7b888a15615d19a852ae32", // v3.1.3
  "amannn/action-semantic-pull-request":
    "47b15d52c5c30e94a17ec87eb8dd51ff5221fed9", // v5.3.0
  "peter-evans/create-pull-request": "153407881ec5c347639a548ade7d8ad1d6740e38", // v5.0.2
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
  bundledDeps: ["yaml@1.10.2"],
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
  cdktfVersion: "0.19.0",
  jsiiVersion: "^5.1.0",
});

new CustomizedLicense(project);
new AutoApprove(project);
new Automerge(project);
new UpgradeCDKTF(project);

project.addPeerDeps(
  "constructs@^10.0.25",
  "@cdktf/provider-kubernetes@>=10.0.0",
  "cdk8s@>=2.1.6",
  "cdktf@>=0.19.0"
);

project.addDevDeps("cdk8s-cli@>=2.0", "ts-node@10.9.1");

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
