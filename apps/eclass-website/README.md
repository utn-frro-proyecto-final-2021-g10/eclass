# e-class Website
## Getting Started

  - Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

  - Make sure you have [`yarn`](https://yarnpkg.com/) installed. if not, run:
  ```
  npm install --global yarn
  ```

  - Copy .env.example to .env and fill in the values.

  - Run the following command to install dependencies:
  ```
    yarn install
  ```

  - Run the following command to start the development server:
  A docker container will be created started and seeded with basic data.
  ```
    yarn dev
  ```

  - Run the following command to visualize the database:
  ```
    yarn db
  ```

 - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.