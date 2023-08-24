import Button from '../Button/Button';
import Heading from '../Heading/Heading';
import InputSelectFieldWithRef from '../InputSelectField/InputSelectField';
import InputTextFieldWithRef from '../InputTextField/InputTextField';

const Search = () => {
  return (
    <div className="absolute px-[9%] w-full">
      <div className="border-t-[#c36] border-t border-solid bg-[#f8f8f8] rounded-[0_0_10px_10px] p-5 shadow-[0px_6px_12px_rgba(0,0,0,0.176)] mr-14 z-[100] relative">
        <Heading headingLevel="h2">Find offers</Heading>
        <div className="tablet:flex">
          <div className="w-[100%] desktop:flex tablet:w-[60%]">
            <div className="w-[100%] pb-5 desktop:w-[50%] tablet:w-[90%] tablet:pr-8">
              <label>By company</label>
              <form action={'/'} method="GET">
                <InputSelectFieldWithRef
                  options={[
                    {
                      text: 'comp1',
                      value: 'comp 1',
                    },
                    {
                      text: 'comp2',
                      value: 'comp 2',
                    },
                  ]}
                />
              </form>
            </div>
            <div className="w-[100%] pb-5 desktop:w-[50%] tablet:w-[90%] tablet:pr-8">
              <label>
                <i>or</i> by category
              </label>
              <form action={'/'} method="GET">
                <InputSelectFieldWithRef
                  options={[
                    {
                      text: 'cat1',
                      value: 'cat 1',
                    },
                    {
                      text: 'cat2',
                      value: 'cat 2',
                    },
                  ]}
                />
              </form>
            </div>
          </div>
          <div className="tablet:w-[40%]">
            <form action={'/'} method="GET">
              <div className="w-full pb-5 desktop:w-[50%]">
                <label>
                  <i>or </i> by phrase
                </label>
                <InputTextFieldWithRef />
              </div>
              <div>
                <Button className="w-full text">Search now</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
