import styled, { css } from 'styled-components/macro'

type StyledProps = {
   withLessHeight?: boolean
   isKeyboardOpened?: boolean
   withFlips?: boolean
}

export const ContentContainer = styled.div<StyledProps>`
   width: 60%;
   height: 70%;
   background: white;
   padding: 18px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   @media (max-width: 1150px) {
      width: 55%;
      height: 80%;
      flex-direction: column;
   }
   @media (max-width: 900px) {
      width: 80%;
      height: 80%;
   }
   @media (max-width: 600px) {
      width: 90%;
      height: 90%;
   }
   ${({ withLessHeight }) =>
      withLessHeight
         ? css`
              height: 50% !important;
              @media (max-width: 600px) {
                 height: 60% !important;
              }
           `
         : null};
   ${({ isKeyboardOpened }) =>
      isKeyboardOpened
         ? css`
              height: 80% !important;
              @media (max-width: 600px) {
                 height: 80% !important;
              }
           `
         : null};
   ${({ withFlips }) =>
      withFlips
         ? css`
              background: none;
              justify-content: center;
              align-items: center;
              flex-direction: column;
           `
         : null};
`
