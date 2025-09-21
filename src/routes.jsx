import { lazy } from "react";

const Navigator3DPage = lazy(() => import("./pages/navigator/Navigator3DPage"));
const UpdateDataPage = lazy(() => import("./pages/settings/UpadateDataPage"));
const SettingPage = lazy(() => import("./pages/settings/SettingPage"));
const ReloadPage = lazy(() => import("./pages/settings/ReloadPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  { path: "/", element: <Navigator3DPage /> },
  { path: "/resend", element: <UpdateDataPage /> },
  { path: "/setting", element: <SettingPage /> },
  { path: "/setting/reload", element: <ReloadPage /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
