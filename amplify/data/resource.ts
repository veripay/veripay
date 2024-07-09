import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Event: a
    .model({
      id: a.id(),
      name: a.string(),
      type: a.string(),
      start: a.datetime(),
      end: a.datetime(),
      payment: a.float(),
      lat: a.float(),
      long: a.float(),
      radius: a.float()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Athlete: a
    .model({
      id: a.id(), //FIXME Is this right for cognito id ref?
      attended_events: a.integer(),
      missed_events: a.integer(),
      deposited: a.float(), //balance = sum attended_events - deposited
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
