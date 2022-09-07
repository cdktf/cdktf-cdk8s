# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="constructs"></a>

### CDK8sProvider <a name="cdktf-cdk8s.CDK8sProvider" id="cdktfcdk8scdk8sprovider"></a>

#### Initializers <a name="cdktf-cdk8s.CDK8sProvider.Initializer" id="cdktfcdk8scdk8sproviderinitializer"></a>

```typescript
import { CDK8sProvider } from 'cdktf-cdk8s'

new CDK8sProvider(scope: Construct, id: string, config: CDK8sProviderConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`scope`](#cdktfcdk8scdk8sproviderparameterscope)<span title="Required">*</span> | [`constructs.Construct`](#constructs.Construct) | *No description.* |
| [`id`](#cdktfcdk8scdk8sproviderparameterid)<span title="Required">*</span> | `string` | *No description.* |
| [`config`](#cdktfcdk8scdk8sproviderparameterconfig)<span title="Required">*</span> | [`cdktf-cdk8s.CDK8sProviderConfig`](#cdktf-cdk8s.CDK8sProviderConfig) | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="cdktf-cdk8s.CDK8sProvider.parameter.scope" id="cdktfcdk8scdk8sproviderparameterscope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdktf-cdk8s.CDK8sProvider.parameter.id" id="cdktfcdk8scdk8sproviderparameterid"></a>

- *Type:* `string`

---

##### `config`<sup>Required</sup> <a name="cdktf-cdk8s.CDK8sProvider.parameter.config" id="cdktfcdk8scdk8sproviderparameterconfig"></a>

- *Type:* [`cdktf-cdk8s.CDK8sProviderConfig`](#cdktf-cdk8s.CDK8sProviderConfig)

---





## Structs <a name="Structs" id="structs"></a>

### CDK8sProviderConfig <a name="cdktf-cdk8s.CDK8sProviderConfig" id="cdktfcdk8scdk8sproviderconfig"></a>

#### Initializer <a name="[object Object].Initializer" id="object-objectinitializer"></a>

```typescript
import { CDK8sProviderConfig } from 'cdktf-cdk8s'

