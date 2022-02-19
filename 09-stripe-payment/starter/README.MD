## Note
* Do not send request to Stripe from front end. Send intent request to node server.
  - node server verifies price, return a secret to front end
  - frond end makes a post request to stripe, using the secret
* Create account at `stripe.com`
* Stripe accepts smallest unit of currency (send 10000 for 100 dollars).