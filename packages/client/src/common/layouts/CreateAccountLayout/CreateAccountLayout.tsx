import { useFlags } from 'flagsmith/react';
import { FC, PropsWithChildren } from 'react';
import { Col, Row } from 'react-bootstrap';

const CreateAccountLayout: FC<PropsWithChildren> = ({ children }) => {
  const { form_create_account_new_layout } = useFlags(['form_create_account_new_layout']);
  return (
    <Row>
      {form_create_account_new_layout.enabled && (
        <Col>
          <p>Column left</p>
        </Col>
      )}
      <Col>{children}</Col>
      {form_create_account_new_layout.enabled && (
        <Col>
          <p>Column right</p>
        </Col>
      )}
    </Row>
  );
};

export default CreateAccountLayout;
