import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineactions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { RemovalPolicy } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

interface ConfigProps extends cdk.StackProps {
  github: {
    owner: string;
    repository: string;
  };
}
export class CICDProdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConfigProps) {
    super(scope, id, props);

    // Creating S3 for React App
    const bucketHosting = new s3.Bucket(this, 'bucketReactAoD', {
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // CodePipeline for master ENV
    const pipelineMaster = new codepipeline.Pipeline(this, 'pipelineMaster', {
      pipelineName: 'MasterAoD',
      restartExecutionOnUpdate: true,
    });

    // CodeBuild role
    const codeBuildRole = new iam.Role(this, 'codeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      description: 'Role for CodeBuild have the right permissions',
    });

    // Granting Permissions
    codeBuildRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    );

    // Creating Artifact for master ENV
    const outputMasterSources = new codepipeline.Artifact();
    const outputMasterWebsite = new codepipeline.Artifact();

    // CodeBuild for PROD ENV
    const codeBuildMaster = new codebuild.PipelineProject(
      this,
      'CodeBuildMaster',
      {
        buildSpec: codebuild.BuildSpec.fromSourceFilename(
          './buildspec-prod.yml',
        ),
        role: codeBuildRole.withoutPolicyUpdates(),
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2,
        },
      },
    );

    // Token from github
    const gitHubOAuthToken = cdk.SecretValue.secretsManager('GitHubToken', {
      jsonField: 'GitHubToken',
    });

    // Source for pipeline Master
    pipelineMaster.addStage({
      stageName: 'Source',
      actions: [
        new codepipelineactions.GitHubSourceAction({
          actionName: 'SourceMasterAod',
          owner: props.github.owner,
          repo: props.github.repository,
          oauthToken: gitHubOAuthToken,
          output: outputMasterSources,
          trigger: codepipelineactions.GitHubTrigger.WEBHOOK,
          branch: 'master',
        }),
      ],
    });

    // Approval for pipeline Master
    pipelineMaster.addStage({
      stageName: 'Approval',
      actions: [
        new codepipelineactions.ManualApprovalAction({
          actionName: `Manual-Approval`,
          additionalInformation: 'This deploy is scary, are u sure?!',
          runOrder: 1,
        }),
      ],
    });

    // Build Master
    pipelineMaster.addStage({
      stageName: 'Build',
      actions: [
        new codepipelineactions.CodeBuildAction({
          actionName: 'BuildMasterAod',
          project: codeBuildMaster,
          input: outputMasterSources,
          outputs: [outputMasterWebsite],
          environmentVariables: {
            AmplifyEnvProd: {
              value: 'prod',
            },
          },
        }),
      ],
    });

    // Adding CodeDeploy to Master pipeline
    pipelineMaster.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipelineactions.S3DeployAction({
          actionName: 'DeployMasterAod',
          bucket: bucketHosting,
          input: outputMasterWebsite,
        }),
      ],
    });

    // Creating OAI for Master Environment
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');
    // Gratind OAI Permissions to read Bucket
    bucketHosting.grantRead(oai);

    // Cloudront pointing to S3 to Master Environment
    const cloudfrontT = new cloudfront.CloudFrontWebDistribution(
      this,
      'CloudFront',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucketHosting,
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
      value: cloudfrontT.domainName,
      exportName: 'CFEndpoint:',
    });
  }
}
