#!/bin/bash
# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0


set -ex

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE:-$0}")/.." && pwd)
CDKTF_VERSION=$1

if [ -z "$CDKTF_VERSION" ]; then
  echo "Usage: $0 <cdktf-version> <kubernetes-prebuilt-version>"
  exit 1
fi

echo "Updating to cdktf version $CDKTF_VERSION"
cd $PROJECT_ROOT

yarn

sed -i "s/cdktfVersion: \".*\",/cdktfVersion: \"$CDKTF_VERSION\",/" "$PROJECT_ROOT/.projenrc.ts"
sed -i "s/\"cdktf@>=.*\"/\"cdktf@>=$CDKTF_VERSION\"/" "$PROJECT_ROOT/.projenrc.ts"

npx projen

echo  "Please update @cdktf/provider-kubernetes in .projenrc.ts to a version compatible with cdktf $CDKTF_VERSION"
