import styled from 'styled-components';

const Bloc = styled.div`
  background: ${({ theme }) => theme.main.colors.white};
  box-shadow: 0 2px 4px #e3e9f3;
  border-radius: 8px;
  `;
  // border-radius: ${({ theme }) => theme.main.sizes.borderRadius};

export default Bloc;