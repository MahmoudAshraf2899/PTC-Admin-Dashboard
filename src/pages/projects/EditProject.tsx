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
  title: string;
  description: string;
  mainImageUrl: string;
  mainImageUID: string;
  projectTypeId: number;
  mainPage: boolean;
  media: Media[];
}

const validationSchema = Yup.object().shape({
  farmArea: Yup.string()
    .matches(/^(?![1-9]$)\d+$/, 'من فضلك قم بإدخال رقم اكبر من 9')
    .required('من فضلك قم بإدخال مساحة العنبر'),
});

export const EditProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [imageUploadWrapClass, setImageUploadWrapClass] =
    useState('image-upload-wrap');

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [file, setFile] = useState<File | null>(null);

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
    API.get(`${END_POINTS.GET_PROJECT}${id}`).then((res) => {
      if (res.status == 200) {
        const response: ApiResponse = res.data.data;
        setApiResponse(response);
        setProjectTypeId(response.projectTypeId.toString());
        // Map media to FilePreview format
        const mediaFiles: FilePreview[] = response.media.map((media) => {
          const file = new File([], media.mediaUID, {
            type: 'image',
          }); // File object with no content
          let preview = media.mediaUrl.startsWith('\\')
            ? media.mediaUrl.replace('\\', '/')
            : media.mediaUrl; // Normalize the URL if necessary
          preview = BaseURL.SmarterAspNetBase + preview;
          let UID = media.mediaUID;

          return {
            file,
            preview, // Include the preview property
            UID,
          };
        });

        setFiles(mediaFiles);
        setIsLoading(false);
      }
    });
  }, []);

  const confirmEditProject = async (values: any) => {
    setIsLoading(true);
    let ImageUrl = '';

    try {
      const mediaUIDs: string[] = [];

      // First: Upload all media files
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        if (files[i].UID.length == 0) {
          formData.append('file', files[i].file);

          const data = {
            File: files[i].file,
            MediaType: files[i].file.type === 'image/png' ? 1 : 2,
            Directory: 8,
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
            mediaUIDs.push(mediaResponse.data.id);
          }
        } else {
          mediaUIDs.push(files[i].UID);
        }
      }

      // Second: Upload the main image if changed
      if (showOldMainImage == false && mainFile != null) {
        const mainImageData = {
          File: mainFile,
          MediaType: 1,
          Directory: 8,
        };
        const mainImageResponse = await axios.post(
          `${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_MEDIA}`,
          mainImageData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        let mainImageUID = '';
        if (mainImageResponse.status === 200) {
          mainImageUID = mainImageResponse.data.id;
          setMainImageUID(mainImageUID);
          ImageUrl = mainImageResponse.data.path;
          setMainImageUrl(mainImageResponse.data.path);
        }
      }

      //Third Update Project
      const data = {
        id: apiResponse?.id,
        title: apiResponse?.title,
        description: apiResponse?.description,

        projectTypeId: projectTypeId,
        mainImage: ImageUrl.length == 0 ? apiResponse?.mainImageUrl : ImageUrl,
        mainPage: apiResponse?.mainPage,
        media: mediaUIDs.map((uid) => ({ uid })),
      };
      const projectResponse = await axios.put(
        `${BaseURL.SmarterAspNetBase}${END_POINTS.UPDATE_PROJECT}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (projectResponse.status === 200) {
        toast.success('Operation completed successfully');
        navigate('/projects');
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

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      UID: '',
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mkv', '.mov'],
    },
    multiple: true,
  });

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((filePreview) => filePreview.file.name !== fileName),
    );
  };

  const removeUpload = () => {
    setMainFile(null);
    setImageUploadWrapClass('image-upload-wrap');
    setFileUploadContentVisible(false);
  };
  const readURL = (input: any) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUploadWrapClass('image-upload-wrap image-dropping');
        setFileUploadContentVisible(true);
        setMainFile(input.files[0]);

        setFile(input.files[0]);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      removeUpload();
    }
  };

  const readMainImageURL = (input: any) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUploadWrapClass('image-upload-wrap image-dropping');
        setMainImageFileUploadContentVisible(true);
        setMainFile(input.files[0]);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      removeUpload();
    }
  };

  const handleDragOver = () => {
    setImageUploadWrapClass('image-upload-wrap image-dropping');
  };

  const handleDragLeave = () => {
    setImageUploadWrapClass('image-upload-wrap');
  };

  return (
    <>
      <Breadcrumb pageName="Edit Project" />
      {isLoading ? <Loader /> : null}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9 col-span-full">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <Formik
              onSubmit={(values) => confirmEditProject(values)}
              enableReinitialize
              initialValues={{
                title: apiResponse?.title,
                description: apiResponse?.description,
                mainPage: apiResponse?.mainPage,
                projectTypeId: apiResponse?.projectTypeId,
                mainImageUrl: apiResponse?.mainImageUrl,
              }}
              // validationSchema={validationSchema}
              key={`UpdateProject`}
              // validationSchema={validationSchema}
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
                      {/* <!-- Project Name --> */}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter project name here"
                          className="lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="title"
                          id="title"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(
                              e.target.value,
                              'title',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.title}
                        />
                      </div>

                      {/* description */}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter project description here"
                          className="lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="description"
                          id="description"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(
                              e.target.value,
                              'description',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.description}
                        />
                      </div>

                      {/* Project Type */}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Project Type
                          <br />
                        </label>

                        <select
                          className="select max-w-47.5 sm:max-w-full xs:max-w-full text-slate-500  border-none bg-slate-200"
                          value={projectTypeId}
                          onChange={(e) => setProjectTypeId(e.target.value)}
                        >
                          <option value="1">Constructions</option>
                          <option value="2">Developments</option>
                        </select>
                      </div>

                      {/* Main Page */}
                      <div className="mt-5 mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="flex cursor-pointer">
                          <div className="relative pt-0.5">
                            <input
                              type="checkbox"
                              className="taskCheckbox sr-only"
                              name="mainPage"
                              id="mainPage"
                              onChange={(e) => {
                                handleChange(e);

                                // Use `e.target.checked` for the checkbox value
                                handleChangeValues(
                                  e.target.checked,
                                  'mainPage',
                                  setValues,
                                );
                              }}
                              onBlur={handleBlur}
                              checked={values.mainPage}
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
                          <p>Show In Home Page</p>
                        </label>
                      </div>

                      <div className="divider"></div>

                      {/* Main Image */}
                      <>
                        {/* Old Main Image Preview */}
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full">
                            <a
                              href={
                                BaseURL.SmarterAspNetBase +
                                apiResponse?.mainImageUrl
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
                              Main Image
                            </span>
                            <span className="flex gap-2.5">
                              {showOldMainImage && (
                                <span
                                  className="text-sm hover:text-red-600"
                                  onClick={() => setShowOldMainImage(false)}
                                >
                                  Delete
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {showOldMainImage && (
                          <>
                            <div className="w-f mb-5.5 block">
                              <div className="mb-3">
                                <div className="file-upload-content">
                                  <img
                                    id="oldMainImage"
                                    className="file-upload-image h-40 w-40"
                                    src={
                                      BaseURL.SmarterAspNetBase +
                                      values.mainImageUrl
                                    }
                                    alt="Main Image"
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
                                onChange={(e) => readURL(e.target)}
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
                                <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                <p>(max, 800 X 800px)</p>
                              </div>
                            </div>
                            {/* New Uploaded Photo Preview */}
                            <div className="w-f mb-5.5 block">
                              {fileUploadContentVisible && file && (
                                <div className="mb-3">
                                  <div className="file-upload-content">
                                    <img
                                      className="file-upload-image h-800 w-80"
                                      src={URL.createObjectURL(file)}
                                      alt="your"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>

                      <div className="divider"></div>
                      <div className="mb-4.5 flex items-center flex-col gap-6 xl:flex-row">
                        <h1 className="mb-2.5 font-bold block text-black dark:text-white">
                          Project Attachments
                        </h1>
                      </div>
                      <div
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                        {...getRootProps()}
                      >
                        <input
                          {...getInputProps()}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
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
                          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                          <p>(max, 800 X 800px)</p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          marginTop: '10px',
                        }}
                      >
                        {files.map(({ file, preview }, index) => (
                          <div
                            key={index}
                            style={{
                              margin: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            {file.type.startsWith('image') && (
                              <img
                                src={preview}
                                alt={file.name}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                            {file.type.startsWith('video') && (
                              <video
                                src={preview}
                                controls
                                style={{ width: '100px', height: '100px' }}
                              />
                            )}
                            <div
                              className="mt-4"
                              onClick={() => removeFile(file.name)}
                            >
                              <span className="text-sm hover:text-red-600">
                                Delete
                              </span>
                            </div>
                          </div>
                        ))}
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
