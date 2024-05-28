import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        <GoogleOAuthProvider clientId='297868879617-6igc8ikt47juhj3p5kkg6agn5t7175bs.apps.googleusercontent.com'>
          <BrowserRouter>
            <EstiloGlobal />
            <Rotas isDarkTheme={estaUsandoTemaDark} togleTheme={togleTheme} />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
