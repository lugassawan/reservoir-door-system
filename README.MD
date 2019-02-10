# RESERVOIR DOOR SYSTEM

This application is made to manage reservoir door through device that connect to reservoir

## Install

```
npm install

npm start
OR
npm run dev               //Running through nodemon
```

## Basic Usage

The APIs are designed around RESTful principles, and return JSON payloads in response to HTTP requests. For example, accesing the API using curl.

```
curl -X {HTTP Method} -H "Content-Type: application/json" -F "key1=value" -F key2=value" "url"
```

Authentication User

```
res.header('x-auth', token);
```

Authorization Device

```
res.header('Api-Token', ApiKey:DeviceCode);
```

## API LIST

Users

```
- GET /users                = Show greeting message
- POST /users               = Register user
- GET /users/me             = Get user data
- POST /users/login         = Login user to system
- DELETE /users/me/token    = Logout user from system
```

Projects

```
- GET /projects             = Show all projects by user
- POST /projects            = Create a new project
- GET /projects/:id         = Show a project doc
- PATCH /projects/:id       = Update a project name
- DELETE /projects/:id      = Delet a project
```

Devices

```
- GET /projects/:projectId/devices             = Show all devices by project
- POST /projects/:projectId/devices            = Create a new device
- GET /projects/:projectId/devices/:id         = Show a device doc
- PATCH /projects/:projectId/devices/:id       = Update a device name
- DELETE /projects/:projectId/devices/:id      = Delet a device
```

Data

```
- POST /devices/:id                            = Store data from device
```

## Test

```
npm test
npm run test-watch    //Running through nodemon
```

## License

**The MIT License (MIT)**

Copyright © 2018 Lugas
