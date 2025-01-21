import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '../../Api/Api';
import { END_POINTS } from '../../constants/ApiConstant';
import Loader from '../../common/Loader';
import { BaseURL } from '../../constants/Bases.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface ApiResponse {
  id: string;
  title: string;
  icon: string;
  updatedAt: string;
  updatedBy: string;
}
interface FilePreview {
  file: File;
  preview: string;
  UID: string;
}
const GuaranteeSection = () => {
  const [initialValues, setInitialValues] = useState({
    title: '',
    isActive: false,
    children: [{ title: '', icon: '' }], // Ensure at least one child by default
  });
  const [isLoading, setIsLoading] = useState(true);
  const [imageUploadWrapClass, setImageUploadWrapClass] =
    useState('image-upload-wrap');
  const [
    mainImageFileUploadContentVisible,
    setMainImageFileUploadContentVisible,
  ] = useState(false);
  const [mainFile, setMainFile] = useState<File | null>(null);

  const [fileUploadContentVisible, setFileUploadContentVisible] =
    useState(false);
  const [showOldMainImage, setShowOldMainImage] = useState<boolean>(true);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    isActive: Yup.boolean()
      .oneOf([true], 'You must confirm this section is active')
      .required('Active status is required'), // This ensures it's explicitly validated
    children: Yup.array().of(
      Yup.object({
        title: Yup.string().required('Child title is required'),
        icon: Yup.string().required('Child icon is required'),
      }),
    ),
  });

  useEffect(() => {
    // Fetch data from the API and populate the form
    API.get(`${END_POINTS.GET_GUARANTEE_SECTION}/1`)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;

          // Map API response to Formik initialValues structure
          const mappedValues = {
            title: data.title || '',
            isActive: data.isActive || false,
            children:
              data.nodes.length > 0
                ? data.nodes.map((node) => ({
                    title: node.title || '',
                    icon: node.icon || '',
                  }))
                : [{ title: '', icon: '' }], // Add a default child if none exist
          };

          setInitialValues(mappedValues);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      });
  }, []);

  const handleAddSection = (values, setFieldValue) => {
    const newChild = { title: '', icon: '' };
    const updatedChildren = [...values.children, newChild];
    setFieldValue('children', updatedChildren);
  };

  const handleRemoveSection = (index, values, setFieldValue) => {
    const updatedChildren = values.children.filter((_, i) => i !== index);
    if (updatedChildren.length === 0) {
      updatedChildren.push({ title: '', icon: '' }); // Add a default child
    }
    setFieldValue('children', updatedChildren);
  };

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
    alert('Form submitted successfully!');
  };

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
  const readURL = (input: any, index: number, values, setFieldValue) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUploadWrapClass('image-upload-wrap image-dropping');
        setFileUploadContentVisible(true);
        setMainFile(input.files[0]);
        // Update the specific child by index
        const updatedChildren = [...values.children];
        updatedChildren[index].icon = input.files[0];

        // Update the Formik field value
        setFieldValue('children', updatedChildren);
        setFile(input.files[0]);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      // removeUpload();
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

  const handleDeleteIcon = (index: number, values, setFieldValue) => {
    // Update the specific child by index
    const updatedChildren = [...values.children];
    updatedChildren[index].icon = ''; // Set the icon to an empty string

    // Update the Formik field value
    setFieldValue('children', updatedChildren);

    // Optional: Hide the old main image
    setShowOldMainImage(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize // Ensures the form updates when initialValues change
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Guarantee Section
          </h1>

          {/* Main Section */}
          <div className="bg-white p-6 shadow-md rounded-lg mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                name="title"
                type="text"
                className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            <div className="mt-5 mb-4.5 flex items-center flex-col gap-2 xl:flex-row">
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

                <ErrorMessage
                  name="isActive"
                  component="div"
                  className="text-sm text-red-500"
                />
              </label>
            </div>
          </div>

          {/* Child Sections */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Child Sections
          </h2>
          {values.children.map((child, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="mb-4">
                  <label className="block mb-4 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Field
                    name={`children[${index}].title`}
                    type="text"
                    className="w-3/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name={`children[${index}].title`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <label className="mb-4 block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <ErrorMessage
                    name={`children[${index}].icon`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                  {/* Old Icon Preview */}
                  <div className="mb-4 flex items-center gap-3">
                    {showOldMainImage &&
                    values.children[index].icon.length != 0 ? (
                      <>
                        <div className="h-80 w-80 rounded-full">
                          <img
                            src={
                              BaseURL.SmarterAspNetBase +
                              values.children[index].icon
                            }
                            alt="Icon Preview"
                            className="h-60 w-60 object-cover rounded"
                          />
                        </div>
                        <div>
                          {/* Delete Old Icon */}
                          <span className="flex gap-2.5">
                            <span
                              className="text-sm hover:text-red-600"
                              onClick={() =>
                                handleDeleteIcon(index, values, setFieldValue)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M5 8V18C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18V8M14 11V17M10 11L10 17M16 5L14.5937 2.8906C14.2228 2.3342 13.5983 2 12.9296 2H11.0704C10.4017 2 9.7772 2.3342 9.40627 2.8906L8 5M16 5H8M16 5H21M8 5H3"
                                  stroke="#EB001B"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </span>
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {/* Upload Image */}
                  {!showOldMainImage && (
                    <>
                      <div className="relative mb-4 block w-full h-1/2 cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                        <input
                          onDragOver={() => handleDragOver()}
                          onDragLeave={() => handleDragLeave()}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          type="file"
                          onChange={(e) =>
                            readURL(e.target, index, values, setFieldValue)
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
                                className="file-upload-image h-70 w-80"
                                src={URL.createObjectURL(file)}
                                alt="your"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4">
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    handleRemoveSection(index, values, setFieldValue)
                  }
                >
                  Remove Section
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            onClick={() => handleAddSection(values, setFieldValue)}
          >
            Add Child Section
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default GuaranteeSection;
