import Path3D from "./components/Models/Path3D";
import SettingPage from './pages/settings/SettingPage';

let routes = [
  { path: "/", element: <Path3D /> },
  { path: "/setting", element: <SettingPage /> },
//   { path: "/*", element: <Error404 /> },
];

export default routes;


