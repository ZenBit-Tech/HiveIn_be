<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

![CICD](https://github.com/ZenBit-Tech/HiveIn_be/actions/workflows/build-and-deploy.yml/badge.svg)

## Description

Get-Job is a freelancer platform created as an internship project at Zenbit Tech

## 1. Getting Started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of NodeJS and NPM
- A MySQL database installed locally. Or you may use the provided docker-compose file.

[Docker](https://www.docker.com/) may also be useful for advanced testing and image building, although it is not required for development.

### 1.2 Install instructions

Clone the project and install its dependencies:

```bash
$ cd HiveIn_be
$ git clone git@github.com:ZenBit-Tech/HiveIn_be.git
$ npm install
```

### 1.3 Env configuration

Once the dependencies are installed, you can now configure your project by creating a new **.env** file containing your environment variables used for development.

```bash
$ cp .env.example .env
$ nano .env
```

For a standard development configuration, you can leave the default values for all variables under the API, Client side and Upload sections.

Next comes to the Database configuration: change everything according to your own database setup.

If you wish to leave everything as default, run docker compose to create your database instance and phpMyAdmin, a tool intended to handle MySQL administration through the web:

```bash
$ docker-compose up
```

Now you can access your database information with phpMyAdmin, which is also running in the same container by accessing localhost using port 8080

Last but not least, define a JWT_SECRET to sign the JWT tokens or leave the default value in a development environment.

## 2. Launch and discover

You are now ready to launch the NestJS application using the command below.

```bash
# Perform migrations in your database using TypeORM
$ npm run typeorm:run-migrations

# development
$ npm run start

# watch mode
$ npm start:dev

# production mode
$ npm run start:prod
```

## 3. Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 4. API documentation

Head over the link [http://localhost:4000/api/](http://localhost:4000/api/) to see the documentation.

Head over the link [http://localhost:4000/api-json/](http://localhost:4000/api-json/) to download the documentation.

### 4.1 Restricted routes

Most of the routes are protected by authorization (1)

[https://prnt.sc/zysozp](https://prnt.sc/zysozp)

Proceed with auth first and paste the accessToken to the field, by pressing the button `Authorize` (2) and (3)

[https://prnt.sc/zytafk](https://prnt.sc/zytafk)

## 5. DB Migrations

### 5.1. What is going to be migrated

To check what SQL queries `schema:sync` (next command) is going to run use:

`npm run typeorm:schema:log`

### 5.2. First time only

To synchronize a new database with the current schema use:

`npm run typeorm:schema:sync`

Be careful running this command in production - schema sync may cause data loss if you don't use it wisely. Check which SQL queries it will run before running on production.

### 5.4. Check if any migrations exist to run

`npx typeorm migration:show`

[X] = Migration has been ran

[ ] = Migration is pending/unapplied

This command also **returns an error** code if there are **unapplied migrations**.

### 5.5. Generate migration

Once you change the database schema, it's important to generate a new migration with either through TypeORM CLI or manually

`npm run typeorm:generate-migration --name=TableRefactor`
`npm run typeorm:create-migration --name=TableRefactor`

### 5.6. Run migrations

To execute all pending migrations use following command:

`npm run typeorm:run-migrations`

This command will undo only the last executed migration. You can execute this command multiple times to revert multiple migrations. Learn more about [migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)

### 5.7. Revert migrations

To revert the most recently executed migration use the following command:

`npm run typeorm:revert-migration`

https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md#generate-a-migration-from-existing-table-schema

## 6. Deployment Information

The website is currently being hosted in a Digital Ocean server.
- Domain: http://getjobhivein.me

We're using external services such as a MySQL RDS, Redis and a S3 bucket.
![](https://i.imgur.com/ry7Uks1.png)
