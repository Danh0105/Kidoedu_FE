import React, { Component } from 'react';

export default class RadioProduct extends Component {
    render() {
        const { color, id, name, selectedId, onChange } = this.props;

        return (
            <div className="form-check" style={{ fontSize: "18px", color }}>
                <input
                    className="form-check-input"
                    type="radio"
                    name="productRadio"
                    value={id}
                    id={`radio-${id}`}
                    checked={selectedId === id}
                    onChange={() => onChange(id)}
                />
                <label className="form-check-label fw-medium" htmlFor={`radio-${id}`}>
                    {name}
                </label>
            </div>
        );
    }
}
