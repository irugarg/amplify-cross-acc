import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { RemovalPolicy } from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineactions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { BuildEnvironmentVariableType } from '@aws-cdk/aws-codebuild';

interface ConfigProps extends cdk.StackProps {
  github: {
    owner: string;
    repository: string;
  };
}
export class CICDDevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConfigProps) {
    super(scope, id, props);

    // Creating S3 for React App
    const bucketHosting = new s3.Bucket(this, 'bucketReactAoD', {
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Creating Pipeline
    const pipelineDev = new codepipeline.Pipeline(this, 'pipelineDevAoD', {
      pipelineName: 'DevAoD',
      restartExecutionOnUpdate: true,
    });

    // Token from github
    const gitHubOAuthToken = cdk.SecretValue.secretsManager('GitHubToken', {
      jsonField: 'GitHubToken',
    });

    // CodePipeline artifacts for Dev
    const outputDevSource = new codepipeline.Artifact();
    const outputDevWebsite = new codepipeline.Artifact();

    // Adding Source Stage to DEV pipeline
    pipelineDev.addStage({
      stageName: 'Source',
      actions: [
        new codepipelineactions.GitHubSourceAction({
          actionName: 'SourceDevAod',
          owner: props.github.owner,
          repo: props.github.repository,
          oauthToken: gitHubOAuthToken,
          output: outputDevSource,
          branch: 'dev',
        }),
      ],
    });

    // CodeBuild role
    const codeBuildRole = new iam.Role(this, 'codeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      description: 'Custom Role',
    });

    // Granting Permissions
    codeBuildRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    );

    // CodeBuild for Pipeline
    const codeBuildDev = new codebuild.PipelineProject(
      this,
      'codeBuildDevAoD',
      {
        buildSpec: codebuild.BuildSpec.fromSourceFilename(
          './buildspec-dev.yml',
        ),
        role: codeBuildRole.withoutPolicyUpdates(),
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2,
        },
      },
    );

    // Adding Codebuild to DEV pipeline
    pipelineDev.addStage({
      stageName: 'Build',
      actions: [
        new codepipelineactions.CodeBuildAction({
          actionName: 'BuildDevAod',
          project: codeBuildDev,
          input: outputDevSource,
          outputs: [outputDevWebsite],
          environmentVariables: {
            S3_BUCKET: {
              type: BuildEnvironmentVariableType.PLAINTEXT,
              value: bucketHosting.s3UrlForObject(),
            },
          },
        }),
      ],
    });

    // Adding CodeDeploy to DEV pipeline
    pipelineDev.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipelineactions.S3DeployAction({
          actionName: 'DeployDevAod',
          bucket: bucketHosting,
          input: outputDevWebsite,
        }),
      ],
    });

    // Creating OAI for Dev Environment
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');
    // Gratind OAI Permissions to read Bucket
    bucketHosting.grantRead(oai);

    // Cloudront pointing to S3 to Dev Environment
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
      exportName: 'OutputExportName',
    });
  }
}
