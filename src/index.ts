/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { provider, manifest } from "@cdktf/provider-kubernetes";
import { App } from "cdk8s";
import { Aspects } from "cdktf";
import { Construct, IConstruct } from "constructs";
import * as yaml from "yaml";

export interface CDK8sProviderConfig extends provider.KubernetesProviderConfig {
  readonly cdk8sApp: App;
}

// TODO: Offer option that base64 encodes the strings and wraps them in btoa
// TODO: Order Terraform Manifests
function wrapLeafStringKeys(object: any): any {
  if (typeof object === "string") {
    return object
      .replace(/\n/g, "\\n") // escape newlines
      .replace(/\${/g, "$$${"); // escape ${ to $${;
  }
  const ret = Object.entries(object).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      return {
        ...acc,
        [key]: wrapLeafStringKeys(value),
      };
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return {
          ...acc,
          [key]: value.map(wrapLeafStringKeys),
        };
      } else {
        return {
          ...acc,
          [key]: wrapLeafStringKeys(value),
        };
      }
    }
    return { ...acc, [key]: value };
  }, {} as Record<string, any>);
  return ret;
}
export class CDK8sProvider extends provider.KubernetesProvider {
  constructor(scope: Construct, id: string, config: CDK8sProviderConfig) {
    super(scope, id, config);
    this.alias = `cdktf-cdk8s-${id}`;

    Aspects.of(scope).add({
      visit: (node: IConstruct) => {
        // Only run once
        if (node !== this) return;

        const yamlManifests = yaml.parseAllDocuments(
          config.cdk8sApp.synthYaml()
        );

        yamlManifests.forEach((yamlManifest) => {
          const jsonManifest = yamlManifest.toJSON();
          const type = `${jsonManifest.apiVersion}-${jsonManifest.kind}`;
          const namespace = jsonManifest.metadata.namespace || "default";
          const uniqueId = `${
            jsonManifest.metadata.name || jsonManifest.metadata.generateName
          }-${namespace}`;
          const manifestContent = wrapLeafStringKeys(jsonManifest);

          new manifest.Manifest(this, `${id}-${type}-${uniqueId}`, {
            provider: this,
            manifest: manifestContent,
          });
        });
      },
    });
  }
}
