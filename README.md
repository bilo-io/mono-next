# RBAC System Design

This application is a monorepo, consisting of the following tech stack:

| Tech     | Stack    | Description                           |
| :------- | :------- | :------------------------------------ |
| NextJS   | Frontend | A React & Typescript project          |
| NestJS   | Backend  | A Node, Typescript API framework      |
| Postgres | Database | A Database technology to persist data |

## Quickstart

To start everything concurrently in the monorepo, run the following in the root:

```
pnpm dev
```

This runs:

- the `/src/api` on [http://localhost:8000](http://localhost:8000)
- the `/src/app` on [http://localhost:3000](http://localhost:3000)

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
| Tests                   | 🟡Optional  | One or two to show approach                                  |
