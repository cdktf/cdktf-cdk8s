import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { App as CDK8sApp, Chart, ChartProps } from "cdk8s";
import { CDK8sProvider } from "cdktf-cdk8s";
import * as k8s from "./imports/k8s";
import * as random from "./.gen/providers/random";

interface MyChartProps extends ChartProps {
  password: string;
}

class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: MyChartProps) {
    super(scope, id, props);

    const labels = { app: "test" };
    new k8s.KubeDeployment(this, "deployment", {
      metadata: {
        labels,
        namespace: "default",
      },
      spec: {
        selector: {
          matchLabels: labels,
        },
        template: {
          metadata: {
            labels,
          },
          spec: {
            containers: [
              {
                name: "nginx",
                image: "nginx:latest",
                env: [
                  {
                    name: "password",
                    value: props.password,
                  },
                ],
              },
            ],
          },
        },
      },
    });
  }
}

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    new random.RandomProvider(this, "random", {});

    const password = new random.Password(this, "terraform-password", {
      length: 42,
    });

    const cdk8s = new CDK8sApp();
    new MyChart(cdk8s, "chart", { password: password.result });

    new CDK8sProvider(this, "cdk8s-provider", {
      cdk8sApp: cdk8s,
      configContext: "kind-kind",
      configPath: "~/.kube/config",
    });
  }
}

const app = new App();
new MyStack(app, "hello-world");
app.synth();
