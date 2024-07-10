import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Event: a
    .model({
      name: a.string().required(),
      type: a.enum(["Practice", "Class", "Tutoring"]),
      start: a.datetime().required(),
      end: a.datetime().required(),
      payment: a.float().required(),
      lat: a.float().required(),
      long: a.float().required(),
      radius: a.float().default(5),
      attended: a.boolean().required().default(false),
      athleteId: a.id().required()
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Athlete: a
    .model({
      events: a.hasMany("Event", "athleteId"),
      transactions: a.hasMany("Transaction", "athleteId"),
      // deposited: a.float().default(0), //balance = sum attended_events - deposited
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Transaction: a.model({
      athleteId: a.id(),
      amount: a.float().required(),
      isBankDeposit: a.boolean().required(),
  }).authorization((allow) => [allow.publicApiKey()]),
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
