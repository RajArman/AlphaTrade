export default function Stats() {

    return (
        <>
            <div className="container p-5">
                <div className="row p-5">
                    <div className="col-5 p-5">
                        <h1 className="fs-2 mb-5">Why Choose AlphaTrade?</h1>

                        <h2 className="fs-4">Powerful Portfolio Tracking</h2>
                        <p className="text-muted mb-5">
Monitor your investments with real-time portfolio insights, holdings,
orders, and performance analytics—all from one intuitive dashboard.
</p>
                        
                       <h2 className="fs-4">Clean & Secure Experience</h2>
                        <p className="text-muted mb-5">
Designed with simplicity in mind. No unnecessary distractions—just a
fast, secure, and reliable investment management experience.
</p>
                        
                        <h2 className="fs-4">Everything In One Place</h2>
                       <p className="text-muted mb-5">
Access your watchlist, holdings, orders, funds, and portfolio analytics
without switching between multiple applications.
</p>
                        
                      <h2 className="fs-4 ">Do better with money</h2>
                        <p className="text-muted">
Analyze your portfolio, monitor performance trends, and make informed
financial decisions with confidence.
</p>
                        
                    </div>
                    
                    <div className="col-7">
                        <img src="media/images/ecosystem.png" alt="" style={{width: "100%"}} className="mb-3 mt-5"/>
                        <div className="text-center">
                            <a href=""  style={{textDecoration: "none"}}>Explore Dashboard <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="" className=" mx-5" style={{textDecoration: "none"}}>View Features<i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div className="row">
                        <img src="media/images/pressLogos.png" alt="Press Logo" style={{width: "65%", margin: "auto"}}/>

                    </div>

                </div>
            </div>
        </>
    );
}