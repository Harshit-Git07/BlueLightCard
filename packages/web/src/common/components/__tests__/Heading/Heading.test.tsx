import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Heading from '@/components/Heading/Heading';

describe('Heading component', () => {
  describe('h1 smoke test', () => {
    it('should render h1 component without error', () => {
      render(<Heading headingLevel={'h1'}>Test h1 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-3xl');
    });
  });

  describe('h2 smoke test', () => {
    it('should render h2 component without error', () => {
      render(<Heading headingLevel={'h2'}>Test h2 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-2xl');
    });
  });

  describe('h3 smoke test', () => {
    it('should render h3 component without error', () => {
      render(<Heading headingLevel={'h3'}>Test h3 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-xl');
    });
  });

  describe('h4 smoke test', () => {
    it('should render h4 component without error', () => {
      render(<Heading headingLevel={'h4'}>Test h4 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-lg');
    });
  });

  describe('h5 smoke test', () => {
    it('should render h5 component without error', () => {
      render(<Heading headingLevel={'h5'}>Test h5 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-md');
    });
  });

  describe('h6 smoke test', () => {
    it('should render h6 component without error', () => {
      render(<Heading headingLevel={'h6'}>Test h6 heading</Heading>);
      const headingField = screen.getByRole('heading');
      expect(headingField).toBeTruthy();
      expect(headingField).toHaveClass('text-sm');
    });
  });
});
