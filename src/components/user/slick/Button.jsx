import React, { Component } from 'react'
import '../../../index.css'
export default class Button extends Component {
    render() {
        return (
            <button type="button" className={`btn ${this.props.classname}  text-start arrow-btn`} style={{ width: "268px", borderRadius: "18px" }}>
                <div className="d-flex justify-content-between">
                    <div>
                        <div>{this.props.name}</div>
                        <div className='d-flex justify-content-between gap-3'>
                            <div>{this.props.detail}</div>
                            <div>Sản phẩm</div>
                        </div>
                    </div>
                    <div
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        className='arrow-icon rounded-circle bg-white d-flex align-items-center justify-content-center'>
                        <i className="bi bi-arrow-down text-dark arrow-icon fs-4"></i>

                    </div>
                </div>
            </button>
        )
    }
}
