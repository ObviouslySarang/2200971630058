# URL Shortener Microservice

A professional Node.js microservice for shortening URLs, featuring a custom logging middleware that sends logs to a remote test server. Built for coding rounds and technical evaluations.

## Features

- Shorten long URLs with optional custom shortcodes
- Default and custom validity periods for short links
- Redirects to original URLs
- Tracks click analytics (count, timestamp, referrer, IP)
- RESTful API with robust error handling
- Mandatory use of custom logging middleware (no console.log)

## Folder Structure

```
LoggingMiddleware/
  logger.js         # Custom logging middleware
UrlShortener/
  urlShortener.js   # Main microservice code
```

## Setup

1. Install dependencies:
   ```sh
   npm install express axios
   ```
2. Start the microservice:
   ```sh
   node UrlShortener/urlShortener.js
   ```

## API Endpoints

### Create Short URL

- **POST** `/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com/very/long/url",
    "validity": 30, // (optional, minutes, default 30)
    "shortcode": "custom1" // (optional, must be unique)
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "http://localhost:4000/custom1",
    "expiry": "2025-06-27T12:34:56.000Z"
  }
  ```

### Redirect to Original URL

- **GET** `/:code`
- Redirects to the original URL if valid and not expired.

### Get Short URL Statistics

- **GET** `/shorturls/:code`
- **Response:**
  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "created": "2025-06-27T12:00:00.000Z",
    "expiry": "2025-06-27T12:30:00.000Z",
    "totalClicks": 2,
    "clicks": [
      {
        "timestamp": "2025-06-27T12:10:00.000Z",
        "referrer": null,
        "geo": "::1"
      }
    ]
  }
  ```

## Logging

All application logs are sent to the remote test server using the custom middleware in `LoggingMiddleware/logger.js`.

## Notes

- No authentication required for API access.
- All data is stored in-memory (for demo/testing only).
- For any issues, please contact the project maintainer.
