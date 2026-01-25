import { Link, useLocation } from "react-router"
import useGalleries from "../../hooks/useGalleries"

export default function Banner() {
  const {homeImages} = useGalleries();
  
  //Determine location
  const {pathname} = useLocation();

  const isHome = pathname === "/" || pathname === "/home"
  const isServices = pathname === "/services"
  const isGallery = pathname === "/gallery"
  const isContactUs = pathname === "/contactUs"
  const isQuote = pathname === "/quote"

  return (
    <>
    {/* Home Banner */}
    {isHome ? (
      
      <section className="banner w-100 p-0 m-0">
        <div className="container-fluid px-0 ">
          <div className="banner_frame">
            
            <div className="banner_cta">
              <Link to="/quote">
              <button
                type="button"
                className="btn btn-primary btn-lg"
              >
                Request a Quote
              </button>
              </Link>
            </div>

            {/* Image gallery */}
            <div id="bannerGallery" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {homeImages.map((img, idx) => (
                  <div
                    key={`${img.src}-${idx}`}
                    className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img.src}
                      className="d-block w-100 banner_image"
                      alt={img.alt ?? `Banner image ${idx + 1}`}
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>

              {homeImages.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#bannerGallery"
                    data-bs-slide="prev"
                    aria-label="Previous"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#bannerGallery"
                    data-bs-slide="next"
                    aria-label="Next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Centered text under gallery */}
          <div className="banner_text text-center py-4 px-3">
            <h4 className="fw-bold mb-2">Quality Remodeling, Done Right</h4>
            <p className="caption mb-0">
              Kitchens, baths, flooring, and custom projects — built to last and made to impress.
            </p>
          </div>
        </div>
      </section>

    ) : (
      <section className="banner w-100 p-0 m-0">
      <div className="container-fluid px-0 ">
        <div className="banner_frame">
          <div className="hero banner_bg d-flex justify-content-center align-items-center">
            
              {isServices && (
                <h1 className="text-light">Services</h1>
              )}
              {isGallery && (
                <h1 className="text-light">Gallery</h1>
              )}
              {isContactUs && (
                <h1 className="text-light">Contact Us</h1>
              )}
              {isQuote && (
                <h1 className="text-light">Request a Quote</h1>
              )}
          </div>
  
        </div>

      </div>
    </section>
    )}

  </>

  )
}