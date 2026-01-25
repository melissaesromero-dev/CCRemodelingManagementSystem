export default function Footer() {
  return (
    <>
        <footer className="footer bg-dark text-light py-4">
            <div className="container">
            <div className="row align-items-stretch">
            <div className="col-md-4 my-3">
                <p className="mb-0">
                234 Main St. York, PA 12398<br/>
                (717) 435-4544 | <a href="mailto:info@ccremodeling.com">info@ccremodeling.com</a><br/>
                Mon - Fri 9am - 5pm<br/>
                Lic. # 123456 | Insured<br/>
                C&amp;C Remodeling. All rights reserved.
                </p>
            </div>
            
            <div className="col-md-4 d-flex flex-column my-3">
                <div className="mt-auto text-start text-md-center">
                    <p className="mb-0">&copy;
 Copyright 2025</p>                
                </div>
            </div>

            <div className="col-md-4 my-auto text-md-end text-start">
                <a href="#" className="social-link social-facebook mx-2">
                    <i className="fa-brands fa-facebook fa-3x"></i>
                </a>
                <a href="#" className="social-link social-twitter mx-2">
                    <i className="fa-brands fa-twitter fa-3x"></i>
                </a>
                <a href="#" className="social-link social-instagram mx-2">
                    <i className="fa-brands fa-instagram fa-3x"></i>
                </a>
            </div>
            </div>
        </div>
        </footer>

        <button id="to-top" className="to-top-btn">
        
        </button>
    </>
  )
}