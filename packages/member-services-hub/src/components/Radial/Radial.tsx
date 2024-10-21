'use client';
import { FC, useState } from 'react';
import { RadialProps } from './types';

const Radial: FC<RadialProps> = ({ options }) => {
  if (options === undefined) {
    return <p>no options defined</p>;
  }

  let initialOptions = [];
  for (let i = 0; i < options.length; i++) {
    initialOptions[i] = false;
  }
  const numberOfOptions = options.length;
  const [radialStates, changeRadialStates] = useState(!initialOptions);

  return (
    <>
      <div className="flex">
        {options.map((option, index) => {
          return (
            <div key={index} className="flex">
              <div className="">
                <input
                  type="checkbox"
                  checked={radialStates[index] !== undefined ? radialStates[index] : false}
                  className="sr-only"
                  onChange={() => {
                    changeRadialStates(radialStates[index]);
                  }}
                />
                <div
                  className="box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-stroke dark:border-dark-3"
                  onClick={() => {
                    handleExclusive(index, changeRadialStates, numberOfOptions);
                  }}
                >
                  <span
                    className={`h-[10px] w-[10px] rounded-full ${
                      radialStates[index] === true ? 'bg-black' : 'bg-transparent'
                    }`}
                  >
                    {' '}
                  </span>
                </div>
              </div>
              <div>
                <p data-testid='radial-label' className="pr-4">{option}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

function handleExclusive(
  index: number,
  changeRadialStates: React.Dispatch<React.SetStateAction<boolean>>,
  numberOfOptions: number
) {
  let newArrayValues = [];
  for (let i = 0; i < numberOfOptions; i++) {
    newArrayValues[i] = i === index ? true : false;
  }
  changeRadialStates(newArrayValues);
}

export default Radial;