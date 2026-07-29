import capitalOneSvg from '../../assets/capitalone.svg';
import cashAppSvg from '../../assets/cashapp.svg';
import chimeSvg from '../../assets/chime.svg';
import klarnaSvg from '../../assets/klarna.svg';
import revolutSvg from '../../assets/revolut.svg';
import uberSvg from '../../assets/uber.svg';

import './logo-carousel.css';

export function LogoCarousel() {
  const logos = [uberSvg, klarnaSvg, cashAppSvg, revolutSvg, capitalOneSvg, chimeSvg];

  return (
    <div className="carousel">
      <div className="carousel-track">
        {/* Repeat the group 4 times to ensure it covers ultra-wide screens smoothly */}
        {[...Array(4)].map((_, groupIndex) => (
          <div 
            className="carousel-group" 
            key={groupIndex} 
            aria-hidden={groupIndex > 0}
          >
            {logos.map((logo, index) => (
              <div className="carousel-slide" key={index}>
                <img src={logo} alt={`Logo ${index + 1}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}