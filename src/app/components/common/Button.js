import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

const Button = ({ children, loading, onClick, className }) => (
        <button className={`button ${className || ''}`} onClick={onClick}>
            {children}

            {typeof loading !== 'undefined' && (
                <span className={loading ? 'loading visible' : 'loading'}>
                    <span className="double-bounce1"></span>
                    <span className="double-bounce2"></span>
                </span>
            )}
        </button>
)

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    loading: PropTypes.bool
}

export default Button
