import React from 'react';
import { Formik, Form } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';

interface registerProps {}

const REGISTER_MUT = gql`
mutation Register($username: String!, $password: String!) {
    login(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
}
`; 

const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant="small">
            <Formik 
                initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                    register(values);
                }}
            
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password" 
                                placeholder="password"
                                label="password"
                                type="password"
                            />
                        </Box>
                        <Button 
                            mt={4} 
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                        >
                            Register
                        </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;
