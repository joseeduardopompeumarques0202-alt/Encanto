import React, { useMemo, useState } from "react";

// === Doce Encanto – Site profissional, single-file (React + Tailwind) ===
// Como usar:
// 1) Coloque seu logo como /logo.png (ideal: fundo transparente, 512x512 ou maior).
// 2) Este arquivo pode ser usado no Vite/Next ou qualquer app React.
// 3) Cores e estética inspiradas na sua logo (marrom, rosé, creme) e layout de grandes docerias.
// 4) O botão "Finalizar pedido" abre o WhatsApp com os dados do pedido preenchidos.
// 5) Ajuste o número abaixo se necessário (formato internacional BR: 55 + DDD + número).

const WHATSAPP_NUMBER = "5594981176517"; // (94) 98117-6517

// Paleta (inspirada na logo)
const palette = {
  bg: "#FFF7F9", // creme rosado
  accent: "#F9D7E6", // rosé claro
  accent2: "#FFC7DA", // rosé médio (aros)
  dark: "#4E2B22", // marrom chocolate
  mid: "#7A4A3F", // marrom médio
  mint: "#9FE5E1", // do fouet
};

// Catálogo
const FLAVORS = {
  classic: [
    {
      id: "cenoura",
      name: "Cenoura com Brigadeiro",
      price: 10,
      desc: "Bolo de cenoura fofo com camada generosa de brigadeiro cremoso.",
    },
    {
      id: "chocolate",
      name: "Chocolate com Brigadeiro",
      price: 13,
      desc: "Massa intensa de chocolate com brigadeiro caseiro bem sedoso.",
    },
    {
      id: "ninho",
      name: "Ninho",
      price: 11,
      desc: "Massa branca leve com creme de leite Ninho suave e delicado.",
    },
  ],
  special: [
    {
      id: "ninho-morango",
      name: "Ninho com Morango",
      price: 14,
      desc: "Creme de Ninho com pedacinhos de morango fresquinho: doce na medida certa.",
    },
    {
      id: "oreo",
      name: "Oreo",
      price: 14,
      desc: "Creme de chocolate branco com crocantes pedaços de Oreo em cada colherada.",
    },
  ],
};

const DELIVERY_FEE = {
  "Vila Permanente": 3,
  Tucuruí: 5,
};

