import React, { Component } from 'react';

class CheckboxItem extends Component {
    render() {
        return (
            <div>
                <label className="form-check-label font-family lh-lg fw-bold" style={{ fontSize: "20px", color: this.props.color }} >
                    {this.props.label}
                </label>
            </div>
        );
    }
}

export default CheckboxItem;
