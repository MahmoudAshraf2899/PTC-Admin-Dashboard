import React, { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import API from '../../Api/Api';
import { END_POINTS } from '../../constants/ApiConstant';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseURL } from '../../constants/Bases.js';

const validationSchema = Yup.object().shape({
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
  username: Yup.string()
    .required('Username is required')
    .matches(/^[A-Za-z\s]+$/, 'Username must contain only English letters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W,_]).{8,16}$/,
      'Password must be 8-16 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character',
    ),
});

const AddUser: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [addObject, setAddObject] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {}, []);

  const handleChangeValues = (value: boolean | string, fieldName: string) => {
    setAddObject((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleAddUser = async (values: any) => {
    setIsLoading(true);

    try {
      // Third: Add the project
      const requestObject = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        username: values.username,
        password: values.password,
      };
      API.post(END_POINTS.ADD_USER, requestObject)
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            toast.success('Operation completed successfully');
            navigate('/users');
          } else {
            toast.error('Something went wrong ..!');
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error('An error occurred while processing your request.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add User" />
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9 col-span-full">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <Formik
              onSubmit={(values) => handleAddUser(values)}
              enableReinitialize
              initialValues={addObject}
              validationSchema={validationSchema}
              key={`AddUser`}
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
                    <div className="p-6.5">
                      {/* <!-- First Name --> */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter first name here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="firstName"
                          id="firstName"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'firstName');
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

                      {/* Last Name */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter last name here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="lastName"
                          id="lastName"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'lastName');
                          }}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                        {touched.lastName && errors.lastName && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.lastName}
                          </div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Phone Number
                          <br />
                        </label>
                        <input
                          type="number"
                          placeholder="Enter phone number here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="phoneNumber"
                          id="phoneNumber"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'phoneNumber');
                          }}
                          onBlur={handleBlur}
                          value={values.phoneNumber}
                        />

                        {touched.phoneNumber && errors.phoneNumber && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Email
                          <br />
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter email here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="email"
                          id="email"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'email');
                          }}
                          onBlur={handleBlur}
                          value={values.email}
                        />

                        {touched.email && errors.email && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      {/* User Name */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          User Name
                          <br />
                        </label>
                        <input
                          type="text"
                          placeholder="Enter username here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="username"
                          id="username"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'username');
                          }}
                          onBlur={handleBlur}
                          value={values.username}
                        />

                        {touched.username && errors.username && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      {/* Password */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Password
                          <br />
                        </label>
                        <input
                          type="text"
                          placeholder="Enter password here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="password"
                          id="password"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(e.target.value, 'password');
                          }}
                          onBlur={handleBlur}
                          value={values.password}
                        />

                        {touched.password && errors.password && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Save
                      </button>
                    </div>
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

export default AddUser;
