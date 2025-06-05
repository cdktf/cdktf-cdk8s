# CDKTF CDK8s

![Status: Tech Preview](https://img.shields.io/badge/status-experimental-EAAA32) [![Releases](https://img.shields.io/github/release/cdktf/cdktf-cdk8s.svg)](https://github.com/cdktf/cdktf-cdk8s/releases)
[![LICENSE](https://img.shields.io/github/license/cdktf/cdktf-cdk8s.svg)](https://github.com/cdktf/cdktf-cdk8s/blob/main/LICENSE)
[![build](https://github.com/cdktf/cdktf-cdk8s/actions/workflows/build.yml/badge.svg)](https://github.com/cdktf/cdktf-cdk8s/actions/workflows/build.yml)

A compatibility layer for using [cdk8s](https://cdk8s.io/) constructs within Terraform CDK.

The cdk8s adapter is in technical preview, which means it's a community supported project. It still requires extensive testing and polishing to mature into a HashiCorp officially supported project. Please [file issues](https://github.com/cdktf/cdktf-cdk8s/issues/new/choose) generously and detail your experience while using the library. We welcome your feedback.

By using the software in this repository, you acknowledge that: 
* The cdk8s adapter is still in development, may change, and has not been released as a commercial product by HashiCorp and is not currently supported in any way by HashiCorp.
* The cdk8s adapter is provided on an "as-is" basis, and may include bugs, errors, or other issues.
* The cdk8s adapter is NOT INTENDED FOR PRODUCTION USE, use of the Software may result in unexpected results, loss of data, or other unexpected results, and HashiCorp disclaims any and all liability resulting from use of the cdk8s adapter.
* HashiCorp reserves all rights to make all decisions about the features, functionality and commercial release (or non-release) of the cdk8s adapter, at any time and without any obligation or liability whatsoever.

## Compatibility

- `cdktf` >= 0.21.0
- `cdk8s` >= 2.8.0
- `constructs` >= 10.4.2

## Usage

```ts
import { App, TerraformStack } from "cdktf";
import { App as CDK8sApp, Chart } from "cdk8s";
import { CDK8sProvider } from "cdktf-cdk8s";

import { MyCdk8sChart } from "./my-cdk8s-chart";

export class MyKubernetesStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const cdk8sApp = new CDK8sApp();

    // Configure your cdk8s application like usual
    new HelloKube(cdk8sApp, "my-chart");

    // For properties see https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs
    // Extends on the Provider class from @cdktf/provider-kubernetes
    new CDK8sProvider(this, "cdk8s-dev", {
      configPath: "./kubeconfig.yaml",
      configContext: "my-dev-cluster",

      // Only the cdk8sApp property is added
      // There is no need to run synth on the cdk8sApp, this is done by the provider
      cdk8sApp,
    });
  }
}

const app = new App();
new MyStack(app, "cdktf-cdk8s");
app.synth();
```

## Contributing

We welcome your contribution. Please understand that the experimental nature of this repository means that contributing code may be a bit of a moving target. If you have an idea for an enhancement or bug fix, and want to take on the work yourself, please first [create an issue](https://github.com/cdktf/cdktf-cdk8s/issues/new/choose) so that we can discuss the implementation with you before you proceed with the work.

You can review our [contribution guide](https://github.com/cdktf/.github/blob/main/CONTRIBUTING.md) to begin.
