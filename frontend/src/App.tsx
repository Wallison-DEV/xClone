import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import Rotas from "./routes"
import { EstiloGlobal } from "./styles"
import { store } from "./Store"

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <EstiloGlobal />
        <Rotas />
      </BrowserRouter>
    </Provider>
  )
}

export default App
