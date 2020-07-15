#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CICDDevStack } from '../lib/cdk-stack-cicd-dev';
import { CICDProdStack } from '../lib/cdk-stack-cicd-prod';
import { Config } from '../config/env';

const app = new cdk.App();

// // eslint-disable-next-line no-new
// new ProdAccStack(app, 'ProdAccStack', ProdConfig);
// eslint-disable-next-line no-new
new CICDDevStack(app, 'CICDDevStack', Config);
// eslint-disable-next-line no-new
new CICDProdStack(app, 'CICDProdStack', Config);
