import React, { useMemo, useState } from "react";

// === Doce Encanto – Site para Instagram Bio ===
// - TailwindCSS
// - Menu + Carrinho + Total + Pagamento + Entrega/Retirada
// - Ao "Finalizar Pedido" abre WhatsApp com tudo preenchido
// - Logo deve estar em /logo.png (na pasta public)
// - Identidade: marrom + rosa
// - WhatsApp oficial: +55 94 98117-6517

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
      { id: "cenoura-chocolate", name: "Cenoura com Chocolate", price: 10.0, desc: "Bolo de cenoura fofinho com cobertura de chocolate." },
      { id: "chocolate", name: "Chocolate", price: 12.0, desc: "Bolo de chocolate com recheio cremoso." },
      { id: "ninho", name: "Ninho", price: 11.0, desc: "Leite Ninho com toque suave de baunilha." },
    ],
  },
  {
    id: "especiais",
    title: "Especiais",
    items: [
      { id: "oreo", name: "Oreo", price: 14.0, desc: "Creme de chocolate com biscoito Oreo crocante." },
      { id: "morango-ninho", name: "Ninho com Morango", price: 14.0, desc: "Creme de Ninho com pedaços de morango fresco." },
    ],
  },
  {
    id: "promo",
    title: "Combos & Promo",
    items: [
      { id: "combo3", name: "Combo 3 Sabores", price: 30.0, desc: "Escolha 3 sabores diferentes." },
      { id: "combo5", name: "Combo 5 Sabores", price: 50.0, desc: "Escolha 5 sabores diferentes." },
    ],
  },
];

export default function DoceEncantoSite() {
  const [cart, setCart] = useState({});
  const [payment, setPayment] = useState("Pix");
  const [deliveryType, setDeliveryType] = useState("Retirada");
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
    let entrega = 0;
    if (deliveryType === "Vila") entrega = 3;
    if (deliveryType === "Tucuruí") entrega = 5;
    const total = subtotal + entrega;
    return { subtotal, entrega, total };
  }, [cart, deliveryType]);

  function addItem(ref) {
    if (ref.id === "combo3" || ref.id === "combo5") {
      const qtd = ref.id === "combo3" ? 3 : 5;
      const sabores = prompt(`Digite os ${qtd} sabores que deseja no ${ref.name}:`);
      const refComSabores = { ...ref, name: `${ref.name} (${sabores})` };
      setCart((prev) => {
        const curr = prev[ref.id]?.qty || 0;
        return { ...prev, [ref.id]: { ref: refComSabores, qty: curr + 1 } };
      });
      return;
    }
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
    linhas.push("🍰 *Doce Encanto* – Pedido pelo site");
    linhas.push("Tamanho do pote: 250g");
    linhas.push("");
    if (Object.keys(cart).length === 0) {
      linhas.push("(Carrinho vazio)");
    } else {
      linhas.push("*Itens:* ");
      Object.values(cart).forEach(({ ref, qty }) => {
        linhas.push(`• ${ref.name} x${qty} — ${BRL.format(ref.price * qty)}`);
      });
    }
    linhas.push("");
    linhas.push(`Subtotal: ${BRL.format(totals.subtotal)}`);
    if (totals.entrega > 0) {
      linhas.push(`Taxa de entrega: ${BRL.format(totals.entrega)}`);
      if (deliveryType === "Vila") linhas.push("➡️ Entrega na Vila (saída às 16h)");
      if (deliveryType === "Tucuruí") linhas.push("➡️ Entrega em Tucuruí (saída às 18h)");
    }
    linhas.push(`Total: *${BRL.format(totals.total)}*`);
    linhas.push("");
    linhas.push(`Forma de pagamento: *${payment}*`);
    linhas.push(`Recebimento: *${deliveryType}*`);
    if (deliveryType !== "Retirada") {
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
    linhas.push("Obrigado por comprar com a gente 💖");
    return linhas.join("\n");
  }

  function sendToWhatsApp() {
    const msg = buildWhatsappText();
    const number = "5594981176517";
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
              <p className="text-xs text-amber-900/70">Bolo no pote – 250g • Tucuruí/PA</p>
            </div>
          </div>
          <a href="#cardapio" className="px-4 py-2 rounded-2xl bg-rose-200 text-amber-900 font-medium shadow-sm hover:shadow transition">
            Ver cardápio
          </a>
        </div>
      </header>

      {/* Seção cardápio */}
      <main id="cardapio" className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-lg font-bold text-amber-900 mb-3">{cat.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-rose-200 bg-white shadow-sm hover:shadow p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-900">{item.name}</h3>
                    <p className="text-sm text-stone-600">{item.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-amber-900 font-bold">{BRL.format(item.price)}</span>
                    <button onClick={() => addItem(item)} className="px-3 py-1 rounded-xl bg-rose-200 text-amber-900 text-sm font-medium hover:shadow">
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Carrinho */}
      <aside className="max-w-5xl mx-auto px-4 py-6 border-t border-rose-200">
        <h2 className="text-lg font-bold text-amber-900 mb-3">🛒 Seu Carrinho</h2>
        {Object.keys(cart).length === 0 ? (
          <p className="text-stone-500">Carrinho vazio.</p>
        ) : (
          <ul className="space-y-2">
            {Object.values(cart).map(({ ref, qty }) => (
              <li key={ref.id} className="flex items-center justify-between">
                <span>{ref.name} x{qty}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeItem(ref)} className="px-2 py-1 bg-rose-100 rounded-lg">-</button>
                  <span>{qty}</span>
                  <button onClick={() => addItem(ref)} className="px-2 py-1 bg-rose-100 rounded-lg">+</button>
                  <span className="font-medium">{BRL.format(ref.price * qty)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 space-y-1 text-sm">
          <p>Subtotal: {BRL.format(totals.subtotal)}</p>
          {totals.entrega > 0 && <p>Entrega: {BRL.format(totals.entrega)}</p>}
          <p className="font-bold">Total: {BRL.format(totals.total)}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={clearCart} className="px-3 py-2 rounded-xl bg-stone-200 text-stone-700 text-sm">Limpar</button>
          <button onClick={sendToWhatsApp} className="px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-medium shadow hover:shadow-md">
            Finalizar pedido no WhatsApp
          </button>
        </div>
      </aside>
    </div>
  );
}
