import React, { useState } from 'react'
import Menu from './components/Menu'
import Cart from './components/Cart'

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart([...cart, item])
  }

  const sendWhatsApp = () => {
    const message = cart.map(item => `- ${item}`).join('%0A')
    window.open(`https://wa.me/5599999999999?text=Meu pedido:%0A${message}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">🍰 Doce Encanto</h1>
      <Menu addToCart={addToCart} />
      <Cart cart={cart} sendWhatsApp={sendWhatsApp} />
    </div>
  )
}
