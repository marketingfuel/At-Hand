import * as yup from 'yup';

export const SignInValidationSchema = yup.object().shape({
    email: yup.string()
        .email('Enter Valid email')
        .required('Email is required'),
    password: yup.string()
        .min(8, ({ min }) => 'Password must have' + " " + min + " " + 'characters')
        .required('Password is required'),
})

export const SignUpValidationSchema = yup.object().shape({
    fullName: yup.string()
        .required('Name is required')
        .min(3, ({ min }) => 'Name should be atleast' + " " + min + " " + 'characters'),
    email: yup.string()
        .email('Enter Valid email')
        .required('Email is required'),
    address: yup.string()
        .required('Address is required'),
    telephone: yup.string()
        .required('Telephone is required'),
    password: yup.string()
        .min(8, ({ min }) => 'Password must have' + " " + min + " " + 'characters')
        .required('Password is required'),
    confirmPassword: yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Password not match"
        )
    })
})

export const ReportIssueValidation = yup.object().shape({
    title: yup.string()
        .required('Title is required'),
})

export const ProfileValidation = yup.object().shape({
    fullName: yup.string()
        .required('Name is required')
        .min(3, ({ min }) => 'Name should be atleast' + " " + min + " " + 'characters'),
})

