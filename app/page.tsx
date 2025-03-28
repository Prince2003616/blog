import React from 'react'
import BlogLandingPage from './components/landing/landing'
import Header from './components/header/header'
import Footer from './components/footer/footer'

export default function page() {
  return (
    <>
      <Header/>
      <BlogLandingPage/>
      <Footer/>
    </>
  )
}
