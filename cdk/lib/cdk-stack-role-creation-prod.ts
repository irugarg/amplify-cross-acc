import * as cdk from '@aws-cdk/core';
import * as IAM from '@aws-cdk/aws-iam';
import * as S3 from '@aws-cdk/aws-s3';
import * as CLOUDFRONT from '@aws-cdk/aws-cloudfront';
import { RemovalPolicy } from '@aws-cdk/core';
import * as SSM from '@aws-cdk/aws-ssm';

export interface ConfigProps extends cdk.StackProps {
  ProdAcc: string;
  DevAcc: string;
}

export class ProdAccStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ConfigProps) {
    super(scope, id, props);

    // CrossAccount Role
    const role = new IAM.Role(this, 'CrossAccRole', {
      assumedBy: new IAM.AccountPrincipal(props.DevAcc),
      description:
        'Role for codebuild from Dev Account have the right permissions',
      roleName: 'CrossAccountRole',
    });

    // Granting Permissions
    role.addToPolicy(
      new IAM.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    );

    // S3 as Hosting
    const bucketHostingProd = new S3.Bucket(this, 'bucketHosting', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Creating OAI
    const oai = new CLOUDFRONT.OriginAccessIdentity(this, 'OAI');

    // Grantind OAI Permissions to read Bucket
    bucketHostingProd.grantRead(oai);

    // Putting the bucketHostingProd URL into SSM
    // eslint-disable-next-line no-new
    new SSM.StringParameter(this, 'Parameter', {
      parameterName: 'bucketNameProd',
      description: 'Description for your parameter',
      stringValue: bucketHostingProd.s3UrlForObject(),
    });

    // Cloudfront pointing to S3
    const cloudfront = new CLOUDFRONT.CloudFrontWebDistribution(
      this,
      'CloudFront',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucketHostingProd,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
      },
    );

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'OutputId', {
      value: cloudfront.domainName,
      exportName: 'OutputExportName',
    });
  }
}
