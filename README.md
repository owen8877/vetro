## Dev Notes
### React.js tools
- https://github.com/uber/react-digraph (deprecated)
- https://handsonreact.com/docs/labs/react-tutorial-typescript (deprecated)
- https://blog.logrocket.com/getting-started-bun-react/ ⇒ `bun create vite .`
- https://github.com/airbnb/visx
- https://github.com/graphql/graphql-http
- server GraphQL: https://www.graphile.org/postgraphile/usage-library/
- https://create-react-app.dev/docs/proxying-api-requests-in-development/
- https://react.dev/reference/react/Component
- https://stackoverflow.com/questions/77486735/docker-with-vite-env-variables-are-undefined-inside-the-docker-container

## Auto-generated by Vite
### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list