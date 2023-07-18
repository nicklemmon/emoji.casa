import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GroupsPage, LandingPage } from './pages'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/groups', element: <GroupsPage /> },
])

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
