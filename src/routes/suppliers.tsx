import { revalidate } from "@solidjs/router";
import { createSignal, createResource, For, Show } from "solid-js";
import { toast } from "solid-sonner";
import SupplierForm from "~/components/supplierForm";
import { deleteSupplier, getSupplierList } from "~/data/db/schemas/suppliers";

export default function Suppliers() {
  const [page, setPage] = createSignal(1);
  const [editId, setEditId] = createSignal(0);
  const [search, setSearch] = createSignal("");
  const [submittedSearch, setSubmittedSearch] = createSignal("");
  const [open, setOpen] = createSignal(false);

  const [result, { refetch }] = createResource(
    () => [page(), submittedSearch()] as const,
    ([currentPage, currentSearch]) =>
      getSupplierList(currentPage, 10, currentSearch),
  );

  const handleSearch = () => {
    setPage(1);
    setSubmittedSearch(search().trim());
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id);
      await revalidate(getSupplierList.keyFor(page(), 10, submittedSearch()));
      await refetch();
      toast.success("Item deletado!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocorreu um erro inesperado.";

      toast.error(message);
    }
  };

  return (
    <div class="p-4">
      <div class="p-6 space-y-6">
        {/* Cabeçalho */}
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Proveedores</h1>
          </div>
        </div>

        {/* Barra de busca e botão */}
        <div class="bg-white border border-gray-200 rounded-3xl shadow-sm p-4">
          <div class="flex flex-col md:flex-row gap-3">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search()}
                onInput={(e) => setSearch(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                class="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />

              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditId(0);
                setOpen(true);
              }}
              class="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              ➕ Cadastrar Proveedor
            </button>
          </div>
        </div>
      </div>
      <Show when={result()} fallback={<p>Carregando...</p>}>
        {(data) => (
          <>
            <div class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr class="text-sm uppercase tracking-wide text-gray-500">
                      <th class="px-6 py-4 text-left font-semibold">Nombre</th>
                      <th class="px-6 py-4 text-left font-semibold">
                        Contacto
                      </th>

                      <th class="px-6 py-4 text-center font-semibold">
                        Opciones
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-gray-100">
                    <Show
                      when={data().data.length > 0}
                      fallback={
                        <tr>
                          <td
                            colSpan={6}
                            class="px-6 py-10 text-center text-gray-400"
                          >
                            <div class="flex flex-col items-center gap-2">
                              <span class="text-4xl">📦</span>
                              <p class="text-base font-medium">
                                Ningun proveedor encontrado
                              </p>
                            </div>
                          </td>
                        </tr>
                      }
                    >
                      <For each={data().data}>
                        {(suppliers) => (
                          <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-medium text-gray-800">
                              {suppliers.name}
                            </td>

                            <td class="px-6 py-4 text-emerald-600 font-semibold">
                              {suppliers.phoneNumber}
                            </td>

                            <td class="px-6 py-4">
                              <div class="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  class="w-9 h-9 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm"
                                  title="Editar"
                                  onClick={() => {
                                    setEditId(suppliers.id);
                                    setOpen(true);
                                  }}
                                >
                                  ✏️
                                </button>

                                <button
                                  type="button"
                                  class="w-9 h-9 rounded-full border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm"
                                  title="Excluir"
                                  onclick={() => handleDelete(suppliers.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </For>
                    </Show>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page() <= 1}
                class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
              >
                Anterior
              </button>

              <span>
                Pagina {page()} de {data().totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((p) => (p < data().totalPages ? p + 1 : p))
                }
                disabled={page() >= data().totalPages}
                class="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50 hover:cursor-pointer"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </Show>

      <Show when={open()}>
        <SupplierForm
          open={open}
          setOpen={setOpen}
          id={editId}
          refetch={refetch}
        />
      </Show>
    </div>
  );
}
