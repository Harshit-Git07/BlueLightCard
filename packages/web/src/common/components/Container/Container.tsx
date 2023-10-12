interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  nestedClassName?: string;
  addBottomHorizontalLine?: boolean;
}

const Container = ({
  children,
  className = '',
  nestedClassName = '',
  addBottomHorizontalLine = false,
  ...props
}: ContainerProps) => {
  const borderBottomClassNames = addBottomHorizontalLine
    ? `border-b-[0.95px] border-shade-greyscale-grey-100`
    : '';

  return (
    <>
      <div className={`${className} ${borderBottomClassNames}`} {...props}>
        <div className={`mobile:mx-5 laptop:container laptop:mx-auto ${nestedClassName}`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Container;
