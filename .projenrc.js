const { CDKTFConstruct } = require("@dschmidt/cdktf-construct-base");
const project = new CDKTFConstruct({
  author: "Daniel Schmidt",
  authorAddress: "danielmschmidt92@gmail.com",
  defaultReleaseBranch: "main",
  name: "cdktf-cdk8s",
  repositoryUrl: "https://github.com/DanielMSchmidt/cdktf-cdk8s.git",
  bundledDeps: ["yaml@1.10.2"],
  peerDeps: [
    "@cdktf/provider-kubernetes@>=0.6.0",
    "cdk8s@>=2.1.6",
    "cdktf@>=0.9.0",
  ],
  devDeps: ["@dschmidt/cdktf-construct-base", "cdk8s-cli"],
  description:
    "A compatability layer for using cdk8s constructs within Terraform CDK." /* The description is just a string that helps people understand the purpose of the package. */,
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  // release: undefined,      /* Add release management to this project. */
  license: "MIT",
  eslintOptions: {
    ignorePatterns: ["**/node_modules/**", "**/test/imports/**"],
  },
});

project.testTask.prependExec(
  `cd ./test && cdk8s import k8s --language typescript`
);

project.synth();
