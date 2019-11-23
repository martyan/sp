import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 18,
        width: 18,
        cursor: 'pointer',
        border: 0,
        background: 'none',
        padding: 0,
    },
    dot: {
        backgroundColor: '#e4e6e7',
        height: 5,
        width: 5,
        borderRadius: '50%',
        margin: 3,
    },
    active: {
        backgroundColor: '#059033',
    },
};

class PaginationDot extends React.Component {
    handleClick = event => {
        this.props.onClick(event, this.props.index);
    };

    render() {
        const { active } = this.props;

        let styleDot;

        if (active) {
            styleDot = Object.assign({}, styles.dot, styles.active);
        } else {
            styleDot = styles.dot;
        }

        return (
            <button type="button" style={styles.root} onClick={this.handleClick}>
                <div style={styleDot} />
            </button>
        );
    }
}

PaginationDot.propTypes = {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default PaginationDot;
