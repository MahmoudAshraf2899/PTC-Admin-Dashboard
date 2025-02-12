import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '../../Api/Api';
import { END_POINTS } from '../../constants/ApiConstant';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseURL } from '../../constants/Bases.js';

const SocialMedia = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUploadWrapClass, setImageUploadWrapClass] =
    useState('image-upload-wrap');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    API.get(END_POINTS.GET_SOCIAL_MEDIA_ICONS)
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data.data)) {
          setSocialMedia(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDragOver = () => {
    setImageUploadWrapClass('image-upload-wrap image-dropping');
  };

  const handleDragLeave = () => {
    setImageUploadWrapClass('image-upload-wrap');
  };

  const readURL = (input: any, setFieldValue) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUploadWrapClass('image-upload-wrap image-dropping');
        // setFileUploadContentVisible(true);
        // setFile(input.files[0]);
        setFieldValue('mainImage', input.files[0]);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
    }
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPG, PNG, GIF, WEBP) are allowed!');
        return; // Stop further execution
      }

      setFieldValue('icon', file);
    } else {
      setFieldValue('icon', null);
    }
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      let response;
      if (values.id) {
        //Update old one
        const formData = new FormData();
        formData.append('TargetLink', values.targetLink);
        formData.append('Id', values.id);
        if (values.icon) {
          formData.append('IconPath', values.icon);
          formData.append('OldImageExist', 'false');
        } else {
          formData.append('OldImageExist', 'true');
        }
        response = await axios.put(
          `${BaseURL.SmarterAspNetBase + END_POINTS.UPDATE_SOCIAL_MEDIA_ICONS}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        //Add New Icons
        const formData = new FormData();
        formData.append('TargetLink', values.targetLink);
        if (values.icon) {
          formData.append('NewIconPath', values.icon);
        }
        response = await axios.post(
          `${BaseURL.SmarterAspNetBase + END_POINTS.ADD_SOCIAL_MEDIA_ICONS}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      if (response.status === 200) {
        toast.success('Social media icon updated successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Error updating icon');
      console.error(error);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleDelete = async (key) => {
    setIsLoading(true);
    try {
      API.delete(
        `${
          BaseURL.SmarterAspNetBase + END_POINTS.DELETE_SOCIAL_MEDIA_ICONS
        }?id=${key}`,
      ).then((res) => {
        if (res.status === 200) {
          toast.success('Social media icon deleted successfully');
          navigate('/');
        } else {
          toast.error('Something went wrong');
        }
      });
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Social Media" />
      {/* Update existing social media icons */}
      <div className="rounded-sm border bg-white shadow p-6 mt-6">
        {socialMedia.map((item) => (
          <Formik
            key={item.id}
            initialValues={{
              id: item.id,
              targetLink: item.targetLink,
              icon: null,
            }}
            validationSchema={Yup.object({
              targetLink: Yup.string().required('Target Link is required'),
            })}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="mb-4 border p-4 rounded">
                <div className="mb-4">
                  <label className="block text-sm font-medium pb-2">
                    Target Link
                  </label>
                  <Field
                    name="targetLink"
                    className="lg:text-[16px] xs:text-[14px] lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="targetLink"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-4 flex lg:flex-row sm:flex-col xs:flex-col justify-start items-center gap-4">
                  {/* Show Old Icon */}
                  <img
                    src={
                      values.icon
                        ? URL.createObjectURL(values.icon)
                        : BaseURL.SmarterAspNetBase + item.iconPath
                    }
                    alt="Social Media Icon"
                    className="h-16 w-16 bg-white object-cover border rounded"
                  />

                  {/* File Input */}
                  <input
                    type="file"
                    className="input-file input-file-primary"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="w-full rounded bg-red   py-3 px-4 mb-4 text-white hover:bg-red-dark"
                  // disabled={isSubmitting}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="w-full rounded bg-primary py-3 px-4 text-white hover:bg-primary-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </Form>
            )}
          </Formik>
        ))}
      </div>
      {/* Add New  social media icons */}
      <div className="rounded-sm border bg-white shadow p-6 mt-6">
        <div className="  border-stroke pt-4   dark:border-strokedark">
          <h3 className="text-lg font-extrabold mb-4 text-black dark:text-white">
            Add New Social Media Icon
          </h3>
        </div>
        <Formik
          initialValues={{ id: '', icon: null, targetLink: '' }}
          validationSchema={Yup.object({
            targetLink: Yup.string().required('Target Link is required'),
            icon: Yup.mixed()
              .required('Icon is required')
              .test(
                'fileType',
                'Only image files are allowed',
                (value: File) =>
                  value &&
                  ['image/jpeg', 'image/png', 'image/gif'].includes(value.type),
              ),
          })}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium pb-2">
                  Target Link
                </label>
                <Field
                  name="targetLink"
                  className="lg:text-[16px] xs:text-[14px] lg:w-3/4 md:w-full sm:w-full xs:w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="targetLink"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload Icon
                </label>
                <input
                  type="file"
                  className="input-file input-file-primary"
                  onChange={(e) => setFieldValue('icon', e.target.files[0])}
                />
                <ErrorMessage
                  name="icon"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-primary py-3 px-4 text-white hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SocialMedia;
