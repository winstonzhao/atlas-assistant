import { useState } from 'react'
import './styles/App.css'

function App() {
  const [greeting, setGreeting] = useState('Welcome to Atlas')

  return (
    <div className="app">
      <header className="app-header">
        <h1>{greeting}</h1>
        <p>Your Adaptive AI Assistant</p>
      </header>
      <main className="app-main">
        <div className="chat-container">
          {/* Chat interface will go here */}
        </div>
      </main>
    </div>
  )
}

export default App
