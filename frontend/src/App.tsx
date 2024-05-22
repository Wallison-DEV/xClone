import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import Rotas from "./routes"
import { EstiloGlobal } from "./styles"
import { store } from "./Store"
import { useState } from 'react'
import TemaDark from './Themes/dark'
import TemaLight from './Themes/light'

function App() {
  const [estaUsandoTemaDark, setEstaUsandoTemaDark] = useState(false)

  function togleTheme() {
    setEstaUsandoTemaDark(!estaUsandoTemaDark)
  }

  return (
    <ThemeProvider theme={estaUsandoTemaDark ? TemaDark : TemaLight}>
      <Provider store={store}>
        <BrowserRouter>
          <EstiloGlobal />
          <Rotas isDarkTheme={estaUsandoTemaDark} togleTheme={togleTheme} />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

export default App
