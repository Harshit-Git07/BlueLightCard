import InputDOBField from '@/components/InputDOBField/InputDOBField';
import { InputDOBFieldProps } from '@/components/InputDOBField/types';
import {render} from '@testing-library/react'


describe('InputDOBField component', () => {
    let props: InputDOBFieldProps;

    beforeEach(() => {
        props = {

        }
    })

    describe('smoke test', () => {
        it('should render component without error', () => {
            render(<InputDOBField {...props} />)
        })
    })
})
