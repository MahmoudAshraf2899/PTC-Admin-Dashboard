import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTable, usePagination } from 'react-table';
import moment from 'moment';
import API from '../../Api/Api';
import { END_POINTS } from '../../constants/ApiConstant';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import Pagination from '../../common/paginator/Pagination.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ApiResponse {
  id: Number;
  title: string;
  description: string;
  projectTypeId: number;
  mainPage: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUsers] = useState<ApiResponse[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    retrieveUsers();
  }, [page, pageSize]);

  const getRequestParams = (
    searchTitle: string,
    page: number,
    pageSize: number,
  ) => {
    let params: { [key: string]: any } = {};

    if (searchTitle) {
      params['FullName'] = searchTitle;
    }

    if (page) {
      params['CurrentPage'] = page;
    }

    if (pageSize) {
      params['PageSize'] = pageSize;
    }

    return params;
  };

  const retrieveUsers = () => {
    setIsLoading(true);
    const params = getRequestParams(searchTitle, page, pageSize);
    const queryParams = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    API.get(`${END_POINTS.GET_USERS}?${queryParams}`)
      .then((res) => {
        if (res && res.data) {
          setUsers(res.data.data);
          setCount(res.data.page.totalCount);
          setTotalPages(Math.ceil(res.data.page.totalCount / pageSize));
        }
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'displayName',
        Cell: (props: any) => (
          <div className="text-sm font-medium text-black dark:text-white flex items-center gap-4">
            {props.value}
            {props.row.original.isBanned && (
              <svg
                height="18px"
                width="18px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512.002 512.002"
                xmlSpace="preserve"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path
                    style={{
                      fill: '#FF3F62',
                      // add other styles here
                    }}
                    d="M418.341,198.081c-7.508-3.578-15.33-6.595-23.415-9.008c-7.589-2.268-15.408-3.998-23.415-5.147 c-7.649-1.097-15.462-1.681-23.415-1.681c-13.457,0-26.54,1.631-39.06,4.706c-4.695,1.154-9.311,2.51-13.84,4.059 c-3.019,1.033-5.997,2.151-8.934,3.353c-27.898,11.417-51.971,30.314-69.721,54.18c-3.759,5.051-7.235,10.323-10.402,15.794 c-1.057,1.823-2.078,3.67-3.064,5.538c-1.051,1.989-2.071,3.993-3.041,6.027c-2.523,5.296-4.75,10.754-6.701,16.34 c-0.815,2.338-1.595,4.691-2.309,7.074c-2.27,7.589-3.996,15.413-5.15,23.415c-1.099,7.65-1.678,15.468-1.678,23.415 c0,19.15,3.312,37.537,9.375,54.634c1.438,4.057,3.03,8.042,4.769,11.948c1.739,3.906,3.628,7.73,5.66,11.467 c2.246,4.129,4.664,8.151,7.246,12.057c2.582,3.906,5.325,7.694,8.22,11.358c30.043,38.007,76.536,62.439,128.631,62.439 c90.378,0,163.903-73.527,163.903-163.903C512,280.895,473.667,224.433,418.341,198.081z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#EFC27B',
                      // add other styles here
                    }}
                    d="M277.464,99.904c0-54.011-43.94-97.953-97.952-97.953S81.561,45.893,81.561,99.904 c0,54.01,43.94,97.95,97.952,97.95S277.464,153.913,277.464,99.904z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#A4E276',
                      // add other styles here
                    }}
                    d="M193.571,400.782c-6.063-17.097-9.375-35.484-9.375-54.634c0-7.947,0.579-15.764,1.678-23.415 c1.152-8.002,2.88-15.825,5.15-23.415c0.712-2.384,1.492-4.738,2.309-7.074c1.951-5.587,4.179-11.044,6.701-16.34 c0.969-2.036,1.99-4.038,3.041-6.027c3.945-7.471,8.456-14.597,13.467-21.332c-12.127-2.544-24.517-3.86-37.028-3.86 C80.529,244.684,0,325.213,0,424.196c0,12.931,10.484,23.415,23.415,23.415h196.051c-5.791-7.327-10.975-15.157-15.466-23.415 C199.935,416.722,196.448,408.896,193.571,400.782z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#830018',
                      // add other styles here
                    }}
                    d="M394.926,322.733h-46.829h-46.828c-12.931,0-23.415,10.484-23.415,23.415 c0,12.933,10.484,23.415,23.415,23.415h46.828h46.829c12.931,0,23.415-10.482,23.415-23.415 C418.341,333.215,407.858,322.733,394.926,322.733z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#FF0C38',
                      // add other styles here
                    }}
                    d="M301.269,369.562c-12.931,0-23.415-10.482-23.415-23.415c0-12.931,10.484-23.415,23.415-23.415 h46.828V182.244c-53.829,0-101.662,26.106-131.556,66.299c-5.011,6.736-9.522,13.86-13.467,21.332 c-1.051,1.989-2.071,3.993-3.041,6.027c-2.523,5.296-4.75,10.754-6.701,16.34c-0.815,2.337-1.595,4.691-2.309,7.074 c-2.27,7.59-3.996,15.413-5.15,23.415c-1.099,7.65-1.678,15.468-1.678,23.415c0,19.15,3.312,37.537,9.375,54.634 c2.877,8.114,6.364,15.942,10.429,23.415c4.491,8.258,9.675,16.087,15.466,23.415c30.043,38.007,76.536,62.439,128.631,62.439 V369.562H301.269z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#ECB45C',
                      // add other styles here
                    }}
                    d="M81.561,99.903c0,54.01,43.94,97.95,97.952,97.95V1.951C125.501,1.951,81.561,45.891,81.561,99.903z"
                  ></path>{' '}
                  <path
                    style={{
                      fill: '#64C37D',
                      // add other styles here
                    }}
                    d="M0,424.196c0,12.931,10.484,23.415,23.415,23.415h156.098V244.684 C80.529,244.684,0,325.212,0,424.196z"
                  ></path>{' '}
                </g>
              </svg>
            )}
          </div>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: (props: any) => (
          <div className="text-sm font-medium text-black dark:text-white">
            {props.value}
          </div>
        ),
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        Cell: (props: any) => (
          <div className="text-sm font-medium text-black dark:text-white">
            {props.value}
          </div>
        ),
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: user }, usePagination);

  const handleSearch = () => {
    setPage(1);
    retrieveUsers();
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleBanUser = (id: number) => {
    setIsLoading(true);
    let data = {
      id: id,
    };
    API.post(`${END_POINTS.BAN_USER}`, data)
      .then((res) => {
        if (res && res.data) {
          toast.success('Operation completed successfully');

          retrieveUsers();
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleActiveUser = (id: number) => {
    setIsLoading(true);
    let data = {
      id: id,
    };
    API.post(`${END_POINTS.ACTIVE_USER}`, data)
      .then((res) => {
        if (res && res.data) {
          toast.success('Operation completed successfully');

          retrieveUsers();
        }
      })
      .catch((error) => {
        console.error('Error Activating user:', error);
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Breadcrumb pageName="Users" />
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="search-bar flex items-center gap-4">
          <input
            type="text"
            className="w-full sm:w-1/4 rounded border-[1.5px] border-stroke bg-transparent py-3 px-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            placeholder="search by name"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <button
            className="inline-flex items-center justify-center search-btn py-3 px-6 sm:px-10 text-center font-medium text-white bg-primary hover:bg-opacity-90"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="flex justify-center sm:justify-end">
          <button
            className="inline-flex items-center justify-center search-btn py-3 px-6 sm:px-10 text-center font-medium text-white bg-primary hover:bg-opacity-90"
            type="button"
            onClick={() => navigate('/AddUser')}
          >
            Add New User
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto mb-10">
        <table
          {...getTableProps()}
          className="table-auto w-full bg-inherit mb-10"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="p-3 border-b">
                    {column.render('Header')}
                  </th>
                ))}
                <th className="p-3 border-b">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="p-3 border-b">
                      {cell.render('Cell')}
                    </td>
                  ))}
                  <td className="p-3 border-b">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => navigate(`/EditUser/${row.original.id}`)}
                      >
                        Edit
                      </button>
                      {row.original.isBanned ? (
                        <>
                          <button
                            className="hover:text-green-500"
                            onClick={() => handleActiveUser(row.original.id)}
                          >
                            Activate
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="hover:text-red-500"
                            onClick={() => handleBanUser(row.original.id)}
                          >
                            Ban
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        lastPage={totalPages}
        maxLength={5}
        setCurrentPage={handlePageChange}
      />
    </>
  );
};

export default Users;
