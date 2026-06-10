import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-white transition "
      : "border-transparent hover:border-gray-200 transition";
  return (
    <nav class="bg-linear-to-br from-emerald-500 to-emerald-700">
      <div class="container mx-auto flex items-center justify-between p-3">
        <a href="/" class="text-white text-2xl font-bold">
          SCS
        </a>

        <ul class="flex items-center text-white ">
          <li class="w-0.5 h-5 rounded-2xl bg-white"></li>
          <li class={`border-b-2  ${active("/products")} mx-1.5 sm:mx-6`}>
            <a href="/products">Productos</a>
          </li>
          <li class={`border-b-2 ${active("/suppliers")} mx-1.5 sm:mx-6`}>
            <a href="/suppliers">Provedores</a>
          </li>
          {/* <li class={`border-b-2 ${active("/users")} mx-1.5 sm:mx-6`}>
            <a href="/users">Usurarios</a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
