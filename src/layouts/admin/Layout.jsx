// UserLayout.jsx
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Content from './Content';

import React, { Component } from 'react'

export default class Layout extends Component {
    render() {
        return (
            <div><div className="app-wrapper">
                <Header title={this.props.title} />
                <Sidebar />
                <Content />
                <Footer />
            </div></div>
        )
    }
}
