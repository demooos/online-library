import { useState } from 'react'

import styled, { css } from 'styled-components/macro'

import * as Styled from './styled'

import { useCart } from 'hooks'

import * as StyledStore from '../../styled'

type StyledProps = {
   withPopup?: boolean
   withFlips?: boolean
}

const BookContainer = styled.div<StyledProps>`
   width: 100%;
   height: 100%;
   position: relative;
   ${({ withPopup }) =>
      withPopup
         ? css`
              width: 100%;
              @media (max-width: 1150px) {
                 max-height: 50%;
              }
           `
         : null}
   ${({ withFlips }) =>
      withFlips
         ? css`
              @media (max-width: 1150px) {
                 max-height: 100%;
              }
           `
         : null}
`

const Book = ({
   id,
   title,
   author,
   cover,
   price,
   setBookPopupData,
   withCart,
   withProfile,
   withPopup,
   withFlips,
}: IBook) => {
   const { cart, removeFromCart } = useCart()
   const [loading, setLoading] = useState(true)
   const handleBookPopup = () => {
      if (setBookPopupData) {
         setBookPopupData({
            id,
            title,
            author,
            cover,
            price,
         })
      }
   }
   const inCart = cart.includes(id)
   return (
      <BookContainer withPopup={withPopup} withFlips={withFlips}>
         <Styled.Loader
            onAnimationEnd={event => (event.currentTarget.style.display = 'none')}
            $loading={loading}
         />
         <Styled.Cover
            src={cover}
            onLoad={() => setLoading(false)}
            onError={event => {
               setLoading(true)
               event.currentTarget.src = `https://picsum.photos/1920/108${Math.floor(
                  Math.random() * 10
               )}`
            }}
         />
         <Styled.AnnotationsContainer>
            <Styled.Annotation>{author}</Styled.Annotation>
            <Styled.Annotation withTitle>{title}</Styled.Annotation>
         </Styled.AnnotationsContainer>
         {withCart ? (
            <StyledStore.Button onClick={() => removeFromCart(id)} price={price}>
               Remove
            </StyledStore.Button>
         ) : withProfile ? (
            <StyledStore.Button onClick={handleBookPopup}>Open</StyledStore.Button>
         ) : !withPopup ? (
            <StyledStore.Button
               onClick={() => {
                  if (!inCart) {
                     handleBookPopup()
                  }
               }}
               price={price}
               withoutHover={inCart}
            >
               {price ? (inCart ? 'In cart' : 'Buy') : 'Borrow'}
            </StyledStore.Button>
         ) : (
            withPopup &&
            price && (
               <StyledStore.Button price={price} withoutHover>
                  Price
               </StyledStore.Button>
            )
         )}
      </BookContainer>
   )
}

export default Book
