import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import API from '../../Api/Api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { END_POINTS } from '../../constants/ApiConstant';
import { BaseURL } from '../../constants/Bases.js';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDropzone } from 'react-dropzone';
interface FilePreview {
  file: File;
  preview: string;
  UID: string;
}
interface Media {
  id: number;
  mediaId: number;
  mediaUrl: string;
  mediaUID: string;
}

interface ApiResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: number;
}

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

  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});

export const EditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [imageUploadWrapClass, setImageUploadWrapClass] =
    useState('image-upload-wrap');

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mainImageUID, setMainImageUID] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [projectTypeId, setProjectTypeId] = useState('1');

  const [mainFile, setMainFile] = useState<File | null>(null);

  const [fileUploadContentVisible, setFileUploadContentVisible] =
    useState(false);

  const [showOldMainImage, setShowOldMainImage] = useState<boolean>(true);

  const [
    mainImageFileUploadContentVisible,
    setMainImageFileUploadContentVisible,
  ] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(`${END_POINTS.GET_USER_BY_ID}/${id}`).then((res) => {
      if (res.status == 200) {
        const response: ApiResponse = res.data.data;
        setApiResponse(response);

        setIsLoading(false);
      }
    });
  }, []);

  const confirmEditUser = async (values: any) => {
    setIsLoading(true);

    try {
      //Third Update Project
      const data = {
        id: apiResponse?.id,
        firstName: apiResponse?.firstName,
        lastName: apiResponse?.lastName,
        email: apiResponse?.email,
        phoneNumber: apiResponse?.phoneNumber,
        gender: 1,
      };
      API.put(`${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_USER}`, data)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Operation completed successfully');
            setIsLoading(false);

            navigate('/users');
          } else {
            setIsLoading(false);
            toast.success(res.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
          // Fallback error handling
          const errorMessage =
            error.response?.data?.message || // Server error message
            error.message || // Axios error message
            'An unexpected error occurred'; // Fallback message
          toast.error(errorMessage);
          setIsLoading(false);
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

  return (
    <>
      <Breadcrumb pageName="Edit User" />
      {isLoading ? <Loader /> : null}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9 col-span-full">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <Formik
              onSubmit={(values) => confirmEditUser(values)}
              enableReinitialize
              initialValues={{
                firstName: apiResponse?.firstName,
                lastName: apiResponse?.lastName,
                email: apiResponse?.email,
                phoneNumber: apiResponse?.phoneNumber,
                userName: apiResponse?.userName,
              }}
              validationSchema={validationSchema}
              key={`UpdateUser`}
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

                            handleChangeValues(
                              e.target.value,
                              'firstName',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          defaultValue={values.firstName}
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

                      {/* Email */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Email
                        </label>
                        <input
                          type="text"
                          placeholder="Enter email here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

                      {/* phone Number */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter phone number here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

                      {/* User Name */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          UserName
                        </label>
                        <input
                          type="text"
                          disabled
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          onBlur={handleBlur}
                          value={values.userName}
                        />
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
