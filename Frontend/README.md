# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Role-Based Access Control (RBAC)

This project now implements role-based authorization on both client and server.

### Roles

- `HR` – full administration rights (create/update/delete across modules)
- `Manager` – elevated permissions (view and manage employees, attendance, reviews)
- `Employee` – basic access (view own data, submit attendance/leave)

### Frontend

- `AuthContext` stores JWT and role, synced with localStorage.
- `ProtectedRoute` accepts an `allowedRoles` prop and redirects unauthorized users to `/unauthorized`.
- Sidebar links and page buttons are conditionally rendered based on role.
- The signup form loads available roles from `/api/roles` and automatically logs in new users.

### Backend

- A `role.middleware.js` function checks `req.user.role` against permitted roles.
- All protected routes mount `authMiddleware` (JWT verification) and appropriate role restrictions.
- `GET /api/roles` is public for dropdowns; other role management endpoints require `HR`.

> Remember to seed the `roles` table with the initial values (`HR`, `Manager`, `Employee`) in your database.
