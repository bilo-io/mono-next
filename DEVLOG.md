# Devlog

## Day 1

- Comms: Initial questions regarding tech stack
- Setup projects
  - Frontend: NextJS (Typescript)
  - Backend: NestJS (Typescript)
  - Database: Postgres
  - ORM: TypeORM (Typescript)

- Create a vertical slice (frontend page, backend module (controller, service, entity, repository, etc.))

## Day 2

- Comms: Additional questions about strategy for problem statement
- Fleshed out the core UX framework & components
  - Components: (Sidenav, Modals, Toasts, custom react hook for data fetching)
- Full CRUD for a "users" slice

AI Usage: Generating some code, specifically
- Database: `init` & `seed` scripts using TypeORM, to quickly generate realistic/meaningful data.
- Components: Rather than using a specific component library, I generated a few custom components as I needed them, specifying the props and interface to make them simple and consistent

## Day 3

- **Research**:
  - User Roles & Permission management
    - [User Role and Permission Management](https://frontegg.com/guides/user-role-and-permission)
    - [Role design best practices](https://www.activityinfo.org/support/docs/permissions/role-design-best-practices.html)
    - [User Role and Permission Design: How to Model IT Access](https://www.tenfold-security.com/en/permission-roles/)
    - [Best Practices for Designing User Roles and Permissions System](https://www.aalpha.net/blog/best-practice-for-designing-user-roles-and-permission-system/)
    - [Case study: Designing roles and permissions](https://medium.com/design-bootcamp/designing-roles-and-permissions-ux-case-study-b1940f5a9aa)
  - Best UX for user roles & permissions
    - [Dribble: Roles and Permissions UI](https://dribbble.com/search/roles-and-permissions-ui)
    - [Behance: User Permissions](https://www.behance.net/search/projects/user%20permissions)

- Further investigation:
  - After covering the fundamentals I then checked with ChatGPT to see what the pros and cons of the problem statement were, with a full breakdown of these:
  

| Strategy             | Description                                                                                | Pros                                                                                             | Cons                                                                                      |
| :------------------- | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| 1. Adjacency List    | Each record stores a reference to its parent node (e.g. `parentId` column).                | - Simple schema and easy to modify. <br> - Good for shallow hierarchies.                         | - Recursive queries are slow. <br> - Hard to fetch full subtrees efficiently.             |
| 2. Nested Set        | Stores left and right boundaries for each node in the hierarchy (preorder traversal).      | - Very fast read access to subtrees. <br> - Great for static hierarchies.                        | - Expensive to insert or move nodes. <br> - Complex to maintain programmatically.         |
| 3. Materialized Path | Each node stores its full path from root as a delimited string (e.g. `/ceo/manager/lead`). | - Simple to implement and understand. <br> - Easy to get ancestors with LIKE queries.            | - Refactoring paths is costly. <br> - Limited support for deep queries in some databases. |
| 4. Closure Table     | Uses a separate table to store all ancestor-descendant pairs with depth level.             | - Super fast for querying any depth (descendants or ancestors). <br> - Supports complex queries. | - Extra table and joins add complexity. <br> - Slightly more overhead on writes.          |

- **Deciding on approach**:
  - It was stated that the system needs to work for a larger set of data efficiently (10k)
  - I decided to use Use Closure Table with `@Tree('closure-table')` because:
    - It’s built-in to TypeORM.
    - Fast to query both up and down.
    - Less boilerplate to maintain than **nested sets** or **materialized paths**.
    - Fits the need to handle users with multiple roles.
