import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import API from '../../Api/Api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Field, Formik, FormikHelpers } from 'formik';
import { END_POINTS } from '../../constants/ApiConstant';
import { BaseURL } from '../../constants/Bases.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import imageCompression from 'browser-image-compression';

interface ApiResponse {
  id: string;
  isActive: boolean;
  mainImage: string;
  title: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('title is required')
    .min(20, 'Title must be at least 10 characters')
    .max(50, 'Title must be at most 50 characters'),
  description: Yup.string().required('description is required'),

  mainImage: Yup.mixed().required('Image is required'),
});

export const AdSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadWrapClass, setImageUploadWrapClass] =
    useState('image-upload-wrap');
  const [fileUploadContentVisible, setFileUploadContentVisible] =
    useState(false);

  const [showOldMainImage, setShowOldMainImage] = useState<boolean>(true);
  const [mainFileMediaPath, setMainFileMediaPath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    API.get(`${END_POINTS.GET_AD_SECTION}/1`).then((res) => {
      if (res.status == 200) {
        setApiResponse(res.data.data);

        setIsLoading(false);
      }
    });
  }, []);

  const confirmUpdateAD = async (values: any) => {
    setIsLoading(true);
    let mainFilePath = '';

    try {
      if (file != null) {
        const formData = new FormData();
        const options = {
          maxSizeMB: 1, // Reduce file size to 1MB
          maxWidthOrHeight: 1920, // Resize large images
          useWebWorker: true, // Improve performance
        };
        const blobFile = await imageCompression(file, options);
        const compressedFile = new File([blobFile], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        formData.append('file', compressedFile);
        const data = {
          File: compressedFile,
          MediaType: 1,
          Directory: 7,
        };
        const mediaResponse = await axios.post(
          `${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_MEDIA}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (mediaResponse.status === 200) {
          setMainFileMediaPath(mediaResponse.data.path);
          mainFilePath = mediaResponse.data.path;
        }
      }
      const formData = new FormData();

      // Append form fields to FormData
      formData.append('Id', '1');
      formData.append(
        'MainImage',
        mainFilePath.length != 0 ? mainFilePath : values.mainImage,
      ); // Attach file if exists, otherwise use current image
      formData.append('Title', values.title);
      formData.append('Description', values.description);

      formData.append('IsActive', values.isActive ? 'true' : 'false');

      // Send the PUT request
      const updateResponse = await fetch(
        `${BaseURL.SmarterAspNetBase}${END_POINTS.UPDATE_AD_SECTION}`,
        {
          method: 'PUT',
          headers: {
            accept: '*/*',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        },
      );
      if (updateResponse.status === 200) {
        toast.success('Operation completed successfully');

        navigate('/');
      } else {
        toast.error('Something went wrong ..!');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAD = (
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

  const readURL = (input: any, value, setFieldValue) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUploadWrapClass('image-upload-wrap image-dropping');
        setFileUploadContentVisible(true);
        setFile(input.files[0]);
        setFieldValue('mainImage', input.files[0]);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
    }
  };

  const handleDragOver = () => {
    setImageUploadWrapClass('image-upload-wrap image-dropping');
  };

  const handleDragLeave = () => {
    setImageUploadWrapClass('image-upload-wrap');
  };

  const handleDeleteMainImage = (values, setFieldValue) => {
    // Set the mainImage value to an empty string
    setFieldValue('mainImage', '');
    // Hide the old main image
    setShowOldMainImage(false);
  };

  return (
    <>
      <Breadcrumb pageName="AD Section" />
      {isLoading ? <Loader /> : null}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9 col-span-full">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <Formik
              onSubmit={(values) => confirmUpdateAD(values)}
              enableReinitialize
              initialValues={{
                isActive: apiResponse?.isActive,
                mainImage: apiResponse?.mainImage,
                title: apiResponse?.title,
                description: apiResponse?.description,
              }}
              key={`AdSection`}
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
                    <div className="p-6.5">
                      {/* <!--   Title --> */}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your title here"
                          className="lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="title"
                          id="title"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeAD(e.target.value, 'title', setValues);
                          }}
                          onBlur={handleBlur}
                          value={values.title}
                        />
                        {touched.title && errors.title && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.title}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter your description here"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="description"
                          id="description"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeAD(
                              e.target.value,
                              'description',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.description}
                        />
                        {touched.description && errors.description && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      {/* Is Active */}
                      <div className="mt-5 mb-4.5 flex lg:items-center xs:items-start flex-col md:flex-row sm:flex-row xs:flex-row lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-2 xl:flex-row">
                        <p>Is Active</p>
                        <label className="block text-sm font-medium text-gray-700">
                          <Field
                            name="isActive"
                            type="checkbox"
                            className="taskCheckbox sr-only"
                          />
                          <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                            <span className="text-white opacity-0">
                              <svg
                                className="fill-current"
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                                  fill=""
                                />
                              </svg>
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="divider"></div>

                      {/* Old Main Image Preview */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full">
                          <a
                            href={
                              BaseURL.SmarterAspNetBase + apiResponse?.mainImage
                            }
                            target="_blank"
                          >
                            <svg
                              width="64px"
                              height="64px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#ffffff"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {' '}
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                ></rect>{' '}
                                <path
                                  d="M21 16V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18M21 16V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V18M21 16L15.4829 12.3219C15.1843 12.1228 14.8019 12.099 14.4809 12.2595L3 18"
                                  stroke="#000000"
                                  stroke-linejoin="round"
                                ></path>{' '}
                                <circle
                                  cx="8"
                                  cy="9"
                                  r="2"
                                  stroke="#000000"
                                  stroke-linejoin="round"
                                ></circle>{' '}
                              </g>
                            </svg>
                          </a>
                        </div>
                        <div>
                          <span className="mb-1.5 text-black dark:text-white">
                            Update Main Image
                          </span>
                          <span className="flex gap-2.5">
                            {showOldMainImage && (
                              <button
                                className="text-sm hover:text-primary"
                                onClick={() =>
                                  handleDeleteMainImage(values, setFieldValue)
                                }
                              >
                                Delete
                              </button>
                            )}
                          </span>
                        </div>
                      </div>
                      {touched.mainImage && errors.mainImage && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.mainImage}
                        </div>
                      )}
                      {showOldMainImage && (
                        <>
                          <div className="w-f mb-5.5 block">
                            <div className="mb-3">
                              <div className="file-upload-content">
                                <img
                                  id="oldMainImage"
                                  className="lg:max-h-[350px] lg:max-w-[1000px] lg:m-auto"
                                  src={
                                    BaseURL.SmarterAspNetBase + values.mainImage
                                  }
                                  alt="your"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Upload Image */}
                      {!showOldMainImage && (
                        <>
                          <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                            <input
                              onDragOver={() => handleDragOver()}
                              onDragLeave={() => handleDragLeave()}
                              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                              type="file"
                              onChange={(e) =>
                                readURL(e.target, values, setFieldValue)
                              }
                              accept="image/*"
                            />
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                    fill="#3C50E0"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                    fill="#3C50E0"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                    fill="#3C50E0"
                                  />
                                </svg>
                              </span>
                              <p>
                                <span className="text-primary">
                                  Click to upload
                                </span>{' '}
                                or drag and drop
                              </p>
                              <p className="mt-1.5">SVG, PNG, JPG</p>
                            </div>
                          </div>
                          {/* New Uploaded Photo Preview */}
                          <div className="w-f mb-5.5 block">
                            {fileUploadContentVisible && file && (
                              <div className="mb-3">
                                <div className="file-upload-content">
                                  <img
                                    className="lg:max-h-[350px] lg:max-w-[1000px] lg:m-auto"
                                    src={URL.createObjectURL(file)}
                                    alt="your"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
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
