### Note
* No database
* JWT: JSON web token (see detail `jwt.io`)
* Simply demonstrate authentication
* Do not differentiate register vs login
* JWT passing validation means it's the same token we sent to client
* Server is stateless. Doesn't remember previous request from client
* Server uses a **secret** to sign the header and payload.
* Send encoded header, payload, and signature to front end.
* Front end attach token in `Authorization: bearer <token>`
* Best practice, if failed to verify, delete token from browser storage

### In this example
* When login, server returnes a signed JWT
* When access dashboard, user request must ontain signed JWT
* A custom auth middleware verify the JWT. If successful, user info is attached to `req`
* Write custom error subclass