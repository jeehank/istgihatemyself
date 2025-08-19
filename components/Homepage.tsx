import Navbar from './Navbar'
import ClubCarousel from './ClubCarousel'
import SchoolInfo from './SchoolInfo'
import ParallaxClubs from './ParallaxClubs'
import Footer from './Footer'

export default function Homepage() {
  return (
    <main className="parallax-container">
      <Navbar />
      <ClubCarousel />
      <SchoolInfo />
      <ParallaxClubs />
      <Footer />
    </main>
  )
}
