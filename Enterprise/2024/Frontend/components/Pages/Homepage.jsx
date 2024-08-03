import { React } from "react";
import hero from "/src/assets/FSDP/assets/fs-images/banners/Wheat-1700.jpg"
import WhitePine from "/src/assets/white-pine-blister-rust.jpg";

function HomePage() {

        return (
            <div className="HomeContent">
                <div className="usa-hero" style={{ backgroundImage:`url(${hero})` }} >
                <div className="usa-hero__container">
                    <div className="grid-container">
                        <div className="usa-hero__callout">
                            <h1 className="usa-hero__heading">
                                Welcome to the Pest Event Reporter Database
                            </h1>
                        </div>
                    </div>
                </div>                
            </div>
                <div className="grid-container">
                    <div className="grid-row">
                        <div className="grid-col-8">
                            <h2 style={{ marginTop: '10px'}} >Overview and Objectives</h2>
                            <p>Forest Health Protection maintains a set of authoritative databases to track forest pest incidence and tree damaging activities.
                                These databases are designed to track both native and exotic insects and pathogens through time and space.
                                The "Pest Event Reporter" Database (PER) is designed to record and track relatively unstructured pest observations for eventual posting to the web for access by both FHP cooperators and the public.
                                Pest Event Reports must first be "promoted" by regional PER administrators before they are visible by the public. All records are accessible by PER contributors.
                                Password access restricts change/delete functions to owners of records and to those with regional or national authority.
                            </p>           
                            <h2 style={{ marginTop: '10px' }} >Scope</h2>
                            <p>Please enter all noteworthy pest observations into this database.
                                This may include a narrative describing a relatively large pest event already reported through Aerial Detection Surveys (ADS) or an observation made driving from one location to another.
                                Data from structured standard surveys or regional databases can also be entered into this national database. The information contained in the Pest Event Reporter is perpetually in draft form and never considered final.
                            </p>
                            <p>Please send comments or questions to Support Team at SM.FS.FHAAST_SMSM@usda.gov<br />Thank You!
                            </p>
                        </div>
                        <div className="grid-col-1" />
                        <div className="grid-col-3">
                            <img src={WhitePine} width="100%" alt="White Pine Blister" style={{ marginTop: '10px' }} />
                            <i>White pine blister rust sporulating.  Photo by: Chris Schnepf, University of Idaho, Bugwood.org</i>                        
                        </div>
                    </div>              
                </div>
            </div>
        )
}
export default HomePage;