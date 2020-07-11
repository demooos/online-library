import styled, { css } from 'styled-components/macro'

import animations from 'assets/animations'

interface ISCProps {
    isLoading?: boolean
}

export default styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    ${({ isLoading }: ISCProps) =>
        !isLoading &&
        css`
            animation: ${animations.fadeOut} 0.5s ease-in-out both;
            cursor: pointer;
        `};
`
