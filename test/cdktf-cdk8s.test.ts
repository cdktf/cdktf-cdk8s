import { App, Chart } from "cdk8s";
import { Testing } from "cdktf";
import { CDK8sProvider } from "../src";
import { KubeDeployment } from "./imports/k8s";

describe("CDK8sProvider", () => {
  test("synthesises YAML into CDKTF plan", () => {
    expect(
      Testing.synthScope((scope) => {
        const cdk8sApp = new App();
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

        new CDK8sProvider(scope, "cdk8s-provider", {
          cdk8sApp,
        });
      })
    ).toMatchInlineSnapshot(`
      "{
        \\"provider\\": {
          \\"kubernetes\\": [
            {}
          ]
        },
        \\"resource\\": {
          \\"kubernetes_manifest\\": {
            \\"cdk8s-provider_cdk8s_CAD6782A\\": {
              \\"manifest\\": {
                \\"apiVersion\\": \\"apps/v1\\",
                \\"kind\\": \\"Deployment\\",
                \\"metadata\\": {
                  \\"name\\": \\"chart-deployment-c8b75089\\"
                },
                \\"spec\\": {
                  \\"replicas\\": 1,
                  \\"selector\\": {
                    \\"matchLabels\\": {
                      \\"app\\": \\"test\\"
                    }
                  },
                  \\"template\\": {
                    \\"metadata\\": {
                      \\"labels\\": {
                        \\"app\\": \\"test\\"
                      }
                    },
                    \\"spec\\": {
                      \\"containers\\": [
                        {
                          \\"image\\": \\"paulbouwer/hello-kubernetes:1.7\\",
                          \\"name\\": \\"hello-kubernetes\\",
                          \\"ports\\": [
                            {
                              \\"containerPort\\": 8080
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
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
