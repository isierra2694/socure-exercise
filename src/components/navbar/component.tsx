import { useState, useEffect } from 'react';
import arrowSvg from '../../assets/arrow.svg';
import socureLogo from '../../assets/logo.svg';
import hamburgerSvg from '../../assets/hamburger.svg';
import { Button } from '../button';
import './navbar.css';

export function Navbar() {
  const [mobileNavbarOpen, setMobileNavbarOpen] = useState<boolean>(false);
  
  useEffect(() => {
    if (mobileNavbarOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  }, [mobileNavbarOpen]);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia('(min-width: 993px)');

    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileNavbarOpen(false);
      }
    }

    desktopBreakpoint.addEventListener('change', handleResize);

    return () => desktopBreakpoint.removeEventListener('change', handleResize);
  });

  return (
    <nav className="navbar">
      <div className="navbar-top-container">
        <div className="navbar-top">
          <a href="#" className="navbar-top__news">
            <p className="navbar-top__news__badge">News</p>
            <p className="navbar-top__news__text">Socure named to the CNBC Disruptor 50</p>
            <img src={arrowSvg} />
          </a>
          <div className="navbar-top__links">
            <a href="#">Support</a>
            <a href="#">Log in</a>
            <a href="#">See demos</a>
          </div>
        </div>
      </div>
      <div className="navbar-bottom-container">
        <div className="navbar-bottom">
          <div className="navbar-bottom__links">
            <a className="navbar-bottom__links__logo" href="#">
              <img src={socureLogo} alt="Socure" />
            </a>
            <div className="navbar-bottom__links__items">
              <a href="#">Products</a>
              <a href="#">Platform</a>
              <a href="#">Solutions</a>
              <a href="#">Customers</a>
              <a href="#">Resources</a>
            </div>
          </div>
          <div className="navbar-bottom__ctas">
            <Button variant="secondary-dark">Start building</Button>
            <Button variant="secondary">Talk to an expert</Button>
          </div>
          <button className="navbar-bottom__hamburger" onClick={() => setMobileNavbarOpen(!mobileNavbarOpen)}>
            <img src={hamburgerSvg} />
          </button>
        </div>
      </div>
      <div className={`navbar-mobile ${mobileNavbarOpen ? 'navbar-mobile--open' : ''}`}> 
        <div className="navbar-mobile__links">
          <a href="#">Products</a>
          <a href="#">Platform</a>
          <a href="#">Solutions</a>
          <a href="#">Customers</a>
          <a href="#">Resources</a>
        </div>
        <div className="navbar-mobile__ctas">
          <Button variant="secondary-dark">Start building</Button>
          <Button variant="secondary">Talk to an expert</Button>
        </div>
        <div className="navbar-mobile__links--bottom">
          <a href="#">Support</a>
          <a href="#">Log in</a>
          <a href="#">See demos</a>
        </div>
      </div>
    </nav>
  );
}
