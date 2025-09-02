import '../styles/Background.css'
import purplePlanetEarth from '../assets/purple-planet-earth.gif'

const phrase = "The world is yours - ";

function Background() {
  return (
    <div className='background'>
      <div id="planet-screen">
        <img src={purplePlanetEarth} alt="Planet" />
      </div>
      <div className="marquee-container">
        <div className="marquee-track">
          <span className="marquee-text">{phrase.repeat(10)}</span>
          <span className="marquee-text">{phrase.repeat(10)}</span>
        </div>
      </div>
    </div>
  )
}

export default Background
