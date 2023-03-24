/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CDKTFConstruct } from "@dschmidt/cdktf-construct-base";
import { IResolver, License } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

const SPDX = "MPL-2.0";

class CustomizedLicense extends License {
  constructor(project: TypeScriptProject) {
    super(project, { spdx: SPDX });

    project.addFields({ license: SPDX });
  }

  synthesizeContent(resolver: IResolver) {
    return (
      "Copyright (c) 2022 HashiCorp, Inc.\n\n" +
      super.synthesizeContent(resolver)
    );
  }
}

const project = new CDKTFConstruct({
  author: "HashiCorp",
  authorAddress: "https://hashicorp.com",
  authorOrganization: true,
  defaultReleaseBranch: "main",
  name: "cdktf-cdk8s",
  repositoryUrl: "https://github.com/cdktf/cdktf-cdk8s.git",
  bundledDeps: ["yaml@1.10.2"],
  workflowGitIdentity: {
    name: "team-tf-cdk",
    email: "github-team-tf-cdk@hashicorp.com",
  },
  description:
    "A compatibility layer for using cdk8s constructs within Terraform CDK." /* The description is just a string that helps people understand the purpose of the package. */,
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  // release: undefined,      /* Add release management to this project. */
  licensed: false,
  eslintOptions: {
    dirs: ["src"],
    ignorePatterns: ["**/node_modules/**", "**/test/imports/**"],
  },
  docgen: false,
});

new CustomizedLicense(project);

project.addPeerDeps(
  "@cdktf/provider-kubernetes@>=5.0.0",
  "cdk8s@>=2.1.6",
  "cdktf@>=0.15.0"
);

project.addDevDeps("@dschmidt/cdktf-construct-base", "cdk8s-cli@>=2.0");

project.testTask.prependExec(
  `cd ./test && cdk8s import k8s --language typescript`
);

project.addDevDeps("ts-node@10.9.1");

// Run copywrite tool to add copyright headers to all files
project.buildWorkflow?.addPostBuildSteps(
  {
    name: "Setup Copywrite tool",
    uses: "hashicorp/setup-copywrite@3ace06ad72e6ec679ea8572457b17dbc3960b8ce", // v1.0.0
    with: { token: "${{ secrets.GITHUB_TOKEN }}" },
  },
  { name: "Add headers using Copywrite tool", run: "copywrite headers" }
);

project.synth();
