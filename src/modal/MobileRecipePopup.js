import ReactDOM from 'react-dom';
import styled from 'styled-components';
import MobileRecipeDetail from '../components/MobileRecipeDetail';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 9999;
  overflow-y: auto;
`;

export default function MobileRecipePopup({ callback, item, totalitem }) {
  return ReactDOM.createPortal(
    <Overlay>
      <MobileRecipeDetail item={item} totalitem={totalitem} callback={callback} />
    </Overlay>,
    document.getElementById('modal-root')
  );
}
