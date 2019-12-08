import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TextArea.scss'

class TextArea extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        error: PropTypes.string,
        validate: PropTypes.func
    }

    state = {
        pristine: true,
        rows: 1,
        minRows: 1,
        maxRows: 99
    }

    handleChange = (e) => {
        const { onChange, disabled, validate } = this.props
        const { pristine } = this.state

        if(disabled) return false
        if(pristine) this.setState({pristine: false})

        this.handleResize(e)
        onChange(e.target.value)

        if(validate) validate(value)
    }

    handleResize = (e) => {
        const textareaLineHeight = 24
        const { minRows, maxRows } = this.state

        const previousRows = e.target.rows
        e.target.rows = minRows // reset number of rows in textarea

        const currentRows = ~~(e.target.scrollHeight / textareaLineHeight)

        if(currentRows === previousRows) e.target.rows = currentRows

        if(currentRows >= maxRows) {
            e.target.rows = maxRows
            e.target.scrollTop = e.target.scrollHeight
        }

        this.setState({rows: currentRows < maxRows ? currentRows : maxRows})
    }

    handleBlur = () => {
        const { value, validate } = this.props
        const { pristine } = this.state

        if(validate && !pristine) validate(value)
    }

    render = () => {
        const { value, placeholder, disabled, error } = this.props
        const { rows } = this.state

        return (
            <div className={error.length ? 'text-area error' : 'text-area'}>

                <div className="wrapper">
                    <textarea
                        rows={rows}
                        value={value}
                        onChange={this.handleChange}
                        placeholder={placeholder}
                        disabled={!!disabled}
                        onBlur={this.handleBlur}
                    ></textarea>
                </div>

                {error && <div className="error">{error}</div>}

            </div>
        )
    }

}

export default TextArea
