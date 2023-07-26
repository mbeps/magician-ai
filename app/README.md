
# **`app` Directory**
The app directory is a new feature introduced in Next.js 13 that allows you to create layouts, nested routes, and use server components by default . It works alongside the pages directory, which handles the file system-based routing.
Inside the app directory, you can create folders that correspond to the routes in your application. Each folder should contain a page.jsx file that defines the UI for that route. For example, `app/profile/settings/page.jsx` will render the `/profile/settings` route.
You can also create optional files inside each folder, such as:
 - `loading.jsx`: This file will wrap the page inside a React suspense boundary and show a loading component while the page is being fetched or rendered.
 - `error.jsx`: This file will wrap the page inside a React error boundary and show an error component if any error occurs inside the page.
 - `layout.jsx`: This file will define a layout component that can be used to wrap the page and provide common UI elements such as headers, footers, navigation, etc.

The app directory also supports nested layouts, which means you can have different layouts for different sections of your app. For example, you can have a root layout for the entire app, and then a nested layout for a specific route group.

The app directory leverages server components, which are a new feature of React that allows you to write components that run on the server and stream data to the client. This can improve performance, reduce bundle size, and enable new capabilities such as accessing databases or file systems directly from your components.

# **Folders in the `app` Directory**
These are some of the folders that you can create inside the app directory and their functionality:
 - `(site)`: This is a special folder that contains global files such as _document.jsx, _app.jsx, _error.jsx, etc. These files are similar to the ones in the pages directory, but they apply to the entire app instead of individual pages.
 - `actions`: This folder can contain files that define actions or mutations for your app state management. For example, you can use Zustand or Recoil to create global or local state atoms and selectors.
 - `api`: This folder can contain files that define API routes for your app. These are server-side functions that can handle requests from the client and return data or perform actions. For example, you can use Next.js API Routes or Next Connect to create RESTful or GraphQL endpoints.
 - `components`: This folder can contain files that define reusable UI components for your app. These are regular React components that can accept props and render elements. For example, you can use Chakra UI or Tailwind CSS to create styled components.
 - `context`: This folder can contain files that define React context providers for your app. These are components that can provide data or functionality to their descendants via the React context API. For example, you can use React Query or SWR to create data fetching and caching providers.
 - `hooks`: This folder can contain files that define custom hooks for your app. These are functions that can encapsulate logic and state and return values or functions to be used by other components. For example, you can use React Hook Form or Formik to create form validation hooks.
 - `libs`: This folder can contain files that define utility functions or libraries for your app. These are functions that can perform common tasks or calculations and return values or objects. For example, you can use Lodash or Date-Fns to create helper functions for arrays, objects, strings, dates, etc.
 - `types`: This folder can contain files that define type definitions or interfaces for your app. These are declarations that can describe the shape or structure of data or objects and help with type checking and code completion. For example, you can use TypeScript or PropTypes to create type annotations for your components, props, state, etc.

# **Routes**
The routes in the app directory are defined by the folders and files inside it. Each folder corresponds to a segment in the URL path, and each file corresponds to a component or function related to that route.

Each route folder has its own components folder which is only accessible to itself. This means that any component placed inside this folder will not be available to other routes unless it is explicitly imported.

To create dynamic routes in Next.js 13, you have to add brackets `[]` to a file or folder name. This indicates that the segment name will be dynamic and filled in at request time or prerendered at build time.
