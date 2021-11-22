import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

//deo hieu clg here phai doc lai

const ModalHolder = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalMask = styled.div`
  border-radius: 8px;
  padding: 20px 16px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-height: 384px;
  width: 80%;
  line-height: 25.2px;
`;
export const ModalMaskHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: inherit;
  height: 100%;
  color: #000;
`;

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
`;

const ModalTitle = styled.h3`
  flex: 1;
`;

const ModalCloseButton = styled.button`
  all: unset;
  color: #000;
  cursor: pointer;
`;
interface ModalProps {
  children: React.ReactNode;
  title: string;
  onCancel: () => void;
}

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);

export const Modal = ({ children, title, onCancel }: ModalProps) => {
  return ReactDOM.createPortal(
    <ModalHolder>
      <ModalMaskHolder>
        <ModalMask>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalCloseButton onClick={onCancel}>x</ModalCloseButton>
          </ModalHeader>
          {children}
        </ModalMask>
      </ModalMaskHolder>
    </ModalHolder>,
    modalRoot,
  );
};
