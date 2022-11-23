# BLC Monorepo

### Dependencies

 - husky

## Getting started
To start the backend and the database, first rename the `.env.example` file to `.env`.
Then run the following:
```
docker compose up -d
```

You should be able to connect to MySQL with the following URL.
```
mysql://:example@127.0.0.1/blc
```