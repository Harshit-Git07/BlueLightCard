import { FC } from 'react';
import { InfoCardProps } from './types';
import Card from 'react-bootstrap/Card';
// import styled from 'styled-components';

const InfoCard: FC<InfoCardProps> = ({ title, text }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default InfoCard;
