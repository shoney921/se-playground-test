import { RouterProvider } from "react-router-dom";
import root from "./router/root";

function App(): JSX.Element {
  return <RouterProvider router={root} />;
}

export default App;
