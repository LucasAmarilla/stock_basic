import {
  Accessor,
  createEffect,
  createResource,
  createSignal,
  For,
  Setter,
  Show,
} from "solid-js";
import type { ResourceActions } from "solid-js";
import { toast } from "solid-sonner";
import {
  addProduct,
  getProductById,
  getSupplierName,
  updateProduct,
} from "~/data/lib/products";
import { productSchema } from "~/schemas/products";

type DialogProps = {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  id: Accessor<number>;
  refetch: ResourceActions<any>["refetch"];
};

export default function ProductsForm(props: DialogProps) {
  let nameRef!: HTMLInputElement;
  let priceRef!: HTMLInputElement;
  let paidPriceRef!: HTMLInputElement;
  let quantityRef!: HTMLInputElement;
  let supplierRef!: HTMLSelectElement;

  const [result] = createResource(() => getSupplierName());
  const [product] = createResource(
    () => props.id(),
    async (id) => {
      if (id <= 0) return null;
      return await getProductById(id);
    },
  );

  const [productName, setProductName] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const parsed = productSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Verifica los datos y intenta nuevamente");
      return;
    }

    try {
      if (props.id() == 0) {
        const res = await addProduct(
          parsed.data.name,
          parsed.data.price,
          parsed.data.paid_price,
          parsed.data.supplierId,
          parsed.data.quantity,
        );
        await props.refetch();
        props.setOpen(false);
        return toast.success(`Produto ${res.name} cadastrado com sucesso!`);
      }

      const res = await updateProduct(
        props.id(),
        parsed.data.name,
        parsed.data.price,
        parsed.data.paid_price,
        parsed.data.supplierId,
        parsed.data.quantity,
      );
      await props.refetch();
      props.setOpen(false);
      return toast.success(`Produto ${res.name} editado com sucesso!`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      toast.error(message);
    }
  };

  createEffect(() => {
    const data = product();
    if (!data || props.id() <= 0) return;
    const item = data[0]!;
    if (!data?.length) return;

    nameRef.value = item.name;
    priceRef.value = item.price.toString();
    paidPriceRef.value = item.paidPrice.toString();
    quantityRef.value = (item.quantity ?? 0).toString();
    supplierRef.value = item.supplierId.toString();
    setProductName(item.name);
  });

  return (
    <>
      <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800">
              {props.id() > 0
                ? `✏️ Editando  ${productName()} `
                : "📦 Cadastro de Produtos"}
            </h2>

            <button
              type="button"
              onClick={() => props.setOpen(false)}
              class="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <span class="text-xl font-bold leading-none">×</span>
            </button>
          </div>

          {/* Form */}
          <form class="px-6 py-6 flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Nome */}
            <input
              type="text"
              name="name"
              id="name"
              ref={nameRef}
              placeholder="Nome do produto"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />

            {/* Preço de custo */}
            <input
              type="text"
              name="paid_price"
              id="paid_price"
              ref={paidPriceRef}
              placeholder="Preço de custo"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  "",
                );
              }}
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />

            {/* Preço de venda */}
            <input
              type="text"
              name="price"
              id="price"
              ref={priceRef}
              placeholder="Preço de venda"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  "",
                );
              }}
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />

            {/* Quantidade */}
            <input
              type="text"
              name="quantity"
              id="quantity"
              placeholder="Quantidade"
              ref={quantityRef}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  "",
                );
              }}
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />

            {/* Fornecedor */}
            <select
              name="supplierId"
              id="supplierId"
              ref={supplierRef}
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            >
              <option value="0">Selecione o fornecedor</option>

              <For each={result() ?? []}>
                {(supplier) => (
                  <option value={supplier.id}>
                    {supplier.name.charAt(0).toUpperCase() +
                      supplier.name.slice(1)}
                  </option>
                )}
              </For>
            </select>

            <Show when={(props.id?.() ?? 0) > 0}>
              <p class="text-sm text-gray-400 text-center">
                Editando produto ID: {props.id?.()}
              </p>
            </Show>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => props.setOpen(false)}
                class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 hover:shadow-lg transition"
              >
                {props.id() > 0 ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
