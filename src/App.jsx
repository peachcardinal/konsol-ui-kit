import AssignmentsPage from "./pages/AssignmentsPage/AssignmentsPage";
import ComponentsPage from "./pages/ComponentsPage/ComponentsPage";

function App() {
  const isComponentsPage = window.location.pathname === "/components";
  return isComponentsPage ? <ComponentsPage /> : <AssignmentsPage />;
}

export default App;
