import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '../../Api/Api';
import { END_POINTS } from '../../constants/ApiConstant';
import Loader from '../../common/Loader';
import { BaseURL } from '../../constants/Bases.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FilePreview {
  file: File;
  index: number; // Add index to track file's corresponding child
}
const GuaranteeSection = () => {
  const [initialValues, setInitialValues] = useState({
    title: '',
    isActive: false,
    children: [{ title: '', icon: '' }], // Ensure at least one child by default
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploadResponses, setUploadResponses] = useState([{}]);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),

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
    const newChild = { title: '', icon: '', file: null }; // Include file property
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

  const uploadIcon = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await API.post(END_POINTS.ADD_MEDIA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const readURL = async (
    input: any,
    index: number,
    values: any,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const updatedChildren = [...values.children];
        updatedChildren[index].icon = e.target?.result; // Update preview
        setFieldValue('children', updatedChildren);

        // Add the file and index to the state
        setFiles((prevFiles) => [...prevFiles, { file, index }]);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleDeleteIcon = (index, values, setFieldValue) => {
    const updatedChildren = [...values.children];
    updatedChildren[index].icon = ''; // Reset the icon field
    setFieldValue('children', updatedChildren);
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const updatedChildren = [...values.children];

      for (const { file, index } of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('MediaType', '1');
        formData.append('Directory', '5');

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
          if (updatedChildren.length == 1) {
            updatedChildren[0].icon = mediaResponse.data.path;
          } else {
            updatedChildren[index].icon = mediaResponse.data.path; // Update icon with uploaded path
          }
        }
      }

      values.id = 1;
      // Use updated children with uploaded paths
      let payload = {
        ...values,
        nodes: updatedChildren,
      };
      API.put(
        `${BaseURL.SmarterAspNetBase}${END_POINTS.UPDATE_GUARANTEE_SECTION}`,
        payload,
      ).then((res) => {
        if (res.status == 200) {
          toast.success('Operation completed successfully');
          setIsLoading(false);
          navigate('/');
        }
      });
    } catch (error) {
      console.error('Error during form submission:', error);
    }
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
                {/* Title Field */}
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

                {/* Icon Upload */}
                <div>
                  <label className="mb-4 block text-sm font-medium text-gray-700">
                    Icon
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Show Preview if Icon Exists */}
                    {child.icon ? (
                      <div className="flex items-center gap-4 ">
                        <img
                          src={
                            child.icon.startsWith('\\') ||
                            child.icon.startsWith('//') // Check if it's a relative URL (from your server)
                              ? BaseURL.SmarterAspNetBase + child.icon // Prepend base URL for server icons
                              : child.icon // If it's a local file URL, use the direct URL
                          }
                          alt="Icon Preview"
                          className="h-20 w-20 object-cover rounded bg-black-2"
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
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
                        </button>
                      </div>
                    ) : (
                      <div className="relative block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                        <input
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          type="file"
                          onChange={(e) =>
                            readURL(e.target, index, values, setFieldValue)
                          }
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="text-primary">Click to upload</span>
                          <p>SVG, PNG, JPG, or GIF (max: 800x800px)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <ErrorMessage
                    name={`children[${index}].icon`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div className="p-4">
                <button
                  type="button"
                  className="text-red-500 font-bold hover:text-red-700"
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
