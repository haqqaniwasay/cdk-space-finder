import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  let result;
  if (event?.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];
    result = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: spaceId } },
      })
    );
    console.log("🚀 ~ result:", result);

    const unmarshalledItem = unmarshall(result.Item);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: unmarshalledItem }),
    };
  }

  result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  const unmarshalledItem = result?.Items?.map((item) => unmarshall(item));
  console.log("🚀 ~ result:", unmarshalledItem);

  return {
    statusCode: 200,
    body: JSON.stringify({ id: unmarshalledItem }),
  };
}
