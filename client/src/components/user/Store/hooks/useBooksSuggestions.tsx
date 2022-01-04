import { useState, useEffect } from 'react'

import Input from 'components/guest/Registration/modules/Input'

import * as Styled from '../styled'

import { axios } from 'utils'

type BooksSuggestions = {
    freeBooks: IBook[]
    setFreeBooks: ReactDispatch<IBook[]>
    paidBooks: IBook[]
    setPaidBooks: ReactDispatch<IBook[]>
    withProfile?: boolean
}

export const useBooksSuggestions = ({
    freeBooks,
    setFreeBooks,
    paidBooks,
    setPaidBooks,
    withProfile
}: BooksSuggestions) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [findByTitle, setFindByTitle] = useState(true)
    const [books, setBooks] = useState<IBook[]>([])
    useEffect(() => {
        const getSuggestions = async () => {
            const url = '/api/user/books/getSuggestions'
            const response = await axios.post(url, {
                title,
                author,
                withProfile
            })
            if (response) {
                const { books } = response.data
                setBooks(books)
            }
        }
        getSuggestions()
    }, [title, author, withProfile])
    const switchFindBy = () => {
        findByTitle ? setTitle('') : setAuthor('')
        setFindByTitle(findByTitle => !findByTitle)
    }
    const handleSort = (id: number, price: number) => {
        const filterOut = (book: IBook) => book.id !== id
        const filter = (book: IBook) => book.id === id
        if (!price) {
            const sortedFreeBooks = freeBooks.filter(filterOut)
            const sortedFreeBook = freeBooks.find(filter) || books.find(filter)!
            setFreeBooks([sortedFreeBook, ...sortedFreeBooks])
        } else {
            const sortedPaidBooks = paidBooks.filter(filterOut)
            const sortedPaidBook = paidBooks.find(filter) || books.find(filter)!
            setPaidBooks([sortedPaidBook, ...sortedPaidBooks])
        }
        findByTitle ? setTitle('') : setAuthor('')
    }
    const renderBooksSuggestionsInput = () => (
        <Styled.InputContainer>
            {findByTitle ? (
                <Input
                    id="title"
                    type="text"
                    value={title}
                    placeholder="Type book's title..."
                    error=""
                    onChange={event => setTitle(event.target.value)}
                    withBooksSuggestions
                />
            ) : (
                <Input
                    id="author"
                    type="text"
                    value={author}
                    placeholder="Type author's name..."
                    error=""
                    onChange={event => setAuthor(event.target.value)}
                    withBooksSuggestions
                />
            )}
            <Styled.Switcher onClick={switchFindBy}>
                By {findByTitle ? 'author' : 'title'}
            </Styled.Switcher>
            <Styled.SuggestionsContainer>
                {books.map(({ id, title, author, price }) => (
                    <Styled.Suggestion key={id} onClick={() => handleSort(id, price)}>
                        "{title}" written by {author}
                    </Styled.Suggestion>
                ))}
            </Styled.SuggestionsContainer>
        </Styled.InputContainer>
    )
    return {
        renderBooksSuggestionsInput
    }
}