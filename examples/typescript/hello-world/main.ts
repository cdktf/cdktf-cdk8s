import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { App as CDK8sApp, Chart, ChartProps } from "cdk8s";
import { Deployment } from "cdk8s-plus-21";
import { CDK8sProvider } from "cdktf-cdk8s";

// There seems to be a constructs version mismatch between cdktf (10.x) and cdk8s (3.x)
class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope as any, id, props);

    const labels = { app: "test" };
    const deployment = new Deployment(this, "deployment", {
      metadata: {
        labels,
        namespace: "default",
      },
      podMetadata: {
        labels,
      },
      volumes: [],
    });
    deployment.addContainer({
      image: "nginx:latest",
      env: {},
      port: 80,
    });
  }
}

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const cdk8s = new CDK8sApp();
    new MyChart(cdk8s as any, "chart");

    new CDK8sProvider(this, "cdk8s-provider", {
      cdk8sApp: cdk8s,
      configContext: "kind-kind",
      configPath: "~/.kube/config",
    });

    // define resources here
  }
}

const app = new App();
new MyStack(app, "hello-world");
app.synth();