// Combos
const COMBOS = [
  {
    id: "combo3",
    name: "Combo 3 Clássicos",
    qty: 3,
    allowed: "classic",
    price: 30, // preço fechado
    discountInfo: "Preço fechado especial",
  },
  {
    id: "combo5",
    name: "Combo 5 Sabores (clássicos ou especiais)",
    qty: 5,
    allowed: "all",
    price: null, // preço = soma - 14
    discountFlat: 14,
    discountInfo: "Desconto de R$14 aplicado na compra",
  },
];

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SectionTitle({ children, subtitle }) {
  return (
    <div className="flex flex-col gap-1 text-center mb-6">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: palette.dark }}>{children}</h2>
      {subtitle && (
        <p className="text-sm md:text-base opacity-80" style={{ color: palette.mid }}>{subtitle}</p>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b" style={{ borderColor: palette.accent }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="logo.png" alt="Doce Encanto" className="h-12 w-12 rounded-full ring-2" style={{ ringColor: palette.accent2 }} />
          <div>
            <h1 className="font-black text-xl md:text-2xl" style={{ color: palette.dark }}>Doce Encanto</h1>
            <p className="text-xs md:text-sm" style={{ color: palette.mid }}>Bolos no pote feitos com carinho ✨</p>
          </div>
        </div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hidden md:inline-block px-4 py-2 rounded-2xl font-semibold shadow hover:shadow-md transition" style={{ background: palette.dark, color: "#fff" }}>
          Fale pelo WhatsApp
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(1200px 600px at 20% -10%, ${palette.accent} 0%, transparent 60%), radial-gradient(800px 500px at 120% 20%, ${palette.accent2} 0%, transparent 60%)` }} />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: palette.mint, color: palette.dark }}>feito com amor</span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: palette.dark }}>
            Sabor de aconchego em cada <span className="italic">colherada</span> 🍰
          </h2>
          <p className="mt-4 text-base md:text-lg" style={{ color: palette.mid }}>
            Escolha seus sabores favoritos de bolo no pote, monte combos com desconto e receba no conforto da sua casa.
          </p>
          <ul className="mt-6 text-sm md:text-base space-y-2" style={{ color: palette.mid }}>
            <li>• Entrega para <b>Vila Permanente</b> e <b>Tucuruí</b></li>
            <li>• Retirada: <b>Rua Venezuela 13, Vila Permanente</b> (9h às 20:30h)</li>
            <li>• Entregas: Vila (11h–18h) · Tucuruí (16h)</li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-3xl opacity-40" style={{ background: palette.accent2 }} />
          <div className="rounded-3xl p-6 shadow-xl ring-1" style={{ background: "white", ringColor: palette.accent }}>
            <img src="logo.png" alt="Logo Doce Encanto" className="w-full aspect-square object-contain rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FlavorCard({ flavor, onAdd }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm ring-1 bg-white" style={{ ringColor: palette.accent }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-extrabold" style={{ color: palette.dark }}>{flavor.name}</h4>
          <p className="text-sm" style={{ color: palette.mid }}>{flavor.desc}</p>
        </div>
        <span className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold" style={{ background: palette.accent, color: palette.dark }}>{money(flavor.price)}</span>
      </div>
      <button onClick={() => onAdd(flavor)} className="mt-auto px-4 py-2 rounded-xl font-semibold shadow hover:shadow-md transition text-sm" style={{ background: palette.dark, color: "white" }}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}

function ComboBuilder({ combo, onAdd }) {
  const [selected, setSelected] = useState({});
  const allFlavors = useMemo(() => {
    const list = combo.allowed === "classic" ? FLAVORS.classic : [...FLAVORS.classic, ...FLAVORS.special];
    return list;
  }, [combo]);

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);
  const remaining = combo.qty - totalSelected;

  function toggle(flavorId) {
    setSelected((prev) => {
      const current = prev[flavorId] || 0;
      if (current > 0) {
        const copy = { ...prev };
        copy[flavorId] = current - 1;
        if (copy[flavorId] <= 0) delete copy[flavorId];
        return copy;
      } else if (totalSelected < combo.qty) {
        return { ...prev, [flavorId]: 1 };
      }
      return prev;
    });
  }

  function addOne(flavorId) {
    setSelected((prev) => {
      const total = Object.values(prev).reduce((a, b) => a + b, 0);
      if (total >= combo.qty) return prev;
      return { ...prev, [flavorId]: (prev[flavorId] || 0) + 1 };
    });
  }

  function removeOne(flavorId) {
    setSelected((prev) => {
      const qty = (prev[flavorId] || 0) - 1;
      const copy = { ...prev };
      if (qty <= 0) delete copy[flavorId];
      else copy[flavorId] = qty;
      return copy;
    });
  }

  function handleAddCombo() {
    if (remaining !== 0) return;

    // preço
    let price = 0;
    let discount = 0;
    if (combo.price != null) {
      // preço fechado
      const sum = Object.entries(selected).reduce((acc, [fid, q]) => {
        const f = allFlavors.find((x) => x.id === fid);
        return acc + (f?.price || 0) * q;
      }, 0);
      discount = Math.max(0, sum - combo.price);
      price = combo.price;
    } else {
      const sum = Object.entries(selected).reduce((acc, [fid, q]) => {
        const f = allFlavors.find((x) => x.id === fid);
        return acc + (f?.price || 0) * q;
      }, 0);
      discount = combo.discountFlat || 0;
      price = Math.max(0, sum - discount);
    }

    const flavorsChosen = Object.entries(selected).map(([fid, q]) => {
      const f = allFlavors.find((x) => x.id === fid);
      return `${f?.name} x${q}`;
    });

    onAdd({
      type: "combo",
      id: combo.id,
      name: combo.name,
      qty: combo.qty,
      flavors: flavorsChosen,
      price,
      discount,
    });

    setSelected({});
  }

  return (
    <div className="rounded-2xl p-5 bg-white ring-1 shadow-sm flex flex-col gap-4" style={{ ringColor: palette.accent }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h4 className="font-extrabold" style={{ color: palette.dark }}>{combo.name}</h4>
          <p className="text-sm" style={{ color: palette.mid }}>{combo.discountInfo}</p>
        </div>
        <div className="text-sm font-semibold whitespace-nowrap" style={{ color: palette.dark }}>
          {combo.price != null ? (
            <>Total do combo: {money(combo.price)}</>
          ) : (
            <>Desconto: {money(combo.discountFlat || 0)} (aplicado no total)</>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm mb-2" style={{ color: palette.mid }}>
          Selecione <b>{combo.qty}</b> sabores ({combo.allowed === "classic" ? "apenas clássicos" : "clássicos e especiais"}). Restam <b>{remaining}</b>.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allFlavors.map((f) => (
            <div key={f.id} className="rounded-xl ring-1 p-3 bg-white flex flex-col gap-2" style={{ ringColor: palette.accent }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold" style={{ color: palette.dark }}>{f.name}</div>
                  <div className="text-xs" style={{ color: palette.mid }}>{money(f.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeOne(f.id)} className="px-2 py-1 rounded-lg ring-1 text-sm" style={{ ringColor: palette.accent2, color: palette.dark }}>-</button>
                  <div className="w-6 text-center font-semibold" style={{ color: palette.dark }}>{selected[f.id] || 0}</div>
                  <button onClick={() => addOne(f.id)} disabled={totalSelected >= combo.qty} className="px-2 py-1 rounded-lg ring-1 text-sm disabled:opacity-40" style={{ ringColor: palette.accent2, color: palette.dark }}>+</button>
                </div>
              </div>
              <p className="text-xs" style={{ color: palette.mid }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleAddCombo} disabled={remaining !== 0} className="mt-2 px-4 py-2 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: palette.dark, color: "white" }}>
        Adicionar combo ao carrinho
      </button>
    </div>
  );
}

function Cart({ items, onInc, onDec, onRemove, summary, onCheckout }) {
  return (
    <aside className="rounded-3xl p-5 bg-white ring-1 shadow-md sticky top-24 h-fit" style={{ ringColor: palette.accent }}>
      <h3 className="font-black text-lg mb-2" style={{ color: palette.dark }}>Seu Carrinho</h3>
      {items.length === 0 ? (
        <p className="text-sm" style={{ color: palette.mid }}>Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: palette.accent }}>
              <div>
                <div className="font-semibold" style={{ color: palette.dark }}>
                  {it.type === "combo" ? it.name : it.name}
                </div>
                {it.type === "combo" && (
                  <div className="text-xs" style={{ color: palette.mid }}>{it.flavors.join(", ")}</div>
                )}
                {it.type === "flavor" && (
                  <div className="text-xs" style={{ color: palette.mid }}>{money(it.price)} cada</div>
                )}
              </div>
              <div className="text-right">
                {it.type === "flavor" && (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onDec(idx)} className="px-2 py-1 rounded-lg ring-1 text-sm" style={{ ringColor: palette.accent2, color: palette.dark }}>-</button>
                    <div className="w-6 text-center font-semibold" style={{ color: palette.dark }}>{it.qty}</div>
                    <button onClick={() => onInc(idx)} className="px-2 py-1 rounded-lg ring-1 text-sm" style={{ ringColor: palette.accent2, color: palette.dark }}>+</button>
                  </div>
                )}
                <div className="mt-1 font-semibold" style={{ color: palette.dark }}>{money(it.total)}</div>
                <button onClick={() => onRemove(idx)} className="mt-1 text-xs underline opacity-70">remover</button>
              </div>
            </div>
          ))}

          <div className="space-y-1 text-sm pt-2">
            <div className="flex justify-between"><span style={{ color: palette.mid }}>Subtotal</span><b style={{ color: palette.dark }}>{money(summary.subtotal)}</b></div>
            {summary.discount > 0 && (
              <div className="flex justify-between"><span style={{ color: palette.mid }}>Descontos de combos</span><b style={{ color: palette.dark }}>- {money(summary.discount)}</b></div>
            )}
            {summary.deliveryFee > 0 && (
              <div className="flex justify-between"><span style={{ color: palette.mid }}>Taxa de entrega</span><b style={{ color: palette.dark }}>{money(summary.deliveryFee)}</b></div>
            )}
            <div className="flex justify-between text-base pt-1 border-t" style={{ borderColor: palette.accent }}>
              <span className="font-bold" style={{ color: palette.dark }}>Total</span>
              <span className="font-black" style={{ color: palette.dark }}>{money(summary.total)}</span>
            </div>
          </div>

          <button onClick={onCheckout} className="w-full mt-3 px-4 py-2 rounded-xl font-semibold shadow hover:shadow-md transition" style={{ background: palette.dark, color: "white" }}>
            Finalizar pedido no WhatsApp
          </button>
        </div>
      )}
    </aside>
  );
}

export default function DoceEncantoSite() {
  const [items, setItems] = useState([]); // {type:"flavor"|"combo", name, price, qty, total, discount?}
  const [deliveryMode, setDeliveryMode] = useState("Retirada"); // "Entrega" | "Retirada"
  const [neighborhood, setNeighborhood] = useState("Vila Permanente");
  const [payment, setPayment] = useState("Pix");

  // Dados do cliente
  const [client, setClient] = useState({ name: "", phone: "", address: "" });

  // Helpers de carrinho
  function addFlavor(flavor) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.type === "flavor" && x.id === flavor.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += 1;
        copy[idx].total = copy[idx].qty * copy[idx].price;
        return copy;
      }
      return [
        ...prev,
        {
          type: "flavor",
          id: flavor.id,
          name: flavor.name,
          price: flavor.price,
          qty: 1,
          total: flavor.price,
        },
      ];
    });
  }

  function addCombo(comboItem) {
    setItems((prev) => [
      ...prev,
      {
        type: "combo",
        id: comboItem.id,
        name: comboItem.name,
        qty: 1,
        flavors: comboItem.flavors,
        price: comboItem.price, // preço final já com desconto abatido
        discount: comboItem.discount || 0,
        total: comboItem.price,
      },
    ]);
  }

  function inc(idx) {
    setItems((prev) => {
      const copy = [...prev];
      const it = copy[idx];
      if (it.type === "flavor") {
        it.qty += 1;
        it.total = it.qty * it.price;
      }
      return copy;
    });
  }

  function dec(idx) {
    setItems((prev) => {
      const copy = [...prev];
      const it = copy[idx];
      if (it.type === "flavor") {
        it.qty = Math.max(1, it.qty - 1);
        it.total = it.qty * it.price;
      }
      return copy;
    });
  }

  function remove(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const summary = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.total, 0);
    const discount = items.reduce((acc, it) => acc + (it.discount || 0), 0);
    const deliveryFee = deliveryMode === "Entrega" ? (DELIVERY_FEE[neighborhood] || 0) : 0;
    const total = Math.max(0, subtotal + deliveryFee);
    return { subtotal, discount, deliveryFee, total };
  }, [items, deliveryMode, neighborhood]);

  function withinDeliveryWindow() {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    if (deliveryMode === "Retirada") return true; // checado em outro texto

    if (neighborhood === "Tucuruí") {
      // saída às 16h (vamos aceitar pedidos das 15h às 16h para sair às 16h)
      return h <= 16; // depois de 16h -> não pode (mensagem alerta)
    }
    // Vila: 11h–18h
    return h >= 11 && h <= 18;
  }

  function pickupWindowText() {
    return "Retirada disponível entre 9h e 20:30h em Rua Venezuela 13, Vila Permanente.";
  }

  function deliveryWindowText() {
    if (neighborhood === "Tucuruí") return "Entregas para Tucuruí saem às 16h. Após esse horário, não realizamos entregas hoje.";
    return "Entregas para a Vila Permanente acontecem entre 11h e 18h. Após esse horário, não realizamos entregas hoje.";
  }

  function buildWhatsappMessage() {
    const lines = [];
    lines.push("Olá, Doce Encanto! 💖\nQuero fazer um pedido delicioso:");
    lines.push("");

    lines.push("Itens:");
    items.forEach((it) => {
      if (it.type === "flavor") {
        lines.push(`• ${it.name} x${it.qty} — ${money(it.total)}`);
      } else {
        lines.push(`• ${it.name} (${it.flavors.join(', ')}) — ${money(it.total)}${it.discount ? ` (desconto ${money(it.discount)})` : ''}`);
      }
    });

    if (summary.deliveryFee > 0) lines.push(`Taxa de entrega: ${money(summary.deliveryFee)}`);
    lines.push(`Total: ${money(summary.total)}`);
    lines.push("");

    lines.push(`Entrega/Retirada: ${deliveryMode}`);
    if (deliveryMode === "Entrega") {
      lines.push(`Local: ${neighborhood}`);
      if (client.address) lines.push(`Endereço: ${client.address}`);
    } else {
      lines.push("Retirada: Rua Venezuela 13, Vila Permanente");
    }

    lines.push(`Pagamento: ${payment}`);
    lines.push("");

    if (client.name) lines.push(`Nome: ${client.name}`);
    if (client.phone) lines.push(`Telefone do cliente: ${client.phone}`);

    lines.push("");
    lines.push("Mensagem: Obrigado por adoçar o dia com a gente! ✨\nAssim que confirmar, preparo tudo com muito carinho. 🍮");

    return encodeURIComponent(lines.join("\n"));
  }

  function onCheckout() {
    if (items.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }
    if (deliveryMode === "Entrega") {
      if (!withinDeliveryWindow()) {
        alert(deliveryWindowText());
        return;
      }
      if (!client.address) {
        alert("Por favor, informe o endereço para entrega.");
        return;
      }
    }
    if (!client.name || !client.phone) {
      alert("Por favor, informe seu nome e telefone para concluir o pedido.");
      return;
    }

    const msg = buildWhatsappMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>
      <Header />
      <Hero />

      <main className="mx-auto max-w-6xl px-4 pb-16 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-10">
          {/* Cardápio */}
          <section id="cardapio">
            <SectionTitle subtitle="Escolha seus preferidos. Descrições diretas e irresistíveis!">
              Cardápio Profissional
            </SectionTitle>

            <div className="space-y-8">
              {/* Clássicos */}
              <div>
                <h3 className="text-xl font-black mb-3" style={{ color: palette.dark }}>Sabores Clássicos</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FLAVORS.classic.map((f) => (
                    <FlavorCard key={f.id} flavor={f} onAdd={addFlavor} />
                  ))}
                </div>
              </div>

              {/* Especiais */}
              <div>
                <h3 className="text-xl font-black mb-3" style={{ color: palette.dark }}>Sabores Especiais</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FLAVORS.special.map((f) => (
                    <FlavorCard key={f.id} flavor={f} onAdd={addFlavor} />
                  ))}
                </div>
              </div>

              {/* Combos */}
              <div className="space-y-4">
                <h3 className="text-xl font-black" style={{ color: palette.dark }}>Combos com Desconto</h3>
                {COMBOS.map((c) => (
                  <ComboBuilder key={c.id} combo={c} onAdd={addCombo} />
                ))}
              </div>
            </div>
          </section>

          {/* Opções de entrega/retirada e pagamento */}
          <section id="entrega" className="pt-4">
            <SectionTitle subtitle="Informe seus dados para concluir com segurança.">Entrega, Retirada & Pagamento</SectionTitle>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-5 bg-white ring-1 shadow-sm space-y-4" style={{ ringColor: palette.accent }}>
                <div className="flex gap-3">
                  {(["Retirada", "Entrega"]).map((m) => (
                    <button key={m} onClick={() => setDeliveryMode(m)} className={`px-4 py-2 rounded-xl font-semibold ring-1 ${deliveryMode === m ? "shadow" : "opacity-80"}`} style={{ background: deliveryMode === m ? palette.dark : "white", color: deliveryMode === m ? "white" : palette.dark, borderColor: palette.accent }}>
                      {m}
                    </button>
                  ))}
                </div>

                {deliveryMode === "Entrega" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold" style={{ color: palette.dark }}>Local da entrega</label>
                      <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="mt-1 w-full rounded-xl ring-1 p-2 bg-white" style={{ ringColor: palette.accent }}>
                        {Object.keys(DELIVERY_FEE).map((k) => (
                          <option key={k}>{k}</option>
                        ))}
                      </select>
                      <p className="text-xs mt-1" style={{ color: palette.mid }}>Taxa: {money(DELIVERY_FEE[neighborhood] || 0)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold" style={{ color: palette.dark }}>Endereço completo</label>
                      <input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} placeholder="Rua, número, complemento" className="mt-1 w-full rounded-xl ring-1 p-2 bg-white" style={{ ringColor: palette.accent }} />
                    </div>
                    <div className="rounded-xl p-3" style={{ background: palette.accent }}>
                      <p className="text-sm" style={{ color: palette.dark }}>{deliveryWindowText()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-3" style={{ background: palette.accent }}>
                    <p className="text-sm" style={{ color: palette.dark }}>{pickupWindowText()}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold" style={{ color: palette.dark }}>Forma de pagamento</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)} className="mt-1 w-full rounded-xl ring-1 p-2 bg-white" style={{ ringColor: palette.accent }}>
                    {(["Pix", "Dinheiro", "Cartão"]).map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold" style={{ color: palette.dark }}>Seu nome</label>
                    <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="mt-1 w-full rounded-xl ring-1 p-2 bg-white" style={{ ringColor: palette.accent }} placeholder="Nome e sobrenome" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold" style={{ color: palette.dark }}>Seu telefone</label>
                    <input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} className="mt-1 w-full rounded-xl ring-1 p-2 bg-white" style={{ ringColor: palette.accent }} placeholder="(xx) xxxxx-xxxx" />
                  </div>
                </div>
              </div>

              <Cart items={items} onInc={inc} onDec={dec} onRemove={remove} onCheckout={onCheckout} summary={summary} />
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <p className="text-sm" style={{ color: palette.mid }}>
            © {new Date().getFullYear()} Doce Encanto · Amor em cada pote · Instagram: @doce.encanto
          </p>
        </div>
      </footer>
    </div>
  );
}
