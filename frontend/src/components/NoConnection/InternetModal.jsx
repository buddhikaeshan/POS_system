import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const InternetModal = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null; 
  }

  return (
    <ModalWrapper>
      <ModalContent>
        <h2>No Internet Connection</h2>
        <p>Please check your connection and try again.</p>
        <StyledLoader>
          <div className="loader">
            <div className="loader__bar" />
            <div className="loader__bar" />
            <div className="loader__bar" />
            <div className="loader__bar" />
            <div className="loader__bar" />
            <div className="loader__ball" />
          </div>
        </StyledLoader>
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h2 {
    margin-bottom: 10px;
    font-size: 24px;
  }

  p {
    margin-bottom: 20px;
    font-size: 16px;
    color: #666;
  }
`;

const StyledLoader = styled.div`
  .loader {
    position: relative;
    width: 75px;
    height: 100px;
    margin: 0 auto;
  }

  .loader__bar {
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 50%;
    background: rgb(0, 0, 0);
    transform-origin: center bottom;
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  }

  .loader__bar:nth-child(1) {
    left: 0px;
    transform: scale(1, 0.2);
    animation: barUp1 4s infinite;
  }

  .loader__bar:nth-child(2) {
    left: 15px;
    transform: scale(1, 0.4);
    animation: barUp2 4s infinite;
  }

  .loader__bar:nth-child(3) {
    left: 30px;
    transform: scale(1, 0.6);
    animation: barUp3 4s infinite;
  }

  .loader__bar:nth-child(4) {
    left: 45px;
    transform: scale(1, 0.8);
    animation: barUp4 4s infinite;
  }

  .loader__bar:nth-child(5) {
    left: 60px;
    transform: scale(1, 1);
    animation: barUp5 4s infinite;
  }

  .loader__ball {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 10px;
    height: 10px;
    background: rgb(44, 143, 255);
    border-radius: 50%;
    animation: ball624 4s infinite;
  }

  /* Add your keyframes here */
`;

export default InternetModal;
