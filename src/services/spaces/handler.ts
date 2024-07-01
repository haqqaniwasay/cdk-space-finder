import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

const ddbClient = new DynamoDBClient({});

const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("🚀 ~ handler ~ event:", event);

  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const result = await getSpaces(event, ddbClient);
        return result;
      case "POST":
        const response = await postSpaces(event, ddbClient);
        return response;
      case "PUT":
        const putResponse = await updateSpace(event, ddbClient);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    console.log("🚀 ~ error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
};

export { handler };
