import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.body) {
    const parsedBody = JSON.parse(event.body);

    const requestBodyValue = parsedBody["id"];

    await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: requestBodyValue },
        },
      })
    );

    return {
      statusCode: 204,
      body: JSON.stringify({ message: "Deleted space successfully." }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}
