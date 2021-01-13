# picsHub
The full app is hosted on heroku and can be accessed through the link: https://pics-hub.herokuapp.com/

## Installation of Node App

### 1. Install

```Bash
# From the root of the directory
npm install
```

### 2. Loading environment variables
The following variables are required to run the app

## MongoDB
password={yourdbpassword}
dbname={yourdbname}

## Redis
REDIS_PORT={yourRedisPort}
REDIS_HOST={yourRedisHost}
REDIS_PASSWORD={yourRedisPassword}

## JWT
ACCESS_TOKEN_SECRET={yourRandomAccessTokenSecret}
REFRESH_TOKEN_SECRET={yourRandomRefreshTokenSecret}

### 3. Running Server

```Bash
npm start
```
