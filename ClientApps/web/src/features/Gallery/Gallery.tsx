import useGalleries from "../../hooks/useGalleries";
import Banner from "../../sharedFeatures/Banner/Banner"


export default function Gallery() {
  const {remodelImages, exteriorImages, customImages, generalImages } = useGalleries();  
  return (
    <>
        <Banner />
        <section className="w-100 py-4">
        <div className="container-fluid px-4">

        {/* REMODEL Carousel */}
        <h6>Remodels</h6>
        <div id="remodelGallery" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner  rounded-5 overflow-hidden">
            {remodelImages.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={img.src}
                  className="d-block w-100 gallery-main-img"
                  alt={img.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#remodelGallery"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#remodelGallery"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Thumbnails row */}
        <div className="gallery-thumbs d-flex gap-2 overflow-auto px-3 py-3">
          {remodelImages.map((img, idx) => (
            <button
              key={`thumb-${img.src}-${idx}`}
              type="button"
              className="thumb-btn p-0 border-0 bg-transparent"
              data-bs-target="#remodelGallery"
              data-bs-slide-to={idx}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img src={img.src} alt={img.alt} className="thumb-img rounded-2" loading="lazy" />
            </button>
          ))}
        </div>
        
        <div className="p-5"></div>

        {/* EXTERIOR & OUTDOOR Carousel */}
        <h6>Exterior &amp; Outdoor Living</h6>
        <div id="exteriorGallery" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner rounded-5">
            {exteriorImages.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={img.src}
                  className="d-block w-100 gallery-main-img"
                  alt={img.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#exteriorGallery"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#exteriorGallery"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Thumbnails row */}
        <div className="gallery-thumbs d-flex gap-2 overflow-auto px-3 py-3">
          {exteriorImages.map((img, idx) => (
            <button
              key={`thumb-${img.src}-${idx}`}
              type="button"
              className="thumb-btn p-0 border-0 bg-transparent"
              data-bs-target="#exteriorGallery"
              data-bs-slide-to={idx}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img src={img.src} alt={img.alt} className="thumb-img rounded-2" loading="lazy" />
            </button>
          ))}
        </div>

        <div className="p-5"></div>

        {/* CUSTOM CARPENTRY Carousel */}
        <h6>Custom Carpentry</h6>
        <div id="customGallery" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner rounded-5">
            {customImages.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={img.src}
                  className="d-block w-100 gallery-main-img"
                  alt={img.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#customGallery"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#customGallery"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Thumbnails row */}
        <div className="gallery-thumbs d-flex gap-2 overflow-auto px-3 py-3">
          {customImages.map((img, idx) => (
            <button
              key={`thumb-${img.src}-${idx}`}
              type="button"
              className="thumb-btn p-0 border-0 bg-transparent"
              data-bs-target="#customGallery"
              data-bs-slide-to={idx}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img src={img.src} alt={img.alt} className="thumb-img rounded-2" loading="lazy" />
            </button>
          ))}
        </div>

        <div className="p-5"></div>

        {/* REPAIRS & SMALL PROJECTS Carousel */}
        <h6>Repairs &amp; Small Projects</h6>
        <div id="generalGallery" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner rounded-5">
            {generalImages.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <img
                  src={img.src}
                  className="d-block w-100 gallery-main-img"
                  alt={img.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#generalGallery"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#generalGallery"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Thumbnails row */}
        <div className="gallery-thumbs d-flex gap-2 overflow-auto px-3 py-3">
          {generalImages.map((img, idx) => (
            <button
              key={`thumb-${img.src}-${idx}`}
              type="button"
              className="thumb-btn p-0 border-0 bg-transparent"
              data-bs-target="#generalGallery"
              data-bs-slide-to={idx}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img src={img.src} alt={img.alt} className="thumb-img rounded-2" loading="lazy" />
            </button>
          ))}
        </div>
        
        <div className="p-5"></div>

      </div>
    </section>
    </>
  )
}