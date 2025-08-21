
import React, { useMemo, useState } from "react";

// === Doce Encanto – Single-file site for Instagram bio ===
// - TailwindCSS ready
// - Add-to-cart menu, totals, payment & entrega/retirada
// - On "Finalizar Pedido" it opens WhatsApp with all details prefilled
// - Keep your logo as /logo.png (place your round logo image in the public folder as logo.png)
// - Palette follows your identity: marrom + rosa
// - Phone used: +55 94 98117-6517 (WhatsApp)

// --- Helpers ---
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function classNames(...cn) {
  return cn.filter(Boolean).join(" ");
}

// --- Menu ---
const CATEGORIES = [
  {
    id: "clássicos",
    title: "Clássicos",
    items: [
      { id: "brigadeiro", name: "Brigadeiro", price: 10.0, desc: "Bolo de chocolate com camadas de brigadeiro cremoso." },
      { id: "beijinho", name: "Beijinho", price: 10.0, desc: "Coco fresco com creme de beijinho e bolo branco." },
      { id: "ninho", name: "Ninho", price: 11.0, desc: "Leite Ninho com toque suave de baunilha." },
      { id: "casadinho", name: "Casadinho", price: 11.0, desc: "Metade brigadeiro, metade beijinho – perfeito!" },
    ],
  },
  {
    id: "especiais",
    title: "Especiais",
    items: [
      { id: "prestigio", name: "Prestígio", price: 12.0, desc: "Chocolate + coco cremoso." },
      { id: "morango-ninho", name: "Ninho com Morango", price: 13.0, desc: "Creme de Ninho com pedaços de morango." },
      { id: "oreo", name: "Oreo", price: 13.0, desc: "Creme de chocolate com biscoito crocante." },
    ],
  },
  {
    id: "promo",
    title: "Combos & Promo",
    items: [
      { id: "combo3", name: "Combo 3 Sabores", price: 28.0, desc: "Escolha 3 sabores clássicos." },
      { id: "combo5", name: "Combo 5 Sabores", price: 45.0, desc: "Escolha 5 sabores variados." },
    ],
  },
];

