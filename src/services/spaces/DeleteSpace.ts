import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup, parseJSON } from "../shared/Utils";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify("You are not allowed to access this resource"),
    };
  }

  if (event.body) {
    const parsedBody = parseJSON(event.body);

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
      statusCode: 200,
      body: JSON.stringify({ message: "Deleted space successfully." }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}
