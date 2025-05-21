# RBAC System Design

A fullstack web application implementing RBAC.

## [For Project Report: Click here ](./REPORT.md)

## Tech Stack

This application is a monorepo, and as indicated by the lock file, uses `pnpm` as the package manager.

The project consists of the following tech stack:

| Tech                                                      | Stack       | Description                                                   |
| :-------------------------------------------------------- | :---------- | :------------------------------------------------------------ |
| [NextJS](https://nextjs.org/)                             | Frontend    | A React & Typescript project                                  |
| [NestJS](https://nestjs.com/)                             | Backend     | A Node, Typescript API framework                              |
| [Postgres](https://www.postgresql.org/)                   | Database    | A Database technology to persist data                         |
| [TypeORM](https://typeorm.io/)                            | ORM         | Object Relational Mapper to interface with DB from Typescript |
| [react-icons](https://react-icons.github.io/react-icons/) | npm package | A wrapper around many popular icon fonts                      |
| [Postman](https://www.postman.com/)                       | API testing | An app to test, document and mock APIs                        |

> **Hosting:**
>
> While this was not requested by the assessment, it was partially set up using the following "free" tools:
>
> | Tech                            | Stack             | Description                                    |
> | :------------------------------ | :---------------- | :--------------------------------------------- |
> | [Koyeb](https://www.koyeb.com/) | hosting: API      | Platform with a free plan to host APIs         |
> | [Neon.Tech](https://neon.tech/) | hosting: Database | Platform with a free plan to host Postgres DBs |
> | [Vercel](https://vercel.com/)   | hosting: Frontend | Platform with a free plan for hosting JS apps  |

## Quickstart

To start everything concurrently in the monorepo, run the following in the root:

```sh
pnpm dev
```

This runs:

- the `/src/api` on [http://localhost:8000](http://localhost:8000)
- the `/src/app` on [http://localhost:3000](http://localhost:3000)

> Note: this uses [concurrently](https://www.npmjs.com/package/concurrently) to run the respective `pnpm dev:api` and `pnpm dev:app` scripts.

## Design Principles

- Role hierarchy with parentRoleId
- Users can hold multiple roles (via UserRole)
- Permissions attach to roles and inherit downwards
- Downstream visibility: recursive traversal of Role -> children to determine access

## Priorities

| Feature                 | Priority   | Path                                                        |
| :---------------------- | :--------- | :---------------------------------------------------------- |
| Downstream Access       | ✅ Top      | `src/api` logic + `src/app` interface                       |
| Role Hierarchy          | ✅ Core     | Database + backend logic                                    |
| Multiple Roles per User | ✅ Required | Prisma schema + backend logic                               |
| Permission Inheritance  | ✅ Required | Recursive access logic                                      |
| Functional UI           | ✅ Required | src/app/src – don’t overbuild, just clean                   |
| Docs                    | ✅ Required | High-impact, do this as you go in README.md                 |
| Scalability Notes       | ✅ Required | Add to root README.md and inline as comments where relevant |
| Tests                   | 🟡Optional  | One or two to show approach                                 |