export default function DoceEncantoSite() {
  const [cart, setCart] = useState({}); // { itemId: {ref, qty} }
  const [payment, setPayment] = useState("Pix");
  const [deliveryType, setDeliveryType] = useState("Retirada"); // Entrega | Retirada
  const [address, setAddress] = useState({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    referencia: "",
  });
  const [obs, setObs] = useState("");

  const allItems = useMemo(() => CATEGORIES.flatMap((c) => c.items), []);

  const totals = useMemo(() => {
    let subtotal = 0;
    Object.values(cart).forEach(({ ref, qty }) => {
      subtotal += ref.price * qty;
    });
    const entrega = deliveryType === "Entrega" ? 0 : 0; // coloque taxa aqui se desejar
    const total = subtotal + entrega;
    return { subtotal, entrega, total };
  }, [cart, deliveryType]);

  function addItem(ref) {
    setCart((prev) => {
      const curr = prev[ref.id]?.qty || 0;
      return { ...prev, [ref.id]: { ref, qty: curr + 1 } };
    });
  }

  function removeItem(ref) {
    setCart((prev) => {
      const curr = prev[ref.id]?.qty || 0;
      const nextQty = Math.max(0, curr - 1);
      const next = { ...prev };
      if (nextQty === 0) delete next[ref.id];
      else next[ref.id] = { ref, qty: nextQty };
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  function buildWhatsappText() {
    const linhas = [];
    linhas.push("🍰 Doce Encanto – Pedido pelo site");
    linhas.push("");

    // Itens
    if (Object.keys(cart).length === 0) {
      linhas.push("(Sem itens no carrinho)");
    } else {
      linhas.push("*Itens:* ");
      Object.values(cart).forEach(({ ref, qty }) => {
        linhas.push(`• ${ref.name} x${qty} — ${BRL.format(ref.price * qty)}`);
      });
    }

    linhas.push("");
    linhas.push(`Subtotal: ${BRL.format(totals.subtotal)}`);
    if (totals.entrega > 0) linhas.push(`Taxa de entrega: ${BRL.format(totals.entrega)}`);
    linhas.push(`Total: *${BRL.format(totals.total)}*`);

    linhas.push("");
    linhas.push(`Forma de pagamento: *${payment}*`);
    linhas.push(`Recebimento: *${deliveryType}*`);

    if (deliveryType === "Entrega") {
      linhas.push("");
      linhas.push("*Endereço para entrega:* ");
      linhas.push(`Nome: ${address.nome}`);
      if (address.telefone) linhas.push(`Telefone: ${address.telefone}`);
      linhas.push(`Rua: ${address.rua}, Nº ${address.numero}`);
      linhas.push(`Bairro: ${address.bairro}`);
      if (address.complemento) linhas.push(`Compl.: ${address.complemento}`);
      if (address.referencia) linhas.push(`Ref.: ${address.referencia}`);
    } else {
      if (address.nome) linhas.push(`Retirada em nome de: ${address.nome}`);
      if (address.telefone) linhas.push(`Telefone: ${address.telefone}`);
    }

    if (obs) {
      linhas.push("");
      linhas.push(`Obs.: ${obs}`);
    }

    linhas.push("");
    linhas.push("Obrigado! 💖");
    return linhas.join("\\n");
  }

  function sendToWhatsApp() {
    const msg = buildWhatsappText();
    const number = "5594981176517"; // DDI + DDD + número
    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-rose-50 text-stone-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-rose-50/80 border-b border-rose-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Doce Encanto" className="h-12 w-12 rounded-full ring-2 ring-rose-200 object-cover" />
            <div>
              <h1 className="text-xl font-bold text-amber-900">Doce Encanto</h1>
              <p className="text-xs text-amber-900/70">Bolo no pote – Tucuruí/PA</p>
            </div>
          </div>
          <a
            href="#cardapio"
            className="px-4 py-2 rounded-2xl bg-rose-200 text-amber-900 font-medium shadow-sm hover:shadow transition"
          >
            Ver cardápio
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 leading-tight">
            Sabor que encanta, praticidade que conquista 💕
          </h2>
          <p className="mt-3 text-stone-700">
            Faça seu pedido direto pelo WhatsApp. Escolha os sabores, a forma de pagamento e se prefere entrega
            ou retirada. Tudo rápido e sem complicação!
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#cardapio" className="px-5 py-3 rounded-2xl bg-amber-900 text-rose-50 font-semibold shadow-md hover:opacity-90">
              Ver Sabores
            </a>
            <button onClick={sendToWhatsApp} className="px-5 py-3 rounded-2xl bg-rose-200 text-amber-900 font-semibold shadow-md hover:shadow">
              Finalizar agora
            </button>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="p-3 rounded-full bg-rose-100 ring-4 ring-rose-200">
            <img src="/logo.png" alt="Logo Doce Encanto" className="h-44 w-44 rounded-full object-cover" />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="cardapio" className="max-w-5xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold text-amber-900 mb-4">Cardápio</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-4">
              <h4 className="text-lg font-bold text-amber-900 mb-3">{cat.title}</h4>
              <ul className="space-y-3">
                {cat.items.map((it) => (
                  <li key={it.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-stone-800">{it.name}</p>
                        <span className="text-amber-900 font-medium">{BRL.format(it.price)}</span>
                      </div>
                      <p className="text-sm text-stone-600">{it.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeItem(it)}
                        className="w-8 h-8 rounded-full border border-rose-200 text-amber-900 hover:bg-rose-100"
                        aria-label={`Remover ${it.name}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium">{cart[it.id]?.qty || 0}</span>
                      <button
                        onClick={() => addItem(it)}
                        className="w-8 h-8 rounded-full bg-amber-900 text-rose-50 hover:opacity-90"
                        aria-label={`Adicionar ${it.name}`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Carrinho & Detalhes do Pedido */}
      <section className="bg-rose-100/60 border-t border-rose-200">
        <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-amber-900 mb-3">Seu carrinho</h3>
            <div className="bg-white rounded-2xl border border-rose-100 p-4">
              {Object.keys(cart).length === 0 ? (
                <p className="text-stone-600">Nenhum item adicionado ainda.</p>
              ) : (
                <ul className="divide-y divide-rose-100">
                  {Object.values(cart).map(({ ref, qty }) => (
                    <li key={ref.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-stone-800">
                          {ref.name} <span className="text-stone-500">× {qty}</span>
                        </p>
                        <p className="text-sm text-stone-600">{BRL.format(ref.price)} cada</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeItem(ref)} className="px-3 py-1 rounded-xl border border-rose-200">−</button>
                        <button onClick={() => addItem(ref)} className="px-3 py-1 rounded-xl bg-amber-900 text-rose-50">+</button>
                        <span className="w-20 text-right font-semibold">{BRL.format(ref.price * qty)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {Object.keys(cart).length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={clearCart} className="text-sm text-rose-700 hover:underline">Limpar carrinho</button>
                  <div className="text-right">
                    <p className="text-sm text-stone-600">Subtotal: {BRL.format(totals.subtotal)}</p>
                    {totals.entrega > 0 && <p className="text-sm text-stone-600">Entrega: {BRL.format(totals.entrega)}</p>}
                    <p className="text-lg font-extrabold text-amber-900">Total: {BRL.format(totals.total)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-amber-900 mb-3">Detalhes do pedido</h3>
            <div className="bg-white rounded-2xl border border-rose-100 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">Forma de pagamento</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["Pix", "Dinheiro", "Cartão"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayment(p)}
                      className={classNames(
                        "px-3 py-2 rounded-xl border",
                        payment === p ? "bg-rose-200 border-rose-300 text-amber-900" : "border-rose-200 text-stone-700"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Recebimento</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Retirada", "Entrega"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setDeliveryType(r)}
                      className={classNames(
                        "px-3 py-2 rounded-xl border",
                        deliveryType === r ? "bg-rose-200 border-rose-300 text-amber-900" : "border-rose-200 text-stone-700"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium text-stone-700">Seu nome</label>
                <input
                  value={address.nome}
                  onChange={(e) => setAddress({ ...address, nome: e.target.value })}
                  placeholder="Ex.: Maria Silva"
                  className="w-full rounded-xl border border-rose-200 px-3 py-2"
                />
                <label className="text-sm font-medium text-stone-700">Telefone (opcional)</label>
                <input
                  value={address.telefone}
                  onChange={(e) => setAddress({ ...address, telefone: e.target.value })}
                  placeholder="(94) 9 9999-9999"
                  className="w-full rounded-xl border border-rose-200 px-3 py-2"
                />
              </div>

              {deliveryType === "Entrega" && (
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium text-stone-700">Endereço</label>
                  <input
                    value={address.rua}
                    onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                    placeholder="Rua / Av."
                    className="w-full rounded-xl border border-rose-200 px-3 py-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={address.numero}
                      onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                      placeholder="Número"
                      className="w-full rounded-xl border border-rose-200 px-3 py-2"
                    />
                    <input
                      value={address.bairro}
                      onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                      placeholder="Bairro"
                      className="w-full rounded-xl border border-rose-200 px-3 py-2"
                    />
                  </div>
                  <input
                    value={address.complemento}
                    onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                    placeholder="Complemento (apto, bloco...)"
                    className="w-full rounded-xl border border-rose-200 px-3 py-2"
                  />
                  <input
                    value={address.referencia}
                    onChange={(e) => setAddress({ ...address, referencia: e.target.value })}
                    placeholder="Ponto de referência"
                    className="w-full rounded-xl border border-rose-200 px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700">Observações</label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex.: sem granulado, entregar após as 18h..."
                  className="w-full min-h-[80px] rounded-xl border border-rose-200 px-3 py-2"
                />
              </div>

              <button
                onClick={sendToWhatsApp}
                disabled={Object.keys(cart).length === 0}
                className={classNames(
                  "w-full py-3 rounded-2xl font-semibold shadow-md",
                  Object.keys(cart).length === 0
                    ? "bg-rose-200 text-amber-900/70 cursor-not-allowed"
                    : "bg-amber-900 text-rose-50 hover:opacity-90"
                )}
              >
                Finalizar pedido no WhatsApp
              </button>

              <p className="text-xs text-stone-500 text-center">
                Ao clicar, você será direcionado para o WhatsApp com o resumo do pedido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-semibold text-amber-900">Doce Encanto • Bolo no pote</p>
          <p className="text-stone-600">Pedidos via WhatsApp: (94) 98117-6517</p>
          <p className="text-stone-500 text-sm mt-2">Siga no Instagram: @doceriadoceencantotuc</p>
          <p className="text-stone-400 text-xs mt-4">© {new Date().getFullYear()} Doce Encanto. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
