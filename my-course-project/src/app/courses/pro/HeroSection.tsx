import React from "react";
import Image from "next/image";
const HeroSection = () => {
  return (
    <div>
      <h2>
        <Image
          src="images/logo.png"
          alt="hero"
          width={100}
          height={100}
        ></Image>
      </h2>
    </div>
  );
};

export default HeroSection;
