import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <>
            <div>
               <nav className="navbar navbar-expand-lg border-bottom fixed-top" style={{ backgroundColor: "white" }}>
    <div className="container px-5 py-2">
        {/* Updated branding container to match your original alignment */}
        <div style={{ width: "25%", display: "flex", alignItems: "center" }}>
            <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontWeight: "700", fontSize: "1.4rem", color: "#2383e2", letterSpacing: "0.5px", margin: 0 }}>
                <i className="fa-solid fa-chart-line me-2"style={{ color: "#2383e2" }}></i>
                <span>AlphaTrade</span>
            </Link>
        </div>


                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">

                            <form className="d-flex ms-auto" role="search">
                                <ul className="navbar-nav mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/signup">
                                            Signup
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/about">
                                            About
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="products">
                                            Products
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-disabled="true" to="pricing">
                                            Pricing
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-disabled="true" to="support">
                                            Support
                                        </Link>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}