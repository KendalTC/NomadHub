// NomadHub - Main App Router
// Author: YOUR_NAME YOUR_LASTNAME

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CountryProfile from './pages/CountryProfile'
import Flights from './pages/Flights'
import ItineraryList from './pages/ItineraryList'
import ItineraryDetail from './pages/ItineraryDetail'
import ItineraryForm from './pages/ItineraryForm'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:countryName" element={<CountryProfile />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/itineraries" element={<ItineraryList />} />
        <Route path="/itineraries/create" element={<ItineraryForm />} />
        <Route path="/itineraries/:id" element={<ItineraryDetail />} />
        <Route path="/itineraries/:id/edit" element={<ItineraryForm />} />
      </Routes>
    </>
  )
}

export default App