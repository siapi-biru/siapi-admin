import styled from 'styled-components';

const A = styled.a`
  display: flex;
  position: relative;
  padding-top: 1rem;
  padding-bottom: 0.2rem;
  padding-left: 1.6rem;
  min-height: 3.6rem;
  line-height: 1.8rem;
  border-left: 0.3rem solid transparent;
  cursor: pointer;
  color: ${props => props.theme.main.colors.leftMenu['link-color']};
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  margin-left: 10px;

  &:hover {
    color: black !important;
    background: rgb(255, 94, 0, 0.5);
    text-decoration: none;
    border-radius: 8px;
  }

  &:focus {
    color: ${props => props.theme.main.colors.white};
    text-decoration: none;
  }

  &:visited {
    color: ${props => props.theme.main.colors.leftMenu['link-color']};
  }

  &.linkActive {
    color: black !important;
    background-color: #eceff5;
    border-radius: 8px;
  }
`;

export default A;
