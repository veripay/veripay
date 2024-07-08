import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

/*
References:
https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/
https://docs.amplify.aws/react/build-a-backend/data/data-modeling/
*/

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  EchoResponse: a.customType({
    content: a.string(),
    executionDuration: a.float(),
  }),

  echo: a
    .query()
    .arguments({ content: a.string() })
    .returns(a.ref("EchoResponse"))
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.function(
        defineFunction({
          entry: "./echo_handler.ts",
        })
      )
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
