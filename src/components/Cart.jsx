import React from 'react'

export default function Cart({ cart, sendWhatsApp }) {
  return (
    <div className="mt-6 p-4 bg-white rounded-2xl shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Carrinho</h2>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <ul className="list-disc ml-5">
          {cart.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      )}
      <button 
        onClick={sendWhatsApp} 
        className="mt-4 w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600">
        Finalizar Pedido no WhatsApp
      </button>
    </div>
  )
}
