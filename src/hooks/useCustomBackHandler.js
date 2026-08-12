import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const useCustomBackHandler = () => {
    const location = useLocation();
    const { modalVisible } = useModal();

    useEffect(() => {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'PAGE_STATE',
            path: location.pathname,
            modal: modalVisible,
        }));
    }, [location.pathname, modalVisible]);
};

export default useCustomBackHandler;