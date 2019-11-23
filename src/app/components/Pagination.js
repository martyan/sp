import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PaginationRoot = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const PaginationDot = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    width: 18px;
    cursor: pointer;
    border: 0;
    background: none;
    padding: 0;
`

const Inner = styled.div`
    background-color: ${({ active, isClose }) => active ? '#fff' : isClose ? '#fff' : '#bbb'};
    opacity: ${({ active }) => active ? 1 : .5};
    height: 5px;
    width: 5px;
    border-radius: 50%;
    margin: 3px;
    transition: .5s ease;
`

const Pagination = ({ index, dots, onIndexChange }) => {

    return (
        <PaginationRoot>
            {new Array(dots).fill(1).map((dot, i) => (
                <PaginationDot
                    key={i}
                    index={i}
                    onClick={() => onIndexChange(i)}
                    type="button"
                >
                    <Inner
                        active={i === index}
                        isClose={(i === index - 1 || i === index + 1)}
                    />
                </PaginationDot>
            ))}
        </PaginationRoot>
    )

}

Pagination.propTypes = {
    dots: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onIndexChange: PropTypes.func.isRequired
}

export default Pagination
