import { useState, useEffect } from "react";
import "./footer.css"
import usfslogo from "/src/assets/FSDP/assets/fs-images/FSlogotag3.png";

const Footer = () => {

    const [headerKey, setHeaderKey] = useState(() => {
        const storedKey = sessionStorage.getItem('headerKey');
        return storedKey ? parseInt(storedKey) : 1
    });

    useEffect(() => {
        sessionStorage.setItem('headerKey', headerKey.toString())
    },[headerKey])

        return (
            <footer className="usa-footer">
                <div className="grid-container">
                    <div className="usa-footer__return-to-top">
                    <a href="#">Return to top</a>
                    </div>
                </div>
                <div className="primary-section" style={{ backgroundColor: "#243413"}}>
                    <nav className="usa-footer__nav">
                        <ul className="grid-row grid-gap">
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="/per24/" onClick={() => setHeaderKey(1)}>Home</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="https://www.fs.usda.gov/foresthealth/applied-sciences/mapping-reporting/index.shtml" target="_blank">FHP Mapping and Reporting</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="https://www.fs.usda.gov/foresthealth/applied-sciences/index.shtml" target="_blank">FHAAST</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="/per24/search" onClick={() => setHeaderKey(2)}>Search Pest Events</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="https://www.fs.usda.gov/foresthealth/technology/docs/DMSM_Tutorial/story_content/external_files/GIS-Handbook-for-Forest-Health-Detection-Survey.pdf#page=19" target="_blank">PER Reporting Calendar</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="/per24/contact" onClick={() => setHeaderKey(4)}>Contact Us</a>
                            </li>
                            <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                                <a className="usa-footer__primary-link" href="/per24/newSearch" onClick={() => setHeaderKey(5)}>Log Off</a>
                            </li>                       
                        </ul>
                    </nav>
                </div>
                <div className="bg-base-lightest padding-y-4">
                    <div className="grid-container">
                        <div className="grid-row grid-gap">
                            <div className="grid-col-fill">
                                <div className="region-footer">
                                    <div id="block-fs-uswds-requiredfootermenu" className="block block-menu-block block-menu-block:black-footer-menu">
                                        <ul className="menu menu--black-footer-menu nav">
                                            <li className="first">
                                                <a href="https://www.fs.usda.gov" target="_blank" className="first"> Forest Service Home</a>
                                            </li>
                                            <li>
                                                <a href="https://www.usda.gov" target="_blank">USDA.gov</a>
                                            </li>
                                            <li>
                                                <a href="http://www.recreation.gov" target="_blank">Recreation.gov</a>
                                            </li>
                                            <li>
                                                <a href="https://www.fs.usda.gov/about-agency/foia" target="_blank">FOIA</a>
                                            </li>
                                            <li>
                                                <a href="https://www.usda.gov/accessibility-statement" target="_blank">Accessibility Statement</a>
                                            </li>
                                            <li>
                                                <a href="https://www.usda.gov/privacy-policy" target="_blank">Privacy Policy</a>
                                            </li>
                                            <li>
                                                <a href="https://www.fs.usda.gov/about-agency/quality-of-information" target="_blank">Information Quality</a>
                                            </li>
                                            <li>
                                                <a href="https://www.usa.gov" target="_blank">FirstGov</a>
                                            </li>
                                            <li className="last">
                                                <a href="https://www.whitehouse.gov/" target="_blank" className="last">White House</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="secondary-section" style={{ backgroundColor: "#f0f0f0" }}>
                    <div className="grid-container">
                        <div className="grid-row grid-gap">
                            <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
                                <div className="mobile-lg:grid-col-auto">
                                    <img className="usa-footer-logo" src={usfslogo} alt="USFS" />
                                </div>
                            </div>
                            <div className="usa-footer__contact-links mobile-lg:grid-col-6">
                                <div className="usa-footer__social-links grid-row grid-gap-1">
                                    <div className="grid-col-auto">
                                        <a className="usa-social-link usa-social-link--facebook" title="facebook" href="https://www.facebook.com/USForestService/" target="_blank"></a>                
                                    </div>
                                    <div className="grid-col-auto">
                                        <a className="usa-social-link usa-social-link--twitter" title="twitter" href="https://twitter.com/forestservice?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank"></a>                                       
                                    </div>
                                    <div className="grid-col-auto">
                                        <a className="usa-social-link usa-social-link--youtube" title="youtube" href="https://www.youtube.com/user/usdaForestService" target="_blank"></a>                             
                                    </div>
                                    <div className="grid-col-auto">
                                        <a className="usa-social-link usa-social-link--rss" title="rss" href="https://www.fs.usda.gov/pnw/page/available-rss-feeds" target="_blank"></a>                 
                                    </div>
                                </div>
                                <h3 className="usa-footer__contact-heading">Forest Health Protection</h3>
                                <address className="usa-footer__address">
                                    <div className="usa-footer__contact-info grid-row grid-gap">
                                        <div className="grid-col-auto">
                                            <a href="tel:1-800-555-5555">(202) 649-1191</a>
                                        </div>
                                        <div className="grid-col-auto">
                                            <a href="https://www.fs.fed.us/foresthealth/contact-us/">Contact Us</a>
                                        </div>
                                    </div>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

export default Footer;
