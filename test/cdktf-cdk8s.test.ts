import { App, Chart } from "cdk8s";
import { Testing } from "cdktf";
import { CDK8sProvider } from "../src";
import { KubeDeployment, KubeNamespace } from "./imports/k8s";

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
            {
              \\"alias\\": \\"cdktf-cdk8s-cdk8s-provider\\"
            }
          ]
        },
        \\"resource\\": {
          \\"kubernetes_manifest\\": {
            \\"cdk8s-provider_cdk8s-provider-apps--v1-Deployment-chart-deployment-c8b75089-default_ABFFC36F\\": {
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            }
          }
        },
        \\"terraform\\": {
          \\"required_providers\\": {
            \\"kubernetes\\": {
              \\"source\\": \\"kubernetes\\",
              \\"version\\": \\"2.13.1\\"
            }
          }
        }
      }"
    `);
  });

  test("synthesises multiple YAMLs into CDKTF plan", () => {
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

        new KubeNamespace(chart, "ns", {
          metadata: { name: "my-namespace" },
        });

        new KubeDeployment(chart, "deployment2", {
          metadata: {
            namespace: "my-namespace",
          },

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
                    name: "hello-kubernetes2",
                    image: "paulbouwer/hello-kubernetes:1.8",
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
            {
              \\"alias\\": \\"cdktf-cdk8s-cdk8s-provider\\"
            }
          ]
        },
        \\"resource\\": {
          \\"kubernetes_manifest\\": {
            \\"cdk8s-provider_cdk8s-provider-apps--v1-Deployment-chart-deployment-c8b75089-default_ABFFC36F\\": {
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            },
            \\"cdk8s-provider_cdk8s-provider-apps--v1-Deployment-chart-deployment2-c898e6fb-my-namespace_65896BBD\\": {
              \\"manifest\\": {
                \\"apiVersion\\": \\"apps/v1\\",
                \\"kind\\": \\"Deployment\\",
                \\"metadata\\": {
                  \\"name\\": \\"chart-deployment2-c898e6fb\\",
                  \\"namespace\\": \\"my-namespace\\"
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
                          \\"image\\": \\"paulbouwer/hello-kubernetes:1.8\\",
                          \\"name\\": \\"hello-kubernetes2\\",
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            },
            \\"cdk8s-provider_cdk8s-provider-v1-Namespace-my-namespace-default_BA2401B1\\": {
              \\"manifest\\": {
                \\"apiVersion\\": \\"v1\\",
                \\"kind\\": \\"Namespace\\",
                \\"metadata\\": {
                  \\"name\\": \\"my-namespace\\"
                }
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            }
          }
        },
        \\"terraform\\": {
          \\"required_providers\\": {
            \\"kubernetes\\": {
              \\"source\\": \\"kubernetes\\",
              \\"version\\": \\"2.13.1\\"
            }
          }
        }
      }"
    `);
  });

  test("escapes values against terraform", () => {
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
                    image:
                      "pau${var.notTerraformJustLooksLikeIt}lbouwer/hello-kubernetes:1.7",
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
            {
              \\"alias\\": \\"cdktf-cdk8s-cdk8s-provider\\"
            }
          ]
        },
        \\"resource\\": {
          \\"kubernetes_manifest\\": {
            \\"cdk8s-provider_cdk8s-provider-apps--v1-Deployment-chart-deployment-c8b75089-default_ABFFC36F\\": {
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
                          \\"image\\": \\"pau$\${var.notTerraformJustLooksLikeIt}lbouwer/hello-kubernetes:1.7\\",
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            }
          }
        },
        \\"terraform\\": {
          \\"required_providers\\": {
            \\"kubernetes\\": {
              \\"source\\": \\"kubernetes\\",
              \\"version\\": \\"2.13.1\\"
            }
          }
        }
      }"
    `);
  });

  test("can use multiple against different clusters", () => {
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

        new CDK8sProvider(scope, "cdk8s-provider-2", {
          cdk8sApp,
          configContext: "my-other-context",
        });
      })
    ).toMatchInlineSnapshot(`
      "{
        \\"provider\\": {
          \\"kubernetes\\": [
            {
              \\"alias\\": \\"cdktf-cdk8s-cdk8s-provider\\"
            },
            {
              \\"alias\\": \\"cdktf-cdk8s-cdk8s-provider-2\\",
              \\"config_context\\": \\"my-other-context\\"
            }
          ]
        },
        \\"resource\\": {
          \\"kubernetes_manifest\\": {
            \\"cdk8s-provider-2_cdk8s-provider-2-apps--v1-Deployment-chart-deployment-c8b75089-default_03050E76\\": {
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider-2\\"
            },
            \\"cdk8s-provider_cdk8s-provider-apps--v1-Deployment-chart-deployment-c8b75089-default_ABFFC36F\\": {
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
              },
              \\"provider\\": \\"kubernetes.cdktf-cdk8s-cdk8s-provider\\"
            }
          }
        },
        \\"terraform\\": {
          \\"required_providers\\": {
            \\"kubernetes\\": {
              \\"source\\": \\"kubernetes\\",
              \\"version\\": \\"2.13.1\\"
            }
          }
        }
      }"
    `);
  });
});
