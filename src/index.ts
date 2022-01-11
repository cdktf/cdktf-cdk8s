import {
  KubernetesProvider,
  KubernetesProviderConfig,
  Manifest,
} from "@cdktf/provider-kubernetes";
import { App } from "cdk8s";
import { Aspects } from "cdktf";
import { Construct, IConstruct } from "constructs";
import * as yaml from "yaml";

export interface CDK8sProviderConfig extends KubernetesProviderConfig {
  readonly cdk8sApp: App;
}

export class CDK8sProvider extends KubernetesProvider {
  constructor(scope: Construct, id: string, config: CDK8sProviderConfig) {
    super(scope, id, config);

    Aspects.of(scope).add({
      visit: (node: IConstruct) => {
        // Only run once
        if (node !== this) return;

        const yamlManifests = yaml.parseAllDocuments(
          config.cdk8sApp.synthYaml()
        );

        yamlManifests.forEach((yamlManifest) => {
          new Manifest(this, "cdk8s", {
            manifest: yamlManifest.toJSON(),
          });
        });
      },
    });
  }
}
