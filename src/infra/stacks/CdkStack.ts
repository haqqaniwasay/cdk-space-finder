import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./PipelineStack";

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "AwesomePipeline", {
      pipelineName: "AwesomePipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "haqqaniwasay/cdk-space-finder",
          "main"
        ),
        commands: ["npm ci", "npx cdk synth"],
      }),
    });

    const teststage = pipeline.addStage(
      new PipelineStage(this, "PipelineTestState", { stageName: "test" })
    );
  }
}
