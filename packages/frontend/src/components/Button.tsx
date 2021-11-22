import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border: 0;
  border-radius: 5px;
  color: #ffffff;
  line-height: 22.4px;
  padding: 13.2px 26.4px;
  text-align: center;
  width: 100%;
  font-weight: 500;
  transition-duration: 250ms;
  margin-bottom: 16px;
  outline: 0;

  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.danger};
`;
