# CDKTF CDK8s

A compatability layer for using cdk8s constructs within Terraform CDK.

## Usage

```ts
import { App, TerraformStack } from "cdktf";
import { Chart } from "cdk8s"; // Notice we don't use App here
import { CDK8sProvider } from "cdktf-cdk8s";

import { MyCdk8sChart } from "./my-cdk8s-chart";

export class MyKubernetesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // For properties see https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs
    // Extends on the Provider class from @cdktf/provider-kubernetes
    const cdk8sApp = new CDK8sProvider(this, "cdk8s-dev", {
      configPath: "./kubeconfig.yaml",
      configContext: "my-dev-cluster",
    });

    // Configure your cdk8s application like usual
    new HelloKube(cdk8sApp, "my-chart");

    // Run cdk8s like usual
    cdk8sApp.synth();

    // If you have multiple clusters you can instanciate a new app for each cluster
    const otherCdk8sApp = new CDK8sProvider(this, "cdk8s-staging", {
      configPath: "./kubeconfig.yaml",
      configContext: "my-staging-cluster",
    });
  }
}

const app = new App();
new MyStack(app, "cdktf-cdk8s");
app.synth();
```
