import React from 'react';
import Image from 'next/image';

function HelloWorld() {
  return (
    <div className="h-screen w-screen">
      <Image
        src="https://cdna.artstation.com/p/assets/images/images/028/419/378/original/koen-leung-comp.gif?1594410959"
        alt="Hello World"
        height={1080}
        width={1920}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default HelloWorld;
