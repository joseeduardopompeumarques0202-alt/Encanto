import React from 'react'

const items = [
  'Bolo no pote - Chocolate',
  'Bolo no pote - Morango',
  'Bolo no pote - Ninho com Nutella'
]

export default function Menu({ addToCart }) {
  return (
    <div className="grid gap-4 w-full max-w-md">
      {items.map((item, idx) => (
        <div key={idx} className="p-4 bg-white rounded-2xl shadow flex justify-between items-center">
          <span>{item}</span>
          <button 
            onClick={() => addToCart(item)} 
            className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600">
            Adicionar
          </button>
        </div>
      ))}
    </div>
  )
}
