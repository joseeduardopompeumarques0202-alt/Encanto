import React, { useState, useMemo } from "react";

// === Doce Encanto – Site para Instagram Bio === //
// - TailwindCSS pronto
// - Menu de sabores, combos, entrega e retirada
// - Botão "Finalizar Pedido" abre o WhatsApp com os detalhes preenchidos
// - Logo em /logo.png (coloque sua imagem no public como logo.png)
// - Paleta segue sua identidade marrom + rosa

const App = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [entrega, setEntrega] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");

  const produtos = {
    classicos: [
      { nome: "Cenoura com chocolate", preco: 10 },
      { nome: "Chocolate", preco: 12 },
      { nome: "Ninho", preco: 11 },
    ],
    especiais: [
      { nome: "Oreo", preco: 14 },
      { nome: "Ninho com morango", preco: 14 },
    ],
    combos: [
      {
        nome: "Combo 3 Sabores",
        preco: 30,
        quantidade: 3,
      },
      {
        nome: "Combo 5 Sabores",
        preco: 50,
        quantidade: 5,
      },
    ],
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, { ...produto }]);
  };

  const removerDoCarrinho = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
  };

  const total = useMemo(() => {
    let soma = carrinho.reduce((acc, item) => acc + item.preco, 0);
    if (entrega === "vila") soma += 3;
    if (entrega === "tucurui") soma += 5;
    return soma;
  }, [carrinho, entrega]);

  const finalizarPedido = () => {
    let mensagem = `🍰 *Pedido Doce Encanto* 🍰\n\n`;

    carrinho.forEach((item, i) => {
      mensagem += `${i + 1}. ${item.nome} - R$${item.preco}\n`;
    });

    mensagem += `\n📦 Total: R$${total}\n`;

    if (entrega === "vila") {
      mensagem += `🚚 Entrega na *Vila* (Taxa R$3, saída às 16h)\n`;
    } else if (entrega === "tucurui") {
      mensagem += `🚚 Entrega em *Tucuruí* (Taxa R$5, saída às 18h)\n`;
    } else {
      mensagem += `✅ Retirada no local\n`;
    }

    if (nome) mensagem += `\n🙍 Nome: ${nome}`;
    if (endereco) mensagem += `\n🏠 Endereço: ${endereco}`;

    const url = `https://wa.me/5594999999999?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-pink-50 text-brown-900 flex flex-col items-center">
      {/* Logo */}
      <header className="py-6 flex flex-col items-center">
        <img src="/logo.png" alt="Logo Doce Encanto" className="w-40 h-40" />
        <h1 className="text-3xl font-bold text-brown-700">Doce Encanto</h1>
        <p className="italic text-brown-600 mt-2">
          Bolo no pote • 250g cada
        </p>
      </header>

      {/* Produtos */}
      <main className="w-full max-w-2xl px-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-brown-700">
            Sabores Clássicos
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {produtos.classicos.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-3 rounded-2xl shadow"
              >
                <span>{p.nome}</span>
                <button
                  onClick={() => adicionarAoCarrinho(p)}
                  className="bg-pink-400 text-white px-3 py-1 rounded-xl"
                >
                  R${p.preco}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-brown-700">
            Sabores Especiais
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {produtos.especiais.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-3 rounded-2xl shadow"
              >
                <span>{p.nome}</span>
                <button
                  onClick={() => adicionarAoCarrinho(p)}
                  className="bg-pink-400 text-white px-3 py-1 rounded-xl"
                >
                  R${p.preco}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-brown-700">
            Combos
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {produtos.combos.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-3 rounded-2xl shadow"
              >
                <span>{p.nome}</span>
                <button
                  onClick={() => {
                    const sabores = prompt(
                      `Digite quais ${p.quantidade} sabores deseja para o ${p.nome}:`
                    );
                    adicionarAoCarrinho({ ...p, nome: `${p.nome} (${sabores})` });
                  }}
                  className="bg-pink-400 text-white px-3 py-1 rounded-xl"
                >
                  R${p.preco}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Carrinho */}
      <aside className="w-full max-w-2xl px-4 mt-8 mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-brown-700">
          Carrinho
        </h2>
        {carrinho.length === 0 && (
          <p className="text-gray-500">Seu carrinho está vazio</p>
        )}
        {carrinho.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded-2xl shadow"
          >
            <span>{item.nome}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">R${item.preco}</span>
              <button
                onClick={() => removerDoCarrinho(i)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          </div>
        ))}

        {/* Entrega */}
        <div className="mt-6">
          <label className="block font-medium mb-2 text-brown-700">
            Tipo de entrega
          </label>
          <select
            value={entrega}
            onChange={(e) => setEntrega(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Retirada no local</option>
            <option value="vila">Entrega na Vila (R$3, saída 16h)</option>
            <option value="tucurui">Entrega em Tucuruí (R$5, saída 18h)</option>
          </select>
        </div>

        {/* Nome e Endereço */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded-lg p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Endereço (se entrega)"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>R${total}</span>
        </div>

        <button
          onClick={finalizarPedido}
          className="w-full mt-4 bg-pink-500 text-white py-3 rounded-2xl text-lg font-semibold shadow"
        >
          Finalizar Pedido no WhatsApp
        </button>
      </aside>
    </div>
  );
};

export default App;
