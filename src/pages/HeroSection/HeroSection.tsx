import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

interface ApiResponse {
  id: string;
  isActive: boolean;
  mainImage: string;
  mainTitle: string;
  subImage: string;
  subTitle: string;
  subTitleDescription: string;
  updatedAt: string;
  updatedBy: string;
}

const validationSchema = Yup.object().shape({
  farmArea: Yup.string()
    .matches(/^(?![1-9]$)\d+$/, 'من فضلك قم بإدخال رقم اكبر من 9')
    .required('من فضلك قم بإدخال مساحة العنبر'),
});

export const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  useEffect(() => {
    API.get(`${END_POINTS.GET_HERO_SECTION}/1`).then((res) => {
      if (res.status == 200) {
        setApiResponse(res.data.data);

        setIsLoading(false);
      }
    });
  }, []);

  const confirmAddBreeder = (values: any) => {
    setIsLoading(true);
  };

  const handleChangeHeroSection = (
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
      <Breadcrumb pageName="Hero Section" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9 col-span-full">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <Formik
              onSubmit={(values) => confirmAddBreeder(values)}
              enableReinitialize
              initialValues={{
                isActive: apiResponse?.isActive,
                mainImage: apiResponse?.mainImage,
                mainTitle: apiResponse?.mainTitle,
                subImage: apiResponse?.subImage,
                subTitle: apiResponse?.subTitle,
                subTitleDescription: apiResponse?.subTitleDescription,
              }}
              // validationSchema={validationSchema}
              key={`HeroSection`}
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
                      {/* <!-- Main Title --> */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Main Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your main title here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="mainTitle"
                          id="mainTitle"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeHeroSection(
                              e.target.value,
                              'mainTitle',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.mainTitle}
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Sub Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your sub title here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="subTitle"
                          id="subTitle"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeHeroSection(
                              e.target.value,
                              'subTitle',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.subTitle}
                        />
                      </div>

                      {/* Subtitle Description */}
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Sub Title
                          <br />
                          Description
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your sub title description here"
                          className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="subTitleDescription"
                          id="subTitleDescription"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeHeroSection(
                              e.target.value,
                              'subTitleDescription',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.subTitleDescription}
                        />
                      </div>

                      <div className="mt-5 mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <label
                          htmlFor="isActive"
                          className="flex cursor-pointer"
                        >
                          <div className="relative pt-0.5">
                            <input
                              type="checkbox"
                              className="taskCheckbox sr-only"
                              name="isActive"
                              id="isActive"
                              onChange={(e) => {
                                handleChange(e);

                                handleChangeHeroSection(
                                  e.target.value,
                                  'isActive',
                                  setValues,
                                );
                              }}
                              onBlur={handleBlur}
                              checked={values.isActive}
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
                          </div>
                          <p>Is Active</p>
                        </label>
                      </div>
                      {/* Main Image */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full">
                          <a
                            href={BaseURL.Base + apiResponse?.mainImage}
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
                          {/* <img src={userThree} alt="User" /> */}
                        </div>
                        <div>
                          <span className="mb-1.5 text-black dark:text-white">
                            Edit your Main Image
                          </span>
                          <span className="flex gap-2.5">
                            <button className="text-sm hover:text-primary">
                              Delete
                            </button>
                            <button className="text-sm hover:text-primary">
                              Update
                            </button>
                          </span>
                        </div>
                      </div>

                      {/* Sub Image */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full">
                          <a
                            href={BaseURL.Base + apiResponse?.subImage}
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
                            Edit your Sub Image
                          </span>
                          <span className="flex gap-2.5">
                            <button className="text-sm hover:text-primary">
                              Delete
                            </button>
                            <button className="text-sm hover:text-primary">
                              Update
                            </button>
                          </span>
                        </div>
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
