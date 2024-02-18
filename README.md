# Test Samples Tracker

An application where users will be able to create test samples and track their placement.

## Basic Functionalities

- User can insert a list of test tubes and they will be assigned to racks by a sorting algorithm implemented based on certain constraints
- User can view a list of racks containing test samples
- User can view a list of test samples assigned to each rack

## Technologies used

- `Next.js`
- `TypeScript`
- `Tailwindcss`
- `Postgres`
- `Prisma`

## Setup Guide

- Clone this repository in your work directory
- Run `npm install` to install project dependencies
- Add a `.env` file to the root of the project
- Create a Postgres database and add its URL to the `.env` file in this format `DATABASE_URL=your_database_url` so it can be accessed as `process.env.DATABASE_URL` in the application. Refer to the `.env.example` file for the list of environment variables.
- Run `npx prisma migrate dev` to migrate schemas/tables to your database
- Run `npx prisma db seed` to seed your database with some data. After that, you can run `npx prisma studio` which launches Prisma studio in your browser to enable you visualize your database tables and data

Run the development server:

```bash
npm run dev
```

Run automated tests:

```bash
npm run test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see use the application.
