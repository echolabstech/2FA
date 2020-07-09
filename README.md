# 2FA
## Tech Stack
* web application server
  * express-js - provides routing and functionality through middleware
* 2FA
  * [otplib](https://github.com/yeojz/otplib) -  a nodejs implementation of HOTP (HMAC-Based One-Time Password) and TOTP (Time-Based One-time Password) algorithms.
* UI
  * react (maybe) - js component based UI framework that utilizes parent-child relationships to pass UI state changes down from parent to child which initiates asynchronous DOM updates to a virtual dom
  * react material design - UI component library that provides structure (html), styling (css) and behavior (js)
