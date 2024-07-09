import { defineAuth } from '@aws-amplify/backend';

// https://docs.amplify.aws/gen2/build-a-backend/auth
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: true
    }
  }
});
