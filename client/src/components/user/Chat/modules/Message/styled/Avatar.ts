import styled, { css } from 'styled-components/macro'

type StyledProps = {
   withCurrentUser?: boolean
}

export const Avatar = styled.div<StyledProps>`
   width: 40px;
   height: 40px;
   border-radius: 50%;
   background: white;
   color: black;
   font-weight: bold;
   margin-left: 15px;
   cursor: pointer;
   display: flex;
   justify-content: center;
   align-items: center;
   position: absolute;
   bottom: -2px;
   right: -50px;
   @media (max-width: 800px) {
      width: 30px;
      height: 30px;
      right: -40px;
   }
   ${({ withCurrentUser }) =>
      withCurrentUser
         ? css`
              left: -70px;
              @media (max-width: 800px) {
                 left: -55px;
              }
           `
         : null}
`
