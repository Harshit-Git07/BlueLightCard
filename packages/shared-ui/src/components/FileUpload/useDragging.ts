import { DragEvent, useRef, useState } from 'react';

export const useDragging = (handleDrop: (event: DragEvent<HTMLElement>) => void) => {
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0); // track drag events to avoid bugs when dragging over children - useRef preferred since this doesnt require rerenders

  const onDrop = (event: DragEvent<HTMLElement>) => {
    dragCounter.current = 0;
    setDragging(false);
    handleDrop(event);
  };
  const onDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragEnter = (event: DragEvent<HTMLElement>) => {
    event.stopPropagation();

    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setDragging(true);
    }
  };
  const onDragLeave = (event: DragEvent<HTMLElement>) => {
    event.stopPropagation();

    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  };

  return {
    dragging,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
  };
};
