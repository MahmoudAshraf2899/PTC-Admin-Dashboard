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
    retrieveProjects();
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

  const retrieveProjects = () => {
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
          <div className="text-sm font-medium text-black dark:text-white">
            {props.value}
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
    retrieveProjects();
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleBanUser = (id: number) => {
    setIsLoading(true);
    API.delete(`${END_POINTS.BAN_USER}/${id}`)
      .then((res) => {
        if (res && res.data) {
          toast.success('Operation completed successfully');

          setTimeout(() => {
            retrieveProjects();
          }, 5000);
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
                        onClick={() =>
                          navigate(`/EditProject/${row.original.id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => handleBanUser(row.original.id)}
                      >
                        Ban
                      </button>
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
