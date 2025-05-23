import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import API from '../../Api/Api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { END_POINTS } from '../../constants/ApiConstant';
import { BaseURL } from '../../constants/Bases.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import ProgressBar from '@ramonak/react-progress-bar';

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
  mediaType: string;
}

interface ApiResponse {
  id: number;
  title: string;
  description: string;
  mainImageUrl: string;
  mainImageUID: string;
  projectTypeId: number;
  order: number;
  mainPage: boolean;
  isSoldOut: boolean;
  media: Media[];
}

const validationSchema = Yup.object().shape({
  order: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be a non-negative number')
    .max(1000, 'Must be less than 1000')
    .required('Order Field is required'),
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
  const [mainImageName, setMainImageName] = useState('');

  const [mediaUIDs, setMediaUIDs] = useState<string[]>([]);
  const [progress, setProgress] = useState(1);

  const [mainImageUID, setMainImageUID] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [projectTypeId, setProjectTypeId] = useState('1');
  const [fileProgress, setFileProgress] = useState({});

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
            type: media.mediaType == '2' ? 'video' : 'image',
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
        // Create an object to update the fileProgress state
        const fileProgressUpdate = mediaFiles.reduce((acc, file) => {
          acc[file.file.name] = 'uploaded';
          return acc;
        }, {});
        setMediaUIDs(mediaFiles.map((f) => f.UID));
        setFiles(mediaFiles);
        setFileProgress(fileProgressUpdate);

        setIsLoading(false);
      }
    });
  }, []);

  const confirmEditProject = async (values: any) => {
    setIsLoading(true);
    let ImageUrl = '';
    console.log('mediaUIDs :', mediaUIDs);
    try {
      // Second: Upload the main image if changed
      // if (showOldMainImage == false && mainFile != null) {
      //   const mainImageData = {
      //     File: mainFile,
      //     MediaType: 1,
      //     Directory: 8,
      //   };
      //   const mainImageResponse = await axios.post(
      //     `${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_MEDIA}`,
      //     mainImageData,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem('token')}`,
      //         'Content-Type': 'multipart/form-data',
      //       },
      //     },
      //   );

      //   let mainImageUID = '';
      //   if (mainImageResponse.status === 200) {
      //     mainImageUID = mainImageResponse.data.id;
      //     setMainImageUID(mainImageUID);
      //     ImageUrl = mainImageResponse.data.path;
      //     setMainImageUrl(mainImageResponse.data.path);
      //   }
      // }

      //Third Update Project
      const data = {
        id: apiResponse?.id,
        title: apiResponse?.title,
        description: apiResponse?.description,
        order: apiResponse?.order,
        projectTypeId: projectTypeId,
        mainImage: ImageUrl.length == 0 ? apiResponse?.mainImageUrl : ImageUrl,
        mainPage: apiResponse?.mainPage,
        isSoldOut: apiResponse?.isSoldOut,
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

  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        setFileProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: 'uploading',
        }));
        if (file.type.startsWith('video/')) {
          setFiles((prevFiles) => [
            ...prevFiles,
            { file, preview: URL.createObjectURL(file), UID: '' },
          ]);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('MediaType', '2');
          formData.append('Directory', '8');

          const mediaResponse = await axios.post(
            `${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_MEDIA}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          if (mediaResponse.status === 200) {
            setMediaUIDs((prev) => [...prev, mediaResponse.data.id]);
            setFileProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: 'uploaded',
            }));
          }
        } else {
          const options = {
            maxSizeMB: 1, // Reduce file size to 1MB
            maxWidthOrHeight: 1920, // Resize large images
            useWebWorker: true, // Improve performance
            fileType: 'image/jpeg', // Force JPEG format
          };

          try {
            const blobFile = await imageCompression(file, options);
            const compressedFile = new File([blobFile], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            setFiles((prevFiles) => [
              ...prevFiles,
              { file, preview: URL.createObjectURL(compressedFile), UID: '' },
            ]);

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append(
              'MediaType',
              file.type.includes('image') ? '1' : '2',
            );
            formData.append('Directory', '8');

            const mediaResponse = await axios.post(
              `${BaseURL.SmarterAspNetBase}${END_POINTS.ADD_MEDIA}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            );

            if (mediaResponse.status === 200) {
              setMediaUIDs((prev) => [...prev, mediaResponse.data.id]);
            }
          } catch (error) {
            console.error('Upload failed:', error);
          } finally {
            setFileProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: 'uploaded',
            }));
          }
        }

        return {
          file,
          preview: URL.createObjectURL(file),
        };
      }),
    );

    // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mkv', '.mov'],
    },
    multiple: true,
  });

  const removeFile = (fileName: string, UID: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((filePreview) => filePreview.file.name !== fileName),
    );

    setMediaUIDs((prevUIDs) => prevUIDs.filter((uid) => uid !== UID));
  };

  const removeUpload = () => {
    setMainFile(null);
    setImageUploadWrapClass('image-upload-wrap');
    setFileUploadContentVisible(false);
  };
  const readURL = async (input: any) => {
    if (input.files && input.files[0]) {
      setProgress(0);
      let fakeProgress = 0;
      let progressInterval: NodeJS.Timeout | null = null;

      progressInterval = setInterval(() => {
        fakeProgress += 5;
        setProgress((prev) => (prev < 95 ? prev + 5 : prev)); // avoid reaching 100 early
      }, 200); // update every 200ms
      const file = input.files[0];
      setMainImageName(file.name);
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files.');
        removeUpload();
        return;
      }
      const reader = new FileReader();

      const options = {
        maxSizeMB: 1, // Reduce file size to 1MB
        maxWidthOrHeight: 1920, // Resize large images
        useWebWorker: true, // Improve performance
      };

      try {
        const blobFile = await imageCompression(file, options);
        const compressedFile = new File([blobFile], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        const formData = new FormData();
        formData.append('file', compressedFile);

        const data = {
          File: compressedFile,
          MediaType: file.type.includes('image') ? 1 : 2,
          Directory: 8,
        };
        setFileProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: 'uploading',
        }));
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
          setMainImageUID(mediaResponse.data.id);
          if (progressInterval) clearInterval(progressInterval);
          setProgress(100);
          setFileProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: 'uploaded',
          }));
          reader.onload = (e) => {
            setImageUploadWrapClass('image-upload-wrap image-dropping');
            setMainImageFileUploadContentVisible(true);
            setMainFile(input.files[0]);
          };

          reader.readAsDataURL(input.files[0]);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        if (progressInterval) clearInterval(progressInterval);
        setProgress(100);
        setFileProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: 'uploaded',
        }));
      }
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
                isSoldOut: apiResponse?.isSoldOut,
                projectTypeId: apiResponse?.projectTypeId,
                mainImageUrl: apiResponse?.mainImageUrl,
                order: apiResponse?.order,
              }}
              validationSchema={validationSchema}
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
                          className="select lg:max-w-md sm:max-w-full xs:max-w-full text-slate-500  border-none bg-slate-200"
                          value={projectTypeId}
                          onChange={(e) => setProjectTypeId(e.target.value)}
                        >
                          <option value="1">Constructions</option>
                          <option value="2">Developments</option>
                        </select>
                      </div>
                      {/* Project  Order*/}
                      <div className="mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="lg:mb-2.5 block text-black dark:text-white">
                          Order
                        </label>
                        <input
                          type="text"
                          placeholder="Enter project view order"
                          className="lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          name="order"
                          id="order"
                          onChange={(e) => {
                            handleChange(e);

                            handleChangeValues(
                              e.target.value,
                              'order',
                              setValues,
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.order}
                        />
                        {touched.order && errors.order && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.order}
                          </div>
                        )}
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

                      {/* Is Sold Out */}
                      <div className="mt-5 mb-4.5 flex lg:items-center xs:items-start flex-col lg:gap-6 md:gap-4 sm:gap-4 xs:gap-2 gap-6 xl:flex-row">
                        <label className="flex cursor-pointer">
                          <div className="relative pt-0.5">
                            <input
                              type="checkbox"
                              className="taskCheckbox sr-only"
                              name="isSoldOut"
                              id="isSoldOut"
                              onChange={(e) => {
                                handleChange(e);
                                handleChangeValues(
                                  e.target.checked,
                                  'isSoldOut',
                                  setValues,
                                );
                              }}
                              onBlur={handleBlur}
                              checked={values.isSoldOut}
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
                          <p>Is Sold Out</p>
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
                                <p className="mt-1.5">SVG, PNG, JPG</p>
                                <p>(max, 700 X 700px)</p>
                              </div>
                            </div>
                            {/* New Uploaded Photo Preview */}
                            <div className="w-f mb-5.5 block">
                              {fileProgress[mainImageName] === 'uploading' ? (
                                <ProgressBar completed={progress} />
                              ) : (
                                <>
                                  {mainImageFileUploadContentVisible &&
                                    mainFile && (
                                      <div className="mb-3">
                                        <div className="file-upload-content !min-w-36 !min-h-29">
                                          <img
                                            className="m-auto h-60 w-60"
                                            src={URL.createObjectURL(mainFile)}
                                            alt="your"
                                          />
                                        </div>
                                      </div>
                                    )}
                                </>
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
                          <p className="mt-1.5">Images OR Videos (Max 30mb)</p>
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
                        {files.map((file) => (
                          <div
                            key={file.file.name}
                            style={{
                              margin: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                            className="flex flex-row gap-4"
                          >
                            {fileProgress[file.file.name] === 'uploading' && (
                              <div role="status">
                                <svg
                                  aria-hidden="true"
                                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                  />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                            )}
                            {fileProgress[file.file.name] === 'uploaded' && (
                              <>
                                {file.file.type.startsWith('image') && (
                                  <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    style={{
                                      width: '100px',
                                      height: '100px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                )}
                                {file.file.type.startsWith('video') && (
                                  <video
                                    src={file.preview}
                                    controls
                                    style={{ width: '100px', height: '100px' }}
                                  />
                                )}
                                <div
                                  className="mt-4"
                                  onClick={() =>
                                    removeFile(file.file.name, file.UID)
                                  }
                                >
                                  <span className="text-sm hover:text-red-600">
                                    Delete
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {Object.values(fileProgress).includes('uploading') ? (
                        <>
                          <button
                            className="flex w-full cursor-not-allowed justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            disabled
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex w-full  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Save
                          </button>{' '}
                        </>
                      )}
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
