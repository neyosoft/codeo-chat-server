This is a Node.js project.

This application showcases the implementation of both one-to-one and group chat functionalities.

## Getting Started

First install the dependencies

```bash
npm install
# or
yarn
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
```

To configure the server PORT

```bash
cp .env.example > .env
```

By default, the application will start on port 9900
[http://localhost:9900](http://localhost:9900)

### Future improvement

-   [ ] Implement user registration and authentication to ensure secure access to the messaging system.
-   [ ] Create APIs/routes for managing contacts (e.g., add, remove, list).
-   [ ] Implement real-time updates for incoming messages.
-   [ ] Chat validation
-   [ ] Error handling
-   [ ] Chat persistence to Database like Posgress or MongoDB
-   [ ] Write unit tests and integration tests
