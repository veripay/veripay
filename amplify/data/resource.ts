import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Event: a
    .model({
      id: a.id(),
      name: a.string().required(),
      type: a.string().required(),
      start: a.datetime().required(),
      end: a.datetime().required(),
      payment: a.float().required(),
      lat: a.float().required(),
      long: a.float().required(),
      radius: a.float().default(5),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Athlete: a
    .model({
      id: a.string(),
      attended_events: a.id().array().default([0]),
      deposited: a.float().default(0), //balance = sum attended_events - deposited
    })
    .authorization((allow) => [allow.publicApiKey()]),
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
