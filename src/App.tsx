import './App.css';
import { Button } from './components/button';
import { Navbar } from './components/navbar';
import { AnimatedHero } from './components/animated-hero';
import { EventsAnimation } from './components/events-animation';
import { LogoCarousel } from './components/logo-carousel';
import headshotPng from './assets/headshot.png';

function App() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="hero-text">
          <div className="hero-text__eyebrow">
            <p className="hero-text__eyebrow__dots">Fraud attempts stopped</p>
            <p className="mono">48,303,095</p>
          </div>
          <h1>The world <br></br>runs on trust, we power it</h1>
          <p>Socure is the AI-native trust infrastructure powering identity and risk decisions for the world. Verify trustworthy people, stop fraud, and decide instantly.</p>
          <div className="hero-text__ctas">
            <Button>Talk to an expert</Button>
            <Button variant="primary-dark">Start building</Button>
          </div>
        </div>
        <div className="hero-animation">
          <div className="hero-animation__overlay">
            <div className="hero-animation__overlay__events">
              <EventsAnimation />
              <p>Monitoring events</p>
            </div>
            <div className="hero-animation__overlay__buttons">
              <button className="hero-animation__overlay__button">Device History Data</button>
              <button className="hero-animation__overlay__button">Device Attribute Data</button>
              <button className="hero-animation__overlay__button">Load Device Intelligence SDK</button>
              <button className="hero-animation__overlay__button">Device Network Data</button>
            </div>
            <div className="hero-animation__overlay__code mono">
              <pre>
                <span className="code-white">{"{"}</span><br></br>
                <span className="code-signal">  "networkLocations"</span><span className="code-white">: {"["}</span><br></br>
                <span className="code-peach">    "chicago, il"</span><span className="code-white">,</span><br></br>
                <span className="code-peach">    "new york, ny"</span><span className="code-white">,</span><br></br>
                <span className="code-peach">    "paris, fr"</span><br></br>
                <span className="code-white">  {"]"},</span><br></br>
                <span className="code-signal">  "ips"</span><span className="code-white">: {"["}</span><br></br>
                <span className="code-peach">    "78.32.11.221"</span><span className="code-white">,</span><br></br>
                <span className="code-peach">    "70.45.2.1"</span><br></br>
                <span className="code-white">  {"]"},</span><br></br>
                <span className="code-signal">  "daysSeen"</span><span className="code-white">: {"["}</span><br></br>
                <span className="code-peach">    "2023-10-24"</span><br></br>
                <span className="code-white">  {"]"}</span><br></br>
                <span className="code-white">{"}"}</span>
              </pre>
            </div>
          </div>
          <div className="animated-hero-container">
            <AnimatedHero imageSrc={headshotPng} />
          </div>
        </div>
      </header>
      <section>
        <LogoCarousel />      
      </section>
    </>
  )
}

export default App
