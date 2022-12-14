import { useState } from 'react'

import styled from 'styled-components/macro'

import { useStore } from './hooks'

import BookPopup from './modules/BookPopup/BookPopup'
import BookSuggestions from './modules/BookSuggestions/BookSuggestions'
import Books from './modules/Books/Books'

type StyledProps = {
   shouldMenuExpand?: boolean
}

export const StoreContainer = styled.section<StyledProps>`
   min-height: 100%;
   display: flex;
   justify-content: center;
   align-items: flex-start;
   transition: padding 0.4s ease-in-out;
   @media (min-width: 800px) {
      padding: 130px 20px 20px 20px;
   }
   @media (max-width: 800px) {
      flex-direction: column;
      padding: ${({ shouldMenuExpand }) =>
         shouldMenuExpand ? '330px 20px 20px 20px' : '120px 20px 20px 20px'};
   }
`

interface IStore {
   shouldMenuExpand?: boolean
}

const Store = ({ shouldMenuExpand }: IStore) => {
   const {
      loading,
      freeBooks,
      paidBooks,
      hasMoreFreeBooks,
      hasMorePaidBooks,
      setFreeBooks,
      setPaidBooks,
      getMoreBooks,
   } = useStore()
   const [bookPopupData, setBookPopupData] = useState<IBook>()
   const areThereFreeBooks = !!freeBooks.length
   const areTherePaidBooks = !!paidBooks.length
   return (
      <StoreContainer shouldMenuExpand={shouldMenuExpand}>
         {bookPopupData && <BookPopup {...bookPopupData} setBookPopupData={setBookPopupData} />}
         {!loading &&
            (!areThereFreeBooks && !areTherePaidBooks ? (
               <Books books={[]} error="There are no books in the library right now" />
            ) : areThereFreeBooks ? (
               <>
                  <Books
                     books={freeBooks}
                     header="Find here awesome books"
                     error="There are no free books in the library right now"
                     hasMore={hasMoreFreeBooks}
                     setBookPopupData={setBookPopupData}
                     searchInput={() => (
                        <BookSuggestions
                           freeBooks={freeBooks}
                           setFreeBooks={setFreeBooks}
                           paidBooks={paidBooks}
                           setPaidBooks={setPaidBooks}
                        />
                     )}
                     loadMore={() => getMoreBooks(freeBooks.length, 0)}
                     withMarginRight
                  />
                  <Books
                     books={paidBooks}
                     header="Choose some paid books"
                     error="There are no paid books in the library right now"
                     hasMore={hasMorePaidBooks}
                     setBookPopupData={setBookPopupData}
                     loadMore={() => getMoreBooks(0, paidBooks.length)}
                  />
               </>
            ) : (
               <>
                  <Books
                     books={paidBooks}
                     header="Choose some paid books"
                     error="There are no paid books in the library right now"
                     hasMore={hasMorePaidBooks}
                     setBookPopupData={setBookPopupData}
                     searchInput={() => (
                        <BookSuggestions
                           freeBooks={freeBooks}
                           setFreeBooks={setFreeBooks}
                           paidBooks={paidBooks}
                           setPaidBooks={setPaidBooks}
                        />
                     )}
                     loadMore={() => getMoreBooks(0, paidBooks.length)}
                     withMarginRight
                  />
                  <Books
                     books={freeBooks}
                     header="Find here awesome books"
                     error="There are no free books in the library right now"
                     hasMore={hasMoreFreeBooks}
                     setBookPopupData={setBookPopupData}
                     loadMore={() => getMoreBooks(freeBooks.length, 0)}
                  />
               </>
            ))}
      </StoreContainer>
   )
}

export default Store
