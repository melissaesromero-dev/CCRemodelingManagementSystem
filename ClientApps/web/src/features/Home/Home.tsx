import Banner from "../../sharedFeatures/Banner/Banner";

export default function Home() {
  return (
    <>
    <Banner/>

    {/* Testimonials */} 
    <section id="testimonials" className="testimonials bg-light py-6">
      <div id="testimonialCarousel" className="carousel slide">
        <div className="carousel-inner">
          {/*  Slide 1 */}
          <div className="carousel-item active">
            
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center"
            >
              <div className="d-flex gap-1 w-75 p-1">
                <div className="ms-auto">
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                </div>
              </div>
            
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                alt=""
                className="rounded-circle"
                width="120"
              />
              <p className="w-50 my-4 fst-italic fs-4 mb-4">
                “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultrices finibus turpis, ornare faucibus felis viverra eu. Fusce condimentum semper elit, vel sagittis quam placerat vel. Ut finibus quam sed massa feugiat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque odio ex, mattis tempor erat ut, pretium eleifend ex. Integer lobortis orci quis nisi porttitor porta.”
              </p>
              <div className="fw-bold fs-5 mt-4">Marlene Visconte</div>
              <div>Lancaster, PA - Bathroom Remodel</div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center"
            >
              <div className="d-flex gap-1 w-75 p-1">
                <div className="ms-auto">
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                </div>
              </div>

              <img
                src="https://randomuser.me/api/portraits/men/16.jpg"
                alt=""
                className="rounded-circle"
                width="120"
              />
              <p className="w-50 my-4 fst-italic fs-4 mb-4">
                “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultrices finibus turpis, ornare faucibus felis viverra eu. Fusce condimentum semper elit, vel sagittis quam placerat vel. Ut finibus quam sed massa feugiat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus.”
              </p>
              <div className="fw-bold fs-5 mt-4">John Spiker</div>
              <div>Shilo, PA - Kitchen Remodel</div>
            </div>
          </div>
          {/*  Slide 3 */} 
          <div className="carousel-item">
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center"
            >
              <div className="d-flex gap-1 w-75 p-1">
                <div className="ms-auto">
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                  <i className="fa-solid fa-star fs-3 text-tertiary"></i>
                </div>
              </div>
              <img
                src="https://randomuser.me/api/portraits/women/55.jpg"
                alt=""
                className="rounded-circle"
                width="120"
              />
              <p className="w-50 my-4 fst-italic fs-4 mb-4">
                “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultrices finibus turpis, ornare faucibus felis viverra eu. Fusce condimentum semper elit, vel sagittis quam placerat vel. Ut finibus quam sed massa feugiat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus.”
              </p>
              <div className="fw-bold fs-5 mt-4">Stella Virtuoso</div>
              <div>Lititz, PA - Patio</div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="prev"
        >
          <i className="fas fa-arrow-circle-left fa-3x text-secondary"></i>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="next"
        >
          <i className="fas fa-arrow-circle-right fa-3x text-secondary"></i>
        </button>
      </div>
    </section>
    </>
  )
}