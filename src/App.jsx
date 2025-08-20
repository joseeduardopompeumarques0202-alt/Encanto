import React, { useState } from 'react'

const produtos = [
  { id: 1, nome: "Bolo no pote de Chocolate", preco: 10 },
  { id: 2, nome: "Bolo no pote de Morango", preco: 12 },
  { id: 3, nome: "Bolo no pote de Doce de Leite", preco: 11 },
];

export default function App() {
  const [carrinho, setCarrinho] = useState([]);

  const adicionar = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  const finalizarPedido = () => {
    const mensagem = carrinho.map(p => `- ${p.nome} R$${p.preco}`).join('%0A')
      + `%0ATotal: R$${total}`;
    window.open(`https://wa.me/5591999999999?text=Olá! Quero fazer um pedido:%0A${mensagem}`, "_blank");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🍰 Doce Encanto</h1>
      <h2>Cardápio</h2>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nome} - R${p.preco}
            <button onClick={() => adicionar(p)}>Adicionar</button>
          </li>
        ))}
      </ul>
      <h2>Carrinho</h2>
      <ul>
        {carrinho.map((item, i) => (
          <li key={i}>{item.nome} - R${item.preco}</li>
        ))}
      </ul>
      <h3>Total: R${total}</h3>
      {carrinho.length > 0 && (
        <button onClick={finalizarPedido}>Finalizar Pedido via WhatsApp</button>
      )}
    </div>
  );
}
