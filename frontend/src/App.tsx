import AppRoutes from "./modules/routings/AppRoutes";
import { Agentation } from "agentation";

const ENV = (import.meta as ImportMeta & { env: { VITE_ENV: string } }).env
  .VITE_ENV;

export default function App() {
  return (
    <>
      <AppRoutes />
      {ENV === "development" && <Agentation />}
    </>
  );
}
