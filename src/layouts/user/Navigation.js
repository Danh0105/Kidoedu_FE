import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faSquareInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import Menu from '../../components/user/Menu';
import { Link } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav className="container navbar navbar-expand-lg bg-body-tertiary rounded sticky-lg-top" aria-label="Eleventh navbar example">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand text-dark">Trang chủ</Link>
                <div className="collapse navbar-collapse" id="navbarsExample09">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                        <Menu />
                    </ul>
                    <div class="d-flex flex-row-reverse">
                        <div class="p-2"><FontAwesomeIcon icon={faFacebook} /></div>
                        <div class="p-2"><FontAwesomeIcon icon={faSquareInstagram} /> </div>
                        <div class="p-2"><FontAwesomeIcon icon={faTiktok} /></div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
