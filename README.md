## Veripay Amplify Mono-Repo

This repo contains the frontend and backend code for Veripay.
It uses AWS Amplify for hosting, auth, API, and the database.

### Front-End Local Dev

 1. Go to Amplify console
 2. Click on "main" deployment
 3. Click deployments
 4. Press "Download amplify_outputs.json".

### Back-End Local Dev

1.

```bash
npx ampx sandbox
```

### Deploying to AWS

Simply pushing to the main branch will deploy the updated
code.

### Documentation

Refer the [Amplify Document for React](https://docs.amplify.aws/react/).
