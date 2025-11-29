import React from 'react'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'


export default function Layout() {
  return (
    <div
      style={{
        backgroundImage: 'url("https://oenix.vn/wp-content/uploads/2021/12/PHONG-NEN-GIANG-SINH-scaled.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Content />
      <Footer />
    </div>

  )
}
