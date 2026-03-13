import React, { useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Slider from "react-slick";
import Layout from "../components/Layout/Layout";
import { RiArrowDropDownLine } from "react-icons/ri";

const Home = () => {
  var settings = {
    // dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Layout>
        <div className="fk-category-wrapper">
          <div className="fk-category-container">
            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip.webp" alt="Minutes" />
              </div>
              <span className="fk-category-text">Minutes</span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip1.webp" alt="Mobile & Tablets" />
              </div>
              <span className="fk-category-text">Mobile & Tablets</span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip2.webp" alt="Flight Booking" />
              </div>
              <span className="fk-category-text">
                Flight Booking
                <RiArrowDropDownLine className="fk-category-icon" />
              </span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip3.webp" alt="Electronics" />
              </div>
              <span className="fk-category-text">Electronics</span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip4.webp" alt="Home & Furniture" />
              </div>
              <span className="fk-category-text">Home & Furniture</span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip4.webp" alt="Appliances" />
              </div>
              <span className="fk-category-text">Appliances</span>
            </a>

            <a href="#" className="fk-category-item">
              <div className="fk-category-img-box">
                <img src="../../public/flip2.webp" alt="Travel" />
              </div>
              <span className="fk-category-text">Travel</span>
            </a>
          </div>
        </div>
        {/* bootstrp slider */}
        {/* slider start */}
        <div>
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="../public/slider/slider1.webp"
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src="../public/slider/slider1.webp"
                  className="d-block w-100"
                  alt="..."
                  style={{ width: "100%" }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src="../public/slider/slider1.webp"
                  className="d-block w-100"
                  alt="..."
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        {/* start slider */}
        <div className="sl-n">
          {" "}
          <div className="slider-container">
            <Slider {...settings}>
              <div className="sl-p">
                <img src="../public/slider/slid1.webp" alt="" />
                {/* <a href="#" className="">beat</a> */}
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid2.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid3.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid1.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid3.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />
              </div>
            </Slider>
          </div>
        </div>
        {/*  end slider */}
        {/* ......................hedingi..slider......start................................................. */}
        {/* ........................................................................ */}
        <div className=" healthcare">
          <div className="sports">
            <h4>Sports, Healthcare & more</h4>
          </div>
          <div className="food">
            {" "}
            <div>
              <img src="../public/slider/food1.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
            <div>
              <img src="../public/slider/food2.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
            <div>
              <img src="../public/slider/food3.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
            <div>
              <img src="../public/slider/food4.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
            <div>
              <img src="../public/slider/food5.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
            <div>
              <img src="../public/slider/food6.webp" alt="ij" />
              <div className=" Cereal">
                <a>breakest Cereal</a>
                <a>
                  {" "}
                  <h6>Upto 75% off</h6>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* ................................hedingi..slider......end........................................... */}
        {/* ............................................................................... */}
        <div className="sl-n">
          {" "}
          <div className="slider-container">
            <Slider {...settings}>
              <div className="sl-p">
                <img src="../public/slider/slid1.webp" alt="" />
                {/* <a href="#" className="">beat</a> */}
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid2.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid3.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid1.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid3.webp" alt="" />
              </div>
              <div className="sl-p">
                <img src="../public/slider/slid5.webp" alt="" />

              </div>
            </Slider>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
