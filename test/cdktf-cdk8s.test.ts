import { Chart } from "cdk8s";
import { Testing } from "cdktf";
import { CDK8sProvider } from "../src";
import { KubeDeployment } from "./imports/k8s";

describe("CDK8sProvider", () => {
  test("synthesises YAML into CDKTF plan", () => {
    expect(
      Testing.synthScope((scope) => {
        const cdk8sApp = new CDK8sProvider(scope, "cdk8s-provider", {});
        const chart = new Chart(cdk8sApp, "chart");
        const label = { app: "test" };
        new KubeDeployment(chart, "deployment", {
          spec: {
            replicas: 1,
            selector: {
              matchLabels: label,
            },

            template: {
              metadata: { labels: label },
              spec: {
                containers: [
                  {
                    name: "hello-kubernetes",
                    image: "paulbouwer/hello-kubernetes:1.7",
                    ports: [{ containerPort: 8080 }],
                  },
                ],
              },
            },
          },
        });
      })
    ).toMatchInlineSnapshot(`
      "{
        \\"provider\\": {
          \\"kubernetes\\": [
            {}
          ]
        },
        \\"terraform\\": {
          \\"required_providers\\": {
            \\"kubernetes\\": {
              \\"source\\": \\"kubernetes\\",
              \\"version\\": \\"~> 2.0\\"
            }
          }
        }
      }"
    `);
  });
});
