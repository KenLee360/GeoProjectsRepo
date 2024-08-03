import { useState, useEffect } from "react";
import Banner from './Banner.jsx';
import "./Header.css";
import pertitle from "../../assets/FSDP/assets/fs-images/usda-usfs.png";
import closesvg from "../../assets/FSDP/assets/img/usa-icons/close.svg";
import DownloadLink from "../Common/DownloadLink.jsx";

const Header = () => {
    const [headerKey, setHeaderKey] = useState(() => {
        const storedKey = sessionStorage.getItem('headerKey');
        return storedKey ? parseInt(storedKey) : 1
    });

    useEffect(() => {
        sessionStorage.setItem('headerKey', headerKey.toString())
    }, [headerKey])

        return (
            <>
            <Banner />
                <div className="usa-overlay"></div>
                <header className="usa-header usa-header--extended">
                    <div className="usa-navbar">
                        <div className="margin-y-1">
                            <div className="fs-site-branding">
                                <div className="display-flex flex-align-center margin-right-2 mobile-lg:margin-left-2">
                                    <img className="margin-right-1 usda-logo display-none mobile-lg:display-block" src={pertitle} alt="USDA" />                  
                                </div>
                                <div className="usa-logo" id="extended-logo">
                                    <em className="usa-logo__text">
                                        <a href="/per24/home" title="Home">Pest Event Reporter</a>
                                    </em>                                 
                                </div>
                                <button type="button" className="usa-menu-btn">Menu</button>
                            </div>
                        </div>
                        
                    </div>
                    <nav aria-label="Primary navigation" className="usa-nav">
                        <div className="usa-nav__inner">
                            <button type="button" className="usa-nav__close">
                                <img src={closesvg} alt="Close" />
                            </button>
                            <ul className="usa-nav__primary usa-accordion">
                                <li className="usa-nav__primary-item">
                                    <a href="/per24/" className={headerKey === 1 ? "usa-nav__link usa-current" : "usa-nav__link"} onClick={() => setHeaderKey(1)}><span>Home</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="https://www.fs.usda.gov/foresthealth/applied-sciences/mapping-reporting/index.shtml" target="_blank" className="usa-nav__link"><span>FHP Mapping and Reporting</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="https://www.fs.usda.gov/foresthealth/applied-sciences/index.shtml" target="_blank" className="usa-nav__link"><span>FHAAST</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="/per24/search" className={headerKey === 2 ? "usa-nav__link usa-current" : "usa-nav__link"} onClick={() => setHeaderKey(2)}><span>Search Pest Events</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <button type="button" className={headerKey === 3 ? "usa-accordion__button usa-nav__link usa-current" : "usa-accordion__button usa-nav__link"} aria-expanded="false" aria-controls="extended-mega-nav-section-one">
                                        <span>Tools</span>
                                    </button>
                                    <ul id="extended-mega-nav-section-one" className="usa-nav__submenu" hidden>
                                        <li className="usa-nav__submenu-item">
                                            <a href="/per24/create" onClick={() => setHeaderKey(3)}><span>Create Pest Event</span></a>
                                        </li>
                                        <li className="usa-nav__submenu-item">
                                            <a href=""><span>Create Regional Promoted Event</span></a>
                                        </li>
                                        <li className="usa-nav__submenu-item">
                                            <a href=""><span>Create National Promoted Event</span></a>
                                        </li>
                                        <li className="usa-nav__submenu-item">
                                            <a href=""><span>Pest Event Status Report</span></a>
                                        </li>
                                        <li className="usa-nav__submenu-item">
                                            <DownloadLink
                                                fileUrl="/per24/PER_Web_rule_base.xlsx"
                                                fileName="PER_Web_Rule_Base.xlsx"
                                            >
                                                PER Rule Base Spreadsheet
                                            </DownloadLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="https://www.fs.usda.gov/foresthealth/technology/docs/DMSM_Tutorial/story_content/external_files/GIS-Handbook-for-Forest-Health-Detection-Survey.pdf#page=19" target="_blank" className="usa-nav__link"><span>PER Reporting Calendar</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="/per24/contact" className={headerKey === 4 ? "usa-nav__link usa-current" : "usa-nav__link"} onClick={() => setHeaderKey(4)}><span>Contact Us</span></a>
                                </li>
                                <li className="usa-nav__primary-item">
                                    <a href="/per24/newSearch" className={headerKey === 5 ? "usa-nav__link usa-current" : "usa-nav__link"} onClick={() => setHeaderKey(5)}><span>Log Off</span></a>
                                </li>
                            </ul>
                            <div className="usa-nav__secondary usa-header--extended">
                                <ul className="usa-nav__secondary-links"></ul>
                            </div>
                        </div>
                    </nav>
                </header>
            </>
        )
}
export default Header;