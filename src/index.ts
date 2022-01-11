import {
  KubernetesProvider,
  KubernetesProviderConfig,
} from "@cdktf/provider-kubernetes";
import { App } from "cdk8s";
import { TerraformAsset } from "cdktf";
import { Construct } from "constructs";

export interface CDK8sProviderConfig extends KubernetesProviderConfig {}

export class CDK8sProvider extends KubernetesProvider {
  public app: App;
  constructor(scope: Construct, id: string, config: CDK8sProviderConfig) {
    super(scope, id, config);

    const assetPath = new TerraformAsset(this, "cdk8s-out-path", {
      path: __dirname, // Hack to get a TMP dir, empty would be better
    });

    this.app = new App({
      outdir: assetPath.path,
    });
  }
}
