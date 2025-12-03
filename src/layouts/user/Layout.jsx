import React, { useEffect, useState } from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import axios from 'axios';

export default function Layout() {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners`);
        if (res.data && res.data.length > 0) {
          setBgImage(res.data[0].image_url);  // lấy ảnh đầu tiên
        }
      } catch (error) {
        console.error("Lỗi tải banner:", error);
      }
    };
    fetchBanner();
  }, []);
  const [banners, setBanners] = useState([]);
  const loadBanners = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners/9`);
    setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url("${process.env.REACT_APP_API_URL}${banners.imageUrl}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        transition: "0.3s",
      }}
    >
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