const cDK8sProviderConfig: CDK8sProviderConfig = { ... }
```

#### Properties <a name="Properties" id="properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`alias`](#cdktfcdk8scdk8sproviderconfigpropertyalias) | `string` | Alias name. |
| [`clientCertificate`](#cdktfcdk8scdk8sproviderconfigpropertyclientcertificate) | `string` | PEM-encoded client certificate for TLS authentication. |
| [`clientKey`](#cdktfcdk8scdk8sproviderconfigpropertyclientkey) | `string` | PEM-encoded client certificate key for TLS authentication. |
| [`clusterCaCertificate`](#cdktfcdk8scdk8sproviderconfigpropertyclustercacertificate) | `string` | PEM-encoded root certificates bundle for TLS authentication. |
| [`configContext`](#cdktfcdk8scdk8sproviderconfigpropertyconfigcontext) | `string` | Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context KubernetesProvider#config_context}. |
| [`configContextAuthInfo`](#cdktfcdk8scdk8sproviderconfigpropertyconfigcontextauthinfo) | `string` | Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context_auth_info KubernetesProvider#config_context_auth_info}. |
| [`configContextCluster`](#cdktfcdk8scdk8sproviderconfigpropertyconfigcontextcluster) | `string` | Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context_cluster KubernetesProvider#config_context_cluster}. |
| [`configPath`](#cdktfcdk8scdk8sproviderconfigpropertyconfigpath) | `string` | Path to the kube config file. Can be set with KUBE_CONFIG_PATH. |
| [`configPaths`](#cdktfcdk8scdk8sproviderconfigpropertyconfigpaths) | `string`[] | A list of paths to kube config files. Can be set with KUBE_CONFIG_PATHS environment variable. |
| [`exec`](#cdktfcdk8scdk8sproviderconfigpropertyexec) | [`@cdktf/provider-kubernetes.KubernetesProviderExec`](#@cdktf/provider-kubernetes.KubernetesProviderExec) | exec block. |
| [`experiments`](#cdktfcdk8scdk8sproviderconfigpropertyexperiments) | [`@cdktf/provider-kubernetes.KubernetesProviderExperiments`](#@cdktf/provider-kubernetes.KubernetesProviderExperiments) | experiments block. |
| [`host`](#cdktfcdk8scdk8sproviderconfigpropertyhost) | `string` | The hostname (in form of URI) of Kubernetes master. |
| [`insecure`](#cdktfcdk8scdk8sproviderconfigpropertyinsecure) | `boolean` \| [`cdktf.IResolvable`](#cdktf.IResolvable) | Whether server should be accessed without verifying the TLS certificate. |
| [`password`](#cdktfcdk8scdk8sproviderconfigpropertypassword) | `string` | The password to use for HTTP basic authentication when accessing the Kubernetes master endpoint. |
| [`proxyUrl`](#cdktfcdk8scdk8sproviderconfigpropertyproxyurl) | `string` | URL to the proxy to be used for all API requests. |
| [`token`](#cdktfcdk8scdk8sproviderconfigpropertytoken) | `string` | Token to authenticate an service account. |
| [`username`](#cdktfcdk8scdk8sproviderconfigpropertyusername) | `string` | The username to use for HTTP basic authentication when accessing the Kubernetes master endpoint. |
| [`cdk8sApp`](#cdktfcdk8scdk8sproviderconfigpropertycdk8sapp)<span title="Required">*</span> | [`cdk8s.App`](#cdk8s.App) | *No description.* |

---

##### `alias`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.alias" id="cdktfcdk8scdk8sproviderconfigpropertyalias"></a>

```typescript
public readonly alias: string;
```

- *Type:* `string`

Alias name.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#alias KubernetesProvider#alias}

---

##### `clientCertificate`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.clientCertificate" id="cdktfcdk8scdk8sproviderconfigpropertyclientcertificate"></a>

```typescript
public readonly clientCertificate: string;
```

- *Type:* `string`

PEM-encoded client certificate for TLS authentication.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#client_certificate KubernetesProvider#client_certificate}

---

##### `clientKey`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.clientKey" id="cdktfcdk8scdk8sproviderconfigpropertyclientkey"></a>

```typescript
public readonly clientKey: string;
```

- *Type:* `string`

PEM-encoded client certificate key for TLS authentication.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#client_key KubernetesProvider#client_key}

---

##### `clusterCaCertificate`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.clusterCaCertificate" id="cdktfcdk8scdk8sproviderconfigpropertyclustercacertificate"></a>

```typescript
public readonly clusterCaCertificate: string;
```

- *Type:* `string`

PEM-encoded root certificates bundle for TLS authentication.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#cluster_ca_certificate KubernetesProvider#cluster_ca_certificate}

---

##### `configContext`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.configContext" id="cdktfcdk8scdk8sproviderconfigpropertyconfigcontext"></a>

```typescript
public readonly configContext: string;
```

- *Type:* `string`

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context KubernetesProvider#config_context}.

---

##### `configContextAuthInfo`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.configContextAuthInfo" id="cdktfcdk8scdk8sproviderconfigpropertyconfigcontextauthinfo"></a>

```typescript
public readonly configContextAuthInfo: string;
```

- *Type:* `string`

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context_auth_info KubernetesProvider#config_context_auth_info}.

---

##### `configContextCluster`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.configContextCluster" id="cdktfcdk8scdk8sproviderconfigpropertyconfigcontextcluster"></a>

```typescript
public readonly configContextCluster: string;
```

- *Type:* `string`

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_context_cluster KubernetesProvider#config_context_cluster}.

---

##### `configPath`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.configPath" id="cdktfcdk8scdk8sproviderconfigpropertyconfigpath"></a>

```typescript
public readonly configPath: string;
```

- *Type:* `string`

Path to the kube config file. Can be set with KUBE_CONFIG_PATH.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_path KubernetesProvider#config_path}

---

##### `configPaths`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.configPaths" id="cdktfcdk8scdk8sproviderconfigpropertyconfigpaths"></a>

```typescript
public readonly configPaths: string[];
```

- *Type:* `string`[]

A list of paths to kube config files. Can be set with KUBE_CONFIG_PATHS environment variable.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#config_paths KubernetesProvider#config_paths}

---

##### `exec`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.exec" id="cdktfcdk8scdk8sproviderconfigpropertyexec"></a>

```typescript
public readonly exec: KubernetesProviderExec;
```

- *Type:* [`@cdktf/provider-kubernetes.KubernetesProviderExec`](#@cdktf/provider-kubernetes.KubernetesProviderExec)

exec block.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#exec KubernetesProvider#exec}

---

##### `experiments`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.experiments" id="cdktfcdk8scdk8sproviderconfigpropertyexperiments"></a>

```typescript
public readonly experiments: KubernetesProviderExperiments;
```

- *Type:* [`@cdktf/provider-kubernetes.KubernetesProviderExperiments`](#@cdktf/provider-kubernetes.KubernetesProviderExperiments)

experiments block.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#experiments KubernetesProvider#experiments}

---

##### `host`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.host" id="cdktfcdk8scdk8sproviderconfigpropertyhost"></a>

```typescript
public readonly host: string;
```

- *Type:* `string`

The hostname (in form of URI) of Kubernetes master.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#host KubernetesProvider#host}

---

##### `insecure`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.insecure" id="cdktfcdk8scdk8sproviderconfigpropertyinsecure"></a>

```typescript
public readonly insecure: boolean | IResolvable;
```

- *Type:* `boolean` | [`cdktf.IResolvable`](#cdktf.IResolvable)

Whether server should be accessed without verifying the TLS certificate.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#insecure KubernetesProvider#insecure}

---

##### `password`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.password" id="cdktfcdk8scdk8sproviderconfigpropertypassword"></a>

```typescript
public readonly password: string;
```

- *Type:* `string`

The password to use for HTTP basic authentication when accessing the Kubernetes master endpoint.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#password KubernetesProvider#password}

---

##### `proxyUrl`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.proxyUrl" id="cdktfcdk8scdk8sproviderconfigpropertyproxyurl"></a>

```typescript
public readonly proxyUrl: string;
```

- *Type:* `string`

URL to the proxy to be used for all API requests.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#proxy_url KubernetesProvider#proxy_url}

---

##### `token`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.token" id="cdktfcdk8scdk8sproviderconfigpropertytoken"></a>

```typescript
public readonly token: string;
```

- *Type:* `string`

Token to authenticate an service account.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#token KubernetesProvider#token}

---

##### `username`<sup>Optional</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.username" id="cdktfcdk8scdk8sproviderconfigpropertyusername"></a>

```typescript
public readonly username: string;
```

- *Type:* `string`

The username to use for HTTP basic authentication when accessing the Kubernetes master endpoint.

Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/kubernetes#username KubernetesProvider#username}

---

##### `cdk8sApp`<sup>Required</sup> <a name="cdktf-cdk8s.CDK8sProviderConfig.property.cdk8sApp" id="cdktfcdk8scdk8sproviderconfigpropertycdk8sapp"></a>

```typescript
public readonly cdk8sApp: App;
```

- *Type:* [`cdk8s.App`](#cdk8s.App)

---



