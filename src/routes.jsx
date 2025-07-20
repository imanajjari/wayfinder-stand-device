import Path3D from "./components/Models/Path3D";
import ReloadPage from "./pages/settings/reload.jsx/ReloadPage";
import SettingPage from './pages/settings/SettingPage';

let routes = [
  { path: "/", element: <Path3D /> },
  { path: "/setting", element: <SettingPage /> },
  { path: "/setting/reload", element: <ReloadPage /> },
//   { path: "/*", element: <Error404 /> },
];

export default routes;


