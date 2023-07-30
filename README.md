# be-assessment (Mohamed ELgendy - solution)

# URLs-monitor
RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## How to install
```bash
git clone https://github.com/M-R-Elgendy/URLs-monitor.git
```

## Install dependencies
```bash
npm install
```

## Set environment variable
```bash
NODE_ENV = "development"
PORT = "3000"

DB_HOST = ''
DB_PORT = ''
DB_NAME = ''
DB_USERNAME = ''
DB_PASSWORD = ''
DB_MAX_CENNECTIONS = 1


EMAIL_HOST = ''
EMAIL_PORT = ''
EMAIL_USERNAME = ''
EMAIL_PASSWORD = ''

JWT_TOKEN_SECRET = "bosta"
```

## Starting the Server
```bash
npm run dev  # For development environment it will run nodemon app.js
# or
npm run production  # For production environment it will run node app.js
```

## Documentation
```
https://documenter.getpostman.com/view/19039814/2s9Xxtwuwm
```

Go to [Postman online documentaion](https://documenter.getpostman.com/view/19039814/2s9Xxtwuwm)

