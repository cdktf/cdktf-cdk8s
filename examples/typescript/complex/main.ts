/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { App as CDK8sApp, Chart, ChartProps } from "cdk8s";
import { CDK8sProvider } from "cdktf-cdk8s";
import * as kplus from "cdk8s-plus-22";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { Pet } from "@cdktf/provider-random/lib/pet";

interface MyChartProps extends ChartProps {
  podName: string;
  directory: string;
}

// https://cdk8s.io/docs/latest/plus/config-map/#creating-a-volume-from-a-directory
class PodWithMountedAppDirChart extends Chart {
  public podName: string;
  constructor(scope: Construct, id: string, props: MyChartProps) {
    super(scope, id, props);

    const appMap = new kplus.ConfigMap(this, "Config");

    appMap.addDirectory(props.directory);

    const appVolume = kplus.Volume.fromConfigMap(this, "app", appMap);

    const mountPath = "/var/app";
    const pod = new kplus.Pod(this, "Pod");
    const container = pod.addContainer({
      image: "node",
      command: ["node", "app.js"],
      workingDir: mountPath,
    });

    // from here, just mount the volume to a container, and run your app!
    container.mount(mountPath, appVolume);
    this.podName = pod.name;
  }
}

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new RandomProvider(this, "random");

    const cdk8s = new CDK8sApp();
    const chart = new PodWithMountedAppDirChart(cdk8s, "config-map-example", {
      podName: new Pet(this, "chart-pet-name").id, // Can use values from the CDKTF context
      directory: "./imports", // We don't use TerraformAsset here since the read values are inlined in the configuration
    });

    // Multiple charts of the same kind can be configured in a CDK8s app
    new PodWithMountedAppDirChart(cdk8s, "another-config-map-example", {
      podName: new Pet(this, "another-chart-pet-name").id,
      directory: "./node_modules/cdktf",
    });

    // The adapter can be used in multiple K8s contexts
    new CDK8sProvider(this, "cdk8s-provider-for-kind", {
      cdk8sApp: cdk8s,
      configContext: "kind-kind",
      configPath: "$HOME/.kube/config",
    });

    new CDK8sProvider(this, "cdk8s-provider-for-docker-desktop", {
      cdk8sApp: cdk8s,
      configContext: "docker-desktop",
      configPath: "$HOME/.kube/config",
    });

    new TerraformOutput(this, "pod-name", {
      // Can use values from the CDK8s context
      // While we are able to get static values we'd need to
      // use a data source to get dynamic values (e.g. the IP of pod)
      value: chart.podName,
    });
  }
}

const app = new App();
new MyStack(app, "hello-world");
app.synth();
