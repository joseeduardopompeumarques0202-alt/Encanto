import React, { useMemo, useState } from "react";

export default function App() {
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [comboSelections, setComboSelections] = useState({});

  const classicFlavors = [
    { name: "Cenoura com chocolate", price: 10, desc: "Massa fofinha de cenoura com cobertura cremosa de chocolate." },
    { name: "Chocolate", price: 12, desc: "O clássico favorito, bolo de chocolate bem molhadinho." },
    { name: "Ninho", price: 11, desc: "Creme suave de leite Ninho em camadas irresistíveis." },
  ];

  const specialFlavors = [
    { name: "Oreo", price: 14, desc: "Creme delicioso com pedacinhos crocantes de Oreo." },
    { name: "Ninho com morango", price: 14, desc: "Camadas de creme Ninho com morangos frescos." },
  ];

  const combos = [
    { name: "Combo 3 Sabores", price: 30, quantity: 3, desc: "Escolha 3 sabores diferentes por apenas R$30." },
    { name: "Combo 5 Sabores", price: 50, quantity: 5, desc: "Escolha 5 sabores diferentes por apenas R$50." },
  ];

  const deliveries = [
    { name: "Vila (R$3) - Entrega às 16h", price: 3 },
    { name: "Tucuruí (R$5) - Entrega às 18h", price: 5 },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.price, 0);
  }, [cart]);

  const handleComboSelection = (comboName, flavor) => {
    setComboSelections((prev) => {
      const current = prev[comboName] || [];
      if (current.includes(flavor)) {
        return { ...prev, [comboName]: current.filter((f) => f !== flavor) };
      } else {
        return { ...prev, [comboName]: [...current, flavor] };
      }
    });
  };

  const finalizeOrder = () => {
    if (!name || !address || !delivery) {
      alert("Preencha todos os campos antes de finalizar o pedido!");
      return;
    }

    let message = `🍰 Pedido Doce Encanto 🍰\n\nCliente: ${name}\nEndereço: ${address}\n\nItens:\n`;

    cart.forEach((item, i) => {
      if (item.quantity) {
        message += `- ${item.name} (R$${item.price})\n`;
        if (comboSelections[item.name]) {
          message += `   Sabores: ${comboSelections[item.name].join(", ")}\n`;
        }
      } else {
        message += `- ${item.name} (R$${item.price})\n`;
      }
    });

    const deliveryItem = deliveries.find((d) => d.name === delivery);
    if (deliveryItem) {
      message += `\nEntrega: ${deliveryItem.name}`;
    }

    message += `\n\nTotal: R$${total + (deliveryItem ? deliveryItem.price : 0)}\n`;
    message += `\nObs: Todos os potes têm 250g.`;

    const phone = "5591999999999"; // coloque seu número do WhatsApp aqui
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <img src="/logo.jpeg" alt="Logo Doce Encanto" className="mx-auto w-32 h-32 rounded-full shadow mb-4" />
      <h1 className="text-3xl font-bold mb-2">Doce Encanto</h1>
      <p className="mb-6 text-gray-600">Todos os potes têm 250g 🍯</p>

      {/* Sabores Clássicos */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Sabores Clássicos</h2>
      <div className="grid gap-4">
        {classicFlavors.map((flavor, i) => (
          <div key={i} className="p-4 border rounded-xl shadow bg-white">
            <h3 className="font-bold">{flavor.name} - R${flavor.price}</h3>
            <p className="text-sm text-gray-600 mb-2">{flavor.desc}</p>
            <button
              onClick={() => addToCart(flavor)}
              className="bg-pink-500 text-white px-4 py-1 rounded-lg shadow hover:bg-pink-600"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>

      {/* Sabores Especiais */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Sabores Especiais</h2>
      <div className="grid gap-4">
        {specialFlavors.map((flavor, i) => (
          <div key={i} className="p-4 border rounded-xl shadow bg-white">
            <h3 className="font-bold">{flavor.name} - R${flavor.price}</h3>
            <p className="text-sm text-gray-600 mb-2">{flavor.desc}</p>
            <button
              onClick={() => addToCart(flavor)}
              className="bg-pink-500 text-white px-4 py-1 rounded-lg shadow hover:bg-pink-600"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>

      {/* Combos */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Combos</h2>
      <div className="grid gap-4">
        {combos.map((combo, i) => (
          <div key={i} className="p-4 border rounded-xl shadow bg-white">
            <h3 className="font-bold">{combo.name} - R${combo.price}</h3>
            <p className="text-sm text-gray-600 mb-2">{combo.desc}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {[...classicFlavors, ...specialFlavors].map((flavor, j) => (
                <button
                  key={j}
                  onClick={() => handleComboSelection(combo.name, flavor.name)}
                  className={`px-2 py-1 rounded-lg border ${
                    comboSelections[combo.name]?.includes(flavor.name)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {flavor.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => addToCart(combo)}
              className="bg-pink-500 text-white px-4 py-1 rounded-lg shadow hover:bg-pink-600"
            >
              Adicionar Combo
            </button>
          </div>
        ))}
      </div>

      {/* Carrinho */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Carrinho</h2>
      <div className="bg-gray-50 p-4 rounded-xl shadow">
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between items-center mb-2">
            <span>
              {item.name} - R${item.price}
              {item.quantity && comboSelections[item.name] && (
                <span className="text-sm text-gray-500">
                  {" "}
                  ({comboSelections[item.name].join(", ")})
                </span>
              )}
            </span>
            <button onClick={() => removeFromCart(i)} className="text-red-500">
              Remover
            </button>
          </div>
        ))}
        <p className="font-bold mt-2">Total: R${total}</p>
      </div>

      {/* Dados de entrega */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Entrega</h2>
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Seu endereço"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <select
        value={delivery}
        onChange={(e) => setDelivery(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      >
        <option value="">Selecione a entrega</option>
        {deliveries.map((d, i) => (
          <option key={i} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

      <button
        onClick={finalizeOrder}
        className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600"
      >
        Finalizar Pedido no WhatsApp
      </button>
    </div>
  );
}
