export default function useGalleries() {
    const homeImages = [
    { src: "/images/homePics/kitchen1.jpg", alt: "Kitchen remodel"},
    { src: "/images/homePics/kitchen2.jpg", alt: "Modern kitchen renovation"},
    { src: "/images/homePics/kitchen4.jpg", alt: "Kitchen remodel"},
    { src: "/images/homePics/bath1.jpg", alt: "Bath remodel"},
    { src: "/images/homePics/bath2.jpg", alt: "Bath remodel"}
  ];

  const remodelImages = [
      { src: "/images/remodelPics/kitchen1.jpg", alt: "Kitchen remodel 1"},
      { src: "/images/remodelPics/kitchen2.jpg", alt: "Kitchen remodel 2"},
      
      { src: "/images/remodelPics/basement1.jpg", alt: "Basement remodel 1"},
      { src: "/images/remodelPics/basement2.jpg", alt: "Basement remodel 2"},
  
      { src: "/images/remodelPics/kitchen3.jpg", alt: "Kitchen remodel 3"},
      { src: "/images/remodelPics/kitchen4.jpg", alt: "Kitchen remodel 4"},
  
      { src: "/images/remodelPics/bathroom1.jpg", alt: "Bath remodel 1"},
      { src: "/images/remodelPics/bathroom2.jpg", alt: "Bath remodel 2"},
  
      { src: "/images/remodelPics/basement3.png", alt: "Basement remodel 3"},
      { src: "/images/remodelPics/basement4.png", alt: "Basement remodel 4"},
  
      { src: "/images/remodelPics/bathroom3.jpg", alt: "Bath remodel 3"},
  
    ];
  
    const exteriorImages = [
      { src: "/images/exteriorPics/deck1.png", alt: "Deck 1"},
      { src: "/images/exteriorPics/deck2.jpg", alt: "Deck 2"},
      
      { src: "/images/exteriorPics/patio1.jpg", alt: "Patio 1"},
      { src: "/images/exteriorPics/patio2.jpg", alt: "Patio 2"},
  
      { src: "/images/exteriorPics/porch1.jpg", alt: "Porch 1"},
      { src: "/images/exteriorPics/porch2.jpg", alt: "Porch 2"},
  
      { src: "/images/exteriorPics/patio3.jpg", alt: "Patio 3"},
    ];
  
    const customImages = [
      { src: "/images/customPics/builtin1.jpg", alt: "Built In 1"},
      { src: "/images/customPics/custom1.jpg", alt: "Custom 1"},
      
      { src: "/images/customPics/custom2.jpg", alt: "Custom 2"},
      { src: "/images/customPics/custom3.jpg", alt: "Custom 3"},
  
      { src: "/images/customPics/mudroom1.jpg", alt: "Mudroom 1"},
      { src: "/images/customPics/office1.jpg", alt: "Office 1"},
  
      { src: "/images/customPics/paint1.jpg", alt: "Paint 1"},
      { src: "/images/customPics/paint2.jpg", alt: "Paint 2"},
      { src: "/images/customPics/trim1.jpg", alt: "Trim 1"},
    ]
  
    const generalImages = [
      { src: "/images/generalPics/drywall1.jpg", alt: "Drywall 1"},
      { src: "/images/generalPics/drywall2.jpg", alt: "Drywall 2"},
      
      { src: "/images/generalPics/floor1.jpg", alt: "Floor 1"},
      { src: "/images/generalPics/floor2.jpg", alt: "Floor 2"},
  
      { src: "/images/generalPics/floor3.jpg", alt: "Floor 3"},
    ];
  
  return {
    homeImages,
    remodelImages,
    exteriorImages,
    customImages,
    generalImages
  };
}