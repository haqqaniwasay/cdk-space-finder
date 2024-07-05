import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NayaLambdaStack } from "./NayaLambdaStack";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new NayaLambdaStack(this, "NayaLambdaStack", {
      stageName: props.stageName,
    });
  }
}
