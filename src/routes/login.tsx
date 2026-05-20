import { useNavigate } from "@solidjs/router";
import { toast } from "solid-sonner";
import { getLogin } from "~/data/lib/users";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await getLogin(username, password);
      localStorage.setItem("token", res);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro inesperado");
      }
    }
  };

  return (
    <>
      <div class="w-full h-screen grid grid-cols-1 md:grid-cols-2">
        <div class="h-screen bg-linear-to-br from-emerald-500 to-emerald-700 flex flex-col items-center justify-center text-center px-6 shadow-2xl">
          <h1 class="text-white text-7xl font-extrabold tracking-wide drop-shadow-lg">
            SCS
          </h1>
          <h3 class="text-emerald-50 text-lg font-light mt-3 tracking-wide">
            Sistema de control de stock
          </h3>
        </div>

        <div class="h-screen bg-gray-100 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            method="post"
            class="w-full max-w-2xl bg-white rounded-3xl shadow-lg m-6 p-10 text-2xl flex flex-col gap-5 border border-gray-200"
          >
            <h1 class="font-bold text-4xl text-gray-800 mx-auto mt-2">SCS</h1>
            <h3 class="mx-auto -mt-3 text-sm font-light text-gray-500">
              Sistema de control de stock
            </h3>

            <input
              type="text"
              placeholder="Usuario"
              name="username"
              id="username"
              class="text-center mt-4 border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-0 w-80 mx-auto py-2 bg-transparent transition"
            />

            <input
              type="password"
              placeholder="Contraseña"
              name="password"
              id="password"
              class="text-center border-b-2 border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-0 w-80 mx-auto py-2 bg-transparent transition"
            />

            <button
              type="submit"
              class="bg-emerald-500 text-white font-semibold rounded-xl mt-6 w-80 mx-auto py-3 shadow-md hover:cursor-pointer hover:bg-emerald-600 hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              Ingressar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
