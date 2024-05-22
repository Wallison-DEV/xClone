import likeIcon from '../assets/icons/likeLight.png';
import xLogo from '../assets/img/twitter-white-logo.png'

const TemaDark = {
    corDeFundo: '#282a35',
    corDoTexto: '#f1f1f1',
    corDoTextoSecundario : '#c1c1c1',
    corDoHover: '#111',
    likeIcon:  likeIcon,
    xLogo: xLogo,
    boxShadow: "0px 0px 4px 0px rgba(277, 277, 277, 0.6)",
}

export default TemaDark

export type Theme = {
    corPrincipal: string
    corSecundaria: string
    corDeFundo: string
    corDeFundoBotao: string
    corDaBorda: string
}
