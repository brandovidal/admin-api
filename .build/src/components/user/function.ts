import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'

import UserController from './controller'

const controller = new UserController()

export const getUsers = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`)

  const { count, total, users } = await controller.getUsers()

  return {
    statusCode: 200,
    body: JSON.stringify({
      count,
      total,
      users
    })
  }
}
