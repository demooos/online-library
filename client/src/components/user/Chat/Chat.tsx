import React, { useRef, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import axios from 'axios'

import { StoreContainer } from 'components/user/Store/Store'

import * as StyledStore from 'components/user/Store/styled'
import * as Styled from './styled'

import Composed from './composed'

import hooks from 'hooks'

import utils from 'utils'

type ChatContainerType = {
    areThereMessages?: boolean
}

const ChatContainer = styled(StoreContainer)<ChatContainerType>`
    ${({ areThereMessages }) =>
        areThereMessages
            ? css`
                  justify-content: flex-start;
              `
            : css`
                  height: 100vh;
                  padding-bottom: 90px;
                  align-items: center;
              `}
`

interface IChat {
    shouldMenuExpand?: boolean
}

const Chat: React.FC<IChat> = ({ shouldMenuExpand }) => {
    const { socket } = useSocket()
    const { lastUnreadMessageIndex, setUnreadMessagesAmount } = useMessages()
    const messagesRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const endOfMessages = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentUserId, setCurrentUserId] = useState<string | undefined>()
    const [currentUserName, setCurrentUserName] = useState<string | undefined>()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const [shouldFileInputExist, setShouldFileInputExist] = useState(true)
    const [percentage, setPercentage] = useState(0)
    const areThereMessages = messages.length > 0
    const isFileUploading = percentage > 0
    useEffect(() => {
        getMessages(20, 0, undefined)
        setTimeout(() => {
            utils.subscribePushNotifications('/api/user/chat/subscribePushNotifications')
        }, 2000)
    }, [])
    useEffect(() => {
        const handleOnSendMessage = (message: IMessage) => {
            setMessages(messages => [...messages, message])
            if (message.type === 'MESSAGE' || message.type === 'FILE') {
                scrollToLastMessage(0)
            }
            socket!.emit('readMessages')
        }
        if (socket) {
            socket.on('sendMessage', handleOnSendMessage)
        }
        return () => {
            if (socket) {
                socket.off('sendMessage', handleOnSendMessage)
            }
        }
    }, [socket])
    const getMessages = async (
        limit: number,
        offset: number,
        event: React.UIEvent<HTMLDivElement> | undefined
    ) => {
        const url = '/api/user/chat/getMessages'
        if (event) {
            const target = event.target as any
            if (target.scrollTop <= 0 && hasMoreMessages) {
                const response = await axios.post(url, {
                    limit,
                    offset
                })
                if (response) {
                    const { messages: loadedMessages } = response.data
                    setHasMoreMessages(loadedMessages.length !== 0)
                    const lastScroll = target.scrollHeight
                    setMessages(messages => [...loadedMessages, ...messages])
                    target.scrollTop = target.scrollHeight - lastScroll
                    if (loadedMessages.length + messages.length >= lastUnreadMessageIndex!) {
                        setUnreadMessagesAmount(0)
                    }
                }
            }
        }
        if (!e) {
            const response = await axios.post(url, {
                limit,
                offset
            })
            if (response) {
                setIsLoading(false)
                const { messages, userId, userName } = response.data
                setCurrentUserId(userId)
                setCurrentUserName(userName)
                setMessages(messages)
                pushToLastMessage()
                if (messages.length >= lastUnreadMessageIndex!) {
                    setUnreadMessagesAmount(0)
                }
            }
        }
    }
    const getUnreadMessages = async () => {
        const url = '/api/user/chat/getMessages'
        const response = await axios.post(url, {
            limit: lastUnreadMessageIndex,
            offset: 0
        })
        if (response) {
            const { messages } = response.data
            setMessages(messages)
            setTimeout(() => (messagesRef.current!.scrollTop = 1), 0)
            setUnreadMessagesAmount(0)
        }
    }
    const scrollToLastMessage = (delay: number) =>
        setTimeout(
            () =>
                endOfMessages.current &&
                endOfMessages.current.scrollIntoView({
                    behavior: 'smooth'
                }),
            delay
        )
    const pushToLastMessage = () =>
        setTimeout(() => {
            const messages = messagesRef.current
            messages && (messages.scrollTop = messages.scrollHeight)
        }, 0)
    const sendMessage = async () => {
        if (message.trim()) {
            const lastMessage = messages[messages.length - 1]
            const id = lastMessage ? lastMessage.id + 1 : 0
            const _message = {
                id,
                type: 'MESSAGE',
                content: message,
                userId: currentUserId,
                userName: currentUserName,
                createdAt: new Date()
            }
            setMessages(messages => [...messages, _message] as IMessage[])
            pushToLastMessage()
            setTimeout(() => {
                setMessage('')
            }, 0)
            try {
                const url = '/api/user/chat/sendMessage'
                const response = await axios.post(url, {
                    content: message
                })
                if (response) {
                    socket!.emit('sendMessage', _message)
                }
            } catch (error) {
                const conversation = messages
                setMessages(conversation)
                handleApiError(error)
            }
        }
    }
    const sendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let intervalId: any
        let percentage = 0
        const file = event.currentTarget.files![0]
        if (file) {
            const path = event.currentTarget.value
            const { name, size } = file
            const imageExtensions = /\.(jpg|jpeg|png|gif)$/i
            const videoExtensions = /\.(mp4)$/i
            const fileExtensions = /\.(txt|rtf|doc|docx|xlsx|ppt|pptx|pdf)$/i
            const isImage = imageExtensions.test(path) || imageExtensions.test(name)
            const isVideo = videoExtensions.test(path) || videoExtensions.test(name)
            const isFile = fileExtensions.test(path) || fileExtensions.test(name)
            const resetFileInput = () => {
                setShouldFileInputExist(false)
                setShouldFileInputExist(true)
            }
            const largeSizeError = () => {
                return setApiFeedback(
                    'Sending a file',
                    'You cannot send file with such a large size',
                    'Okey'
                )
            }
            if (!isImage && !isVideo && !isFile) {
                resetFileInput()
                return setApiFeedback(
                    'Sending a file',
                    'You cannot send file with such an extension',
                    'Okey'
                )
            }
            if (isImage) {
                if (size > 31457280) {
                    resetFileInput() // 30MB
                    largeSizeError()
                }
            }
            if (isVideo) {
                if (size > 52428800) {
                    resetFileInput() // 50MB
                    largeSizeError()
                }
            }
            if (isFile) {
                if (size > 10485760) {
                    resetFileInput() // 10MB
                    largeSizeError()
                }
            }
            const form = new FormData()
            form.append('file', file)
            try {
                const url = '/api/user/chat/sendFile'
                intervalId = setInterval(() => {
                    if (percentage < 100) {
                        percentage++
                        setPercentage(percentage => percentage + 1)
                    }
                }, 500)
                const response = await axios.post(url, form)
                if (response) {
                    setPercentage(100)
                    clearInterval(intervalId)
                    setTimeout(() => {
                        setPercentage(0)
                    }, 800)
                    const { type, content } = response.data
                    const lastMessage = messages[messages.length - 1]
                    const id = lastMessage ? lastMessage.id + 1 : 0
                    const message = {
                        id,
                        type,
                        content,
                        userId: currentUserId,
                        userName: currentUserName,
                        createdAt: new Date()
                    }
                    setMessages([...messages, message] as IMessage[])
                    scrollToLastMessage(0)
                    resetFileInput()
                    socket!.emit('sendMessage', message)
                }
            } catch (error) {
                setApiFeedback(
                    'Sending a file',
                    'There was an unexpected problem when sending the file',
                    'Okey'
                )
                resetFileInput()
                clearInterval(intervalId)
                setPercentage(0)
            }
        }
    }
    return (
        <ChatContainer shouldMenuExpand={shouldMenuExpand} areThereMessages={areThereMessages}>
            {!isLoading && lastUnreadMessageIndex && messages.length < lastUnreadMessageIndex && (
                <Styled.MessagesInfo onClick={getUnreadMessages}>
                    Unread messages
                </Styled.MessagesInfo>
            )}
            {!isLoading &&
                (areThereMessages ? (
                    <Composed.Messages
                        ref={messagesRef}
                        endOfMessages={endOfMessages}
                        messages={messages}
                        currentUserId={currentUserId}
                        onTouchStart={() =>
                            utils.detectMobileDevice() &&
                            textareaRef.current &&
                            textareaRef.current.blur()
                        }
                        onScroll={(event: React.UIEvent<HTMLDivElement>) =>
                            getMessages(20, messages.length, e)
                        }
                        scrollToLastMessage={scrollToLastMessage}
                    />
                ) : (
                    <StyledStore.Warning>There are no messages</StyledStore.Warning>
                ))}
            <Styled.TextareaContainer>
                <Styled.Textarea
                    ref={textareaRef}
                    value={message}
                    placeholder="Type your message..."
                    disabled={isFileUploading}
                    onChange={event => setMessage(event.target.value)}
                    onFocus={() => scrollToLastMessage(500)}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            switch (true) {
                                case utils.detectMobileDevice() as boolean:
                                    return
                                case !event.currentTarget.value.trim():
                                    event.preventDefault()
                                    break
                                case !event.shiftKey:
                                    sendMessage()
                                    break
                            }
                        }
                    }}
                />
                {isFileUploading ? (
                    <Composed.ProgressLoader percentage={percentage} />
                ) : (
                    <StyledStore.Button as="label" htmlFor="file" withChat>
                        Upload file
                    </StyledStore.Button>
                )}
                {shouldFileInputExist && <Styled.FileInput onChange={sendFile} />}
                <StyledStore.Button
                    onClick={() => {
                        sendMessage()
                        utils.detectMobileDevice() && textareaRef.current!.focus()
                    }}
                    withChat
                >
                    Send
                </StyledStore.Button>
            </Styled.TextareaContainer>
        </ChatContainer>
    )
}

export default Chat
