import styled from 'styled-components';

const Wrapper = styled.div`
  margin: auto;
  width: 41.6rem;
  border-radius: 8px;
  padding: 20px 30px 25px 30px;
  background-color: ${({ theme }) => theme.main.colors.white};
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.main.colors.darkGrey};
  border-top: 2px solid #ff5e00;
  `;
  // border-top: 2px solid ${({ theme }) => theme.main.colors.mediumBlue};
  // border-radius: ${({ theme }) => theme.main.sizes.borderRadius};

export default Wrapper;
