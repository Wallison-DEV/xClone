import { Modal } from '../../styles'
import Button from '../Button';
import * as S from './styles'

interface ConfirmModalProps {
    text: string;
    onClose?: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ text, onClose }) => {
    return (
        <>
            <Modal>
                <S.ConfirmDiv>
                    <p>{text}</p>
                    <Button variant='light' onClick={onClose}>Ok</Button>
                </S.ConfirmDiv>
                <div className='overlay' onClick={onClose} />
            </Modal>
        </>
    )
}

export default ConfirmModal