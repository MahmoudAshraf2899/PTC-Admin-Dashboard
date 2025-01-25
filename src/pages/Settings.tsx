import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import userThree from '../images/user/user-03.png';
import { useEffect, useState } from 'react';
import { END_POINTS } from '../constants/ApiConstant.js';
import { BaseURL } from '../constants/Bases.js';
import API from '../Api/Api.js';
import { toast } from 'react-toastify';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface ApiResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userName: string;
}
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .matches(/^[a-zA-Z]+$/, 'First name must contain only English letters')
    .min(2, 'First name must be exactly 8 characters')
    .max(8, 'First name must be exactly 8 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[a-zA-Z]+$/, 'Last name must contain only English letters')
    .min(2, 'Last name must be exactly 8 characters')
    .max(8, 'Last name must be exactly 8 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
});
export const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);

    API.get(`${END_POINTS.SHOW_PROFILE}`).then((res) => {
      if (res.status == 200) {
        setApiResponse(res.data.data);

        setIsLoading(false);
      }
    });
  }, []);

  const handleChangeValues = (
    value: string | number | boolean,
    field: string,
    setValues: FormikHelpers<any>['setValues'],
  ) => {
    // Update the Formik form state with the changed values

    setValues((prevValues: { apiResponse: ApiResponse }) => ({
      ...prevValues,
      apiResponse: {
        ...prevValues.apiResponse,
        [field]: value,
      },
    }));
    if (apiResponse) {
      // Create a new object with the updated field
      const updatedApiResponse: ApiResponse = {
        ...apiResponse,
        [field]: value, // Replace 'New Name' with the new value
      };

      // Update the state with the new object
      setApiResponse(updatedApiResponse);
    }
  };
  const confirmUpdateProfile = async (values: any) => {
    setIsLoading(true);

    try {
      API.put(`${END_POINTS.UPDATE_PROFILE}`, values).then((res) => {
        if (res.status == 200) {
          localStorage.removeItem('fullName');
          localStorage.removeItem('email');
          localStorage.setItem(
            'fullName',
            values.firstName + '  ' + values.lastName,
          );
          localStorage.setItem('email', values.email);
          toast.success('Operation completed successfully');
          setIsLoading(false);
          navigate('/');
        } else {
          toast.error(res.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb pageName="Profile" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-4 sm:px-7 dark:border-strokedark">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Personal Information
            </h3>
          </div>
          <div className="p-4 sm:p-7">
            <Formik
              onSubmit={(values) => confirmUpdateProfile(values)}
              enableReinitialize
              initialValues={{
                firstName: apiResponse?.firstName,
                lastName: apiResponse?.lastName,
                email: apiResponse?.email,
                phoneNumber: apiResponse?.phone,
              }}
              key={`UpdateProfile`}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setValues,
              }) => (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* First Name */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          First Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5">
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                  fill=""
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                  fill=""
                                />
                              </g>
                            </svg>
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="firstName"
                            id="firstName"
                            onChange={(e) => {
                              handleChange(e);

                              handleChangeValues(
                                e.target.value,
                                'firstName',
                                setValues,
                              );
                            }}
                            onBlur={handleBlur}
                            value={values.firstName}
                          />
                          {touched.firstName && errors.firstName && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Last Name */}
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5">
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                  fill=""
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                  fill=""
                                />
                              </g>
                            </svg>
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="lastName"
                            id="lastName"
                            onChange={(e) => {
                              handleChange(e);

                              handleChangeValues(
                                e.target.value,
                                'lastName',
                                setValues,
                              );
                            }}
                            onBlur={handleBlur}
                            defaultValue={values.lastName}
                          />
                          {touched.lastName && errors.lastName && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone Number Field */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          Phone Number
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(
                              e.target.value,
                              'phoneNumber',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          defaultValue={values.phoneNumber}
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                          Email Address
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="email"
                          id="email"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(
                              e.target.value,
                              'email',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          defaultValue={values.email}
                        />
                        {touched.email && errors.email && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="mb-6">
                      <label
                        className="mb-2 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Username
                      </label>
                      <input
                        disabled
                        className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="Username"
                        id="Username"
                        defaultValue={apiResponse?.userName}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded bg-primary py-3 px-4 text-white hover:bg-primary-dark"
                    >
                      Update Profile
                    </button>
                  </form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};
