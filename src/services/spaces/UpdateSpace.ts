import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseJSON } from "../shared/Utils";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const parsedBody = parseJSON(event.body);
    const spaceId = event.queryStringParameters["id"];
    const requestBodyValue = parsedBody["location"];

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        UpdateExpression: "set #location = :new",
        ExpressionAttributeValues: {
          ":new": {
            S: requestBodyValue,
          },
        },
        ExpressionAttributeNames: {
          "#location": "location",
        },

        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}
