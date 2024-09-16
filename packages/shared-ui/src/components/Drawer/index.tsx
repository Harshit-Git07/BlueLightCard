/* eslint-disable react/prop-types */
'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { ErrorBoundary } from 'react-error-boundary';
import { useMediaQuery } from 'usehooks-ts';
import { mergeClassnames } from '../../utils/cssUtils';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';

const DrawerRoot = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      direction={isSmallDevice ? 'bottom' : 'right'}
      {...props}
    />
  );
};
DrawerRoot.displayName = 'Drawer';

const NestedDrawerRoot = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  return (
    <DrawerPrimitive.NestedRoot
      shouldScaleBackground={shouldScaleBackground}
      direction={isSmallDevice ? 'bottom' : 'right'}
      {...props}
    />
  );
};
NestedDrawerRoot.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={mergeClassnames('fixed inset-0 bg-black/40 z-50', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

type DrawerContentProps = {
  onClose?: () => void;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps & React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ onClose, className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={mergeClassnames(
        'fixed inset-x-0 bottom-0 right-0 z-50 mt-24 flex h-full max-h-[80%] w-full flex-col rounded-t-[10px] tablet:left-auto tablet:h-full tablet:max-h-[100%] tablet:max-w-sm tablet:justify-between tablet:rounded-0 outline-none focus:outline-none bg-colour-surface dark:bg-colour-surface-dark',
        className,
      )}
      {...props}
    >
      {/* 
      // Pill bar on mobile  - Design may want in future
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 tablet:hidden dark:bg-neutral-800" /> 
      */}
      <div className="justify-end mt-4 w-full flex px-4">
        <button className="ml-auto" onClick={onClose}>
          <FontAwesomeIcon
            icon={faX}
            className="text-colour-onSurface dark:text-colour-onSurface-dark"
          />
        </button>
      </div>
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={mergeClassnames('grid gap-1.5 p-4 text-center tablet:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={mergeClassnames(
      'sticky bottom-0 mt-auto flex flex-col gap-2 p-4 shadow-offerSheetTop bg-colour-surface dark:bg-colour-surface-dark',
      className,
    )}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={mergeClassnames('text-xl font-semibold leading-6', className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={mergeClassnames('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

type DrawValue = {
  /* Open the drawer */
  open: () => void; // Open the drawer
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type RequiredDrawerProps = {
  drawer: {
    close: () => void;
  };
};

export type DrawerProps<E = NonNullable<unknown>> = RequiredDrawerProps & E;

type SheetProps<E extends React.ElementType> = DistributiveOmit<
  React.ComponentPropsWithoutRef<E>,
  keyof RequiredDrawerProps
> & {
  children: ((value: DrawValue) => React.ReactNode) | React.ReactNode;
  drawer: E | ((props: RequiredDrawerProps) => React.ReactNode);
  nested?: boolean;
  onClick?: () => void;
};

const DrawerError = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  // TODO: record error somewhere

  return (
    <React.Fragment>
      <DrawerHeader className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-2">
        <DrawerTitle>Uh oh! Something went wrong. Please try again later.</DrawerTitle>
        <DrawerDescription>
          We{`'`}ve run into an issue loading this page, we{`'`}ve been notified and are working to
          fix it. Please try again later.
        </DrawerDescription>
      </DrawerHeader>

      {/* only show if this if running in development mode (local) */}
      {process.env.NODE_ENV === 'development' && (
        <div className=" overflow-scroll border-t border-b bg-neutral-100 p-4">
          <span className="overflow-x-scroll break-words text-red-500 dark:text-red-400">
            {error.message}
          </span>
        </div>
      )}

      <DrawerFooter>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </DrawerFooter>
    </React.Fragment>
  );
};

export function Drawer<T extends React.ElementType>({
  children,
  drawer: DrawerComponent,
  nested,
  onClick,
  ...props
}: SheetProps<T>) {
  const [open, setOpen] = React.useState(false);

  const Root = nested ? NestedDrawerRoot : DrawerRoot;

  return (
    <Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onClick && onClick();
      }}
      noBodyStyles={nested}
    >
      {typeof children === 'function' ? (
        children({ open: () => setOpen(true) })
      ) : (
        <DrawerTrigger asChild>{children}</DrawerTrigger>
      )}

      <DrawerContent onClose={() => setOpen(false)}>
        <ErrorBoundary
          fallbackRender={DrawerError}
          onError={(error) => console.log('E bound: ', error)}
        >
          <DrawerComponent
            drawer={{
              close: () => setOpen(false),
            }}
            {...props}
          />
        </ErrorBoundary>
      </DrawerContent>
    </Root>
  );
}

export {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
