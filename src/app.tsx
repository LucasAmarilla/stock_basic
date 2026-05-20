import { Router, useLocation, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import { Toaster } from "solid-sonner";
import Nav from "~/components/Nav";
import "./app.css";

function Root(props: any) {
  const location = useLocation();
  const navigate = useNavigate();

  createEffect(() => {
    const token = localStorage.getItem("token");
    const path = location.pathname;

    if (!token && path !== "/login") {
      navigate("/login", { replace: true });
    }

    if (token && path === "/login") {
      navigate("/", { replace: true });
    }
  });

  return (
    <>
      <Toaster richColors />
      {location.pathname !== "/login" && <Nav />}
      <Suspense>{props.children}</Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
}
