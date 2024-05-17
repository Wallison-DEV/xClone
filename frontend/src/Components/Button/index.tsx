import { ButtonLink, ButtonStyle } from "./styles"

const Button = ({ variant, children, type, className, onClick, maxwidth }: ButtonProps) => {
    if (type === 'link') {
        return (
            <ButtonLink className={className} type='link' variant={variant} onClick={onClick} maxwidth={maxwidth}>{children}</ButtonLink>
        )
    } else {
        return (
            <ButtonStyle className={className} type={type} variant={variant} onClick={onClick} maxwidth={maxwidth}>{children}</ButtonStyle>
        )
    }
}

export default Button