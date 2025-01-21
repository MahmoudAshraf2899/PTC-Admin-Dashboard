import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const GuaranteeSection = () => {
  const initialValues = {
    mainTitle: '',
    mainDescription: '',
    children: [],
  };

  const validationSchema = Yup.object({
    mainTitle: Yup.string().required('Main title is required'),
    mainDescription: Yup.string().required('Main description is required'),
    children: Yup.array().of(
      Yup.object({
        title: Yup.string().required('Child title is required'),
        description: Yup.string().required('Child description is required'),
      }),
    ),
  });

  const handleAddSection = (values, setFieldValue) => {
    const newChild = { title: '', description: '' };
    const updatedChildren = [...values.children, newChild];
    setFieldValue('children', updatedChildren);
  };

  const handleRemoveSection = (index, values, setFieldValue) => {
    const updatedChildren = values.children.filter((_, i) => i !== index);
    setFieldValue('children', updatedChildren);
  };

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
    alert('Form submitted successfully!');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Guarantee Section
          </h1>

          {/* Main Section */}
          <div className="bg-white p-6 shadow-md rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Main Section</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                name="mainTitle"
                type="text"
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter title"
              />
              <ErrorMessage
                name="mainTitle"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                name="mainDescription"
                as="textarea"
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter description"
                rows="4"
              />
              <ErrorMessage
                name="mainDescription"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
          </div>

          {/* Child Sections */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Child Sections
          </h2>
          {values.children.map((child, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden transition-all duration-300"
            >
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700">
                  {`Child Section ${index + 1}`}
                </h3>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() =>
                    handleRemoveSection(index, values, setFieldValue)
                  }
                >
                  Remove
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Field
                    name={`children[${index}].title`}
                    type="text"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name={`children[${index}].title`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Field
                    name={`children[${index}].description`}
                    as="textarea"
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter description"
                    rows="4"
                  />
                  <ErrorMessage
                    name={`children[${index}].description`}
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
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
