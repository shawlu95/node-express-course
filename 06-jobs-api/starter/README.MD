### Highlight
* MongoDB unique field
* Hash password in mongoose middleware
* Foreign key in job reference user
* Nested destructuring to keep id clear
* Format user friendly error message
* Security feature when deploying app:
  - `helmet`: set various http header to prevent attack
  - `cors`: accessible from different domain (cross origin resource sharing)
  - `xss-clean`: sanitize user input, prevent cross site scripting attack
  - `express-rate-limit`: prevent DDOS

#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```

### Heroku
```bash
heroku login

# create new app (globally unique)
heroku create job-api-shaw
git remote -v

# set env var
heroku config:set JWT_TTL=1d

# deploy
git push heroku master

# clone from existing heroku app
# must np install and setup .env manually
heroku git:clone -a jobs-api-06
```

### Documentation
1. Export JSON from Postman
2. Import JSON to APIMAtic. Adjust group/folder.
3. Export API yaml documentation
4. Load yaml into Swagger Editor. Edit yaml.
5. Save yaml to root dir.
6. Use `swagger-ui-express` and `yamljs` to setup API path.