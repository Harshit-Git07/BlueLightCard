## Datadog Synthetic tests and monitors

This project provides observability as code for our Cognito authentication and basic user flows on the webpage ( production )
The goal is to detect incidents early 

As of now we implement :
- API test that does cognito authentication on one of the production user pools
- Browser test on marketing preferences selection
- Browser test on basic user floe ( selecting superdry discount and copying the code )
With every test, we have also created a monitor based on anomaly detection

### Utils
generate-cognito-secret-hash: The secret hash is needed in order to authenticate to cognito. Just update the values in the script and run it:
```node generate-cognito-secret-hash.mjs```

