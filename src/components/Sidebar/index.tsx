import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/PTCLOGO.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Home Page --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/Home' || pathname.includes('Home')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/Home"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/' || pathname.includes('Home')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Home Page
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>

                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/Hero-section"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Hero Section
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/Guarantee-Section"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Guarantee Section
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/Ad-Section"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Ad. Section
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Menu Item constructions --> */}
              <li>
                <NavLink
                  to="/constructions"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('constructions') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    id="Layer_1"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#e0e0e0"
                    stroke="#e0e0e0"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <defs>
                        <style>.cls-1</style>
                      </defs>
                      <polygon
                        className="cls-1"
                        points="9.13 22.54 5.29 22.54 5.29 6.25 5.29 1.46 9.13 1.46 9.13 22.54"
                      ></polygon>
                      <polygon
                        className="cls-1"
                        points="1.46 6.25 22.54 6.25 22.54 5.29 9.13 1.46 5.29 1.46 1.46 5.29 1.46 6.25"
                      ></polygon>
                      <line
                        className="cls-1"
                        x1="23.5"
                        y1="22.54"
                        x2="0.5"
                        y2="22.54"
                      ></line>
                      <path
                        className="cls-1"
                        d="M20.62,6.25V9.64a1.82,1.82,0,0,0,.9,1.63A1.92,1.92,0,1,1,18.71,13"
                      ></path>
                      <line
                        className="cls-1"
                        x1="9.13"
                        y1="16.79"
                        x2="5.29"
                        y2="20.63"
                      ></line>
                      <line
                        className="cls-1"
                        x1="5.29"
                        y1="12"
                        x2="9.13"
                        y2="15.83"
                      ></line>
                      <line
                        className="cls-1"
                        x1="9.13"
                        y1="7.21"
                        x2="5.29"
                        y2="11.04"
                      ></line>
                    </g>
                  </svg>
                  Construction Page
                </NavLink>
              </li>
              {/* <!-- Menu Item development --> */}
              <li>
                <NavLink
                  to="/development"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('development') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    version="1.1"
                    id="_x32_"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    width="20"
                    height="20"
                    fill="#ffffff"
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
                      <style type="text/css"> .st0 </style>{' '}
                      <g>
                        {' '}
                        <rect
                          x="129.073"
                          y="459.447"
                          className="st0"
                          width="76.927"
                          height="10.702"
                        ></rect>{' '}
                        <rect
                          x="305.999"
                          y="459.447"
                          className="st0"
                          width="76.927"
                          height="10.702"
                        ></rect>{' '}
                        <path
                          className="st0"
                          d="M438.085,417.185c-4.714-10.228-11.416-18.46-19.046-25.014c-15.288-13.11-34.074-19.726-49.963-24.323 c-10.581-3.036-20.013-5.188-25.88-7.27c-2.679-0.932-5.017-1.258-6.962-1.646c-0.47-0.085-0.812-0.186-1.231-0.272l-3.906-17.714 c-1.829-8.224-8.399-14.368-16.46-15.828c0-3.758,0-7.913,0-12.48c9.603-10.686,23.41-27.244,29.084-53.5 c1.973-0.901,3.929-1.903,5.824-3.223c3.11-2.151,5.957-4.978,8.465-8.504c5.032-7.09,8.912-16.76,13.21-31.732 c1.619-5.692,2.376-10.647,2.376-15.051c0.016-5.086-1.044-9.506-2.962-13.078c-0.497-0.939-1.165-1.623-1.751-2.423v-9.879h23.244 v-43.132h-14.503c-4.496-53.104-42.776-96.407-93.364-108.414V18.74c0-10.352-8.387-18.732-18.736-18.74h-9.521h-9.514 c-10.36,0.008-18.736,8.388-18.736,18.74v4.962c-50.588,12.006-88.878,55.31-93.375,108.414H119.89v43.132h23.244v9.879 c-0.602,0.8-1.27,1.484-1.767,2.423c-1.918,3.572-2.963,7.991-2.963,13.078c0.012,4.404,0.757,9.358,2.388,15.051 c4.287,14.973,8.166,24.642,13.199,31.732c2.508,3.526,5.366,6.352,8.476,8.504c1.883,1.32,3.84,2.322,5.828,3.223 c5.669,26.256,19.466,42.814,29.068,53.5c0,4.566,0,8.722,0,12.48c-8.05,1.46-14.631,7.604-16.448,15.828l-3.918,17.714 c-0.408,0.086-0.761,0.187-1.216,0.272c-1.961,0.388-4.298,0.714-6.978,1.646c-5.852,2.081-15.299,4.233-25.868,7.27 c-15.902,4.597-34.688,11.214-49.975,24.323c-7.63,6.554-14.332,14.787-19.035,25.014c-4.729,10.22-7.42,22.366-7.42,36.578 c0,3.3,0.144,6.717,0.443,10.252c0.225,2.469,1.165,4.48,2.26,6.134c2.104,3.083,4.9,5.39,8.391,7.743 c6.112,4.053,14.593,8.014,25.449,11.898c32.494,11.587,86.293,22.195,152.953,22.21c66.656-0.015,120.455-10.624,152.948-22.21 c10.858-3.883,19.338-7.844,25.45-11.898c3.503-2.353,6.287-4.66,8.403-7.743c1.099-1.654,2.038-3.665,2.248-6.134 c0.299-3.534,0.443-6.952,0.443-10.252C445.505,439.551,442.803,427.404,438.085,417.185z M316.725,344.122l5.592,25.333 l13.249,59.915l-52.429-6.928l-19.858,21.333l0.078-15.741h-0.524l48.002-59.791l-0.039-1.941c0-0.016-0.093-4.186-0.171-9.483 c-0.078-5.289-0.171-11.696-0.171-16.06c0-0.45,0-0.854,0.016-1.273h0.482C313.719,339.486,316.123,341.419,316.725,344.122z M232.432,37.712v17.924h10.034V35.678V18.74c0-2.213,1.802-4.015,4.023-4.023h9.514h9.521c2.209,0.008,4.011,1.81,4.027,4.023 v16.938v19.958h10.034V37.712c46.169,10.36,81.082,50.379,83.629,99.08h-107.21H148.787 C151.351,88.091,186.247,48.072,232.432,37.712z M134.599,160.54v-13.714h6.64h7.156h107.606h107.602h7.172h6.636v13.714h-20.133 h-5.409h-95.868h-95.86h-5.42H134.599z M181.855,252.521l-0.746-4.216l-4.023-1.437c-2.559-0.916-4.52-1.848-6.216-3.029 c-2.524-1.778-4.796-4.201-7.463-9.164c-2.625-4.939-5.421-12.325-8.466-23.034c-1.343-4.675-1.817-8.309-1.817-11.012 c0-3.145,0.602-4.985,1.215-6.134c0.928-1.693,2.066-2.408,3.514-2.99c1.165-0.443,2.392-0.559,2.878-0.583l7.862,0.971v-8.333 c0,0,0-2.547,0-8.31h87.407h87.403c0,5.763,0,8.31,0,8.31v8.333l7.863-0.971c0.497,0.024,1.713,0.14,2.877,0.583 c1.449,0.582,2.586,1.297,3.514,2.99c0.614,1.149,1.216,2.989,1.227,6.134c0,2.703-0.485,6.337-1.817,11.012 c-3.056,10.71-5.84,18.095-8.464,23.034c-2.664,4.962-4.951,7.385-7.46,9.164c-1.713,1.181-3.658,2.113-6.221,3.029l-4.023,1.437 l-0.746,4.216c-4.718,26.358-18.304,41.199-28.338,52.375l-1.895,2.096v2.827c0,8.31,0,15.222,0,21.139v0.117v0.116l0.039,0.94 h-0.167c0,3.556-0.039,5.607-0.039,8.628c0,7.121,0.206,19.151,0.299,23.803l-14.488,18.041c-8.142,4.643-18.359,7.51-29.565,7.502 c-11.199,0.008-21.415-2.858-29.569-7.502l-14.476-18.041c0.082-4.652,0.287-16.682,0.287-23.803c0-3.02-0.039-5.072-0.039-8.628 h-0.155l0.027-0.94v-0.116v-0.117c0-5.917,0-12.83,0-21.139v-2.827l-1.883-2.096C200.16,293.72,186.562,278.879,181.855,252.521z M189.684,369.454l5.603-25.333c0.59-2.703,3.005-4.636,5.774-4.636h0.485c0,0.419,0,0.823,0,1.273 c0,4.365-0.078,10.772-0.171,16.06c-0.078,5.296-0.155,9.467-0.155,9.483l-0.039,1.941l47.986,59.791h-0.509l0.062,15.741 l-19.842-21.333l-52.444,6.928L189.684,369.454z M430.416,462.142c-0.195,0.272-0.587,0.73-1.282,1.336 c-1.63,1.452-4.581,3.409-8.592,5.467c-8.038,4.147-20.293,8.776-35.88,12.993c-31.196,8.449-75.788,15.353-128.66,15.353 c-52.864,0-97.453-6.904-128.652-15.353c-15.587-4.217-27.842-8.846-35.891-12.993c-4.011-2.058-6.962-4.015-8.582-5.467 c-0.707-0.606-1.099-1.064-1.293-1.336c-0.221-2.896-0.353-5.708-0.353-8.38c0.027-16.511,4.061-28.572,10.294-38.03 c9.342-14.134,24.327-22.786,39.98-28.68c7.8-2.943,15.679-5.179,22.917-7.113c7.172-1.934,13.653-3.526,19.073-5.42 l-15.967,72.185l65.744-8.674l32.73,35.157l32.738-35.157l65.732,8.674l-15.956-72.185c5.424,1.894,11.906,3.486,19.062,5.42 c7.238,1.934,15.132,4.17,22.93,7.113c15.652,5.894,30.636,14.546,39.968,28.68c6.243,9.459,10.282,21.52,10.306,38.03 C430.781,456.434,430.652,459.246,430.416,462.142z"
                        ></path>{' '}
                        <polygon
                          className="st0"
                          points="264.7,124.754 264.7,104.47 284.993,104.47 284.993,87.074 264.7,87.074 264.7,66.788 247.311,66.788 247.311,87.074 227.023,87.074 227.023,104.47 247.311,104.47 247.311,124.754 "
                        ></polygon>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                  Development Page
                </NavLink>
              </li>

              {/* <!-- Menu Item About Us --> */}
              <li>
                <NavLink
                  to="/About-Us"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('About-Us') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 512 512"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="#ffffff"
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
                      <title>about</title>{' '}
                      <g
                        id="Page-1"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        {' '}
                        <g
                          id="about-white"
                          fill="#e0e0e0"
                          transform="translate(42.666667, 42.666667)"
                        >
                          {' '}
                          <path
                            d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51168 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.154987,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51168 331.154987,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.44,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.44,384 213.333333,384 Z M240.04672,128 C240.04672,143.46752 228.785067,154.666667 213.55008,154.666667 C197.698773,154.666667 186.713387,143.46752 186.713387,127.704107 C186.713387,112.5536 197.99616,101.333333 213.55008,101.333333 C228.785067,101.333333 240.04672,112.5536 240.04672,128 Z M192.04672,192 L234.713387,192 L234.713387,320 L192.04672,320 L192.04672,192 Z"
                            id="Shape"
                          >
                            {' '}
                          </path>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                  About Us Page
                </NavLink>
              </li>

              {/* <!-- Menu Item Privcy Policy --> */}
              <li>
                <NavLink
                  to="/Privacy-Policy"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('Privacy-Policy') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#f7f7f7"
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
                        d="M11 21H4C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="#e0e0e0"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{' '}
                    </g>
                  </svg>
                  Privacy Policy Page
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/ContactUs"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('ContactUs') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#f7f7f7"
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
                        d="M11 21H4C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="#e0e0e0"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{' '}
                    </g>
                  </svg>
                  Contact Us Page
                </NavLink>
              </li>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Projects --> */}
              <li>
                <NavLink
                  to="/projects"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('projects') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 1024 1024"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M916.918857 496.566857H70.509714v330.532572a36.571429 36.571429 0 0 0 36.571429 36.571428h699.977143a36.571429 36.571429 0 1 1 0 73.142857H73.142857a73.142857 73.142857 0 0 1-73.142857-73.142857V94.281143a73.142857 73.142857 0 0 1 73.142857-73.142857h251.611429a73.142857 73.142857 0 0 1 52.077714 21.796571l111.908571 113.590857a36.571429 36.571429 0 0 0 26.038858 10.898286H914.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v521.508572a35.254857 35.254857 0 0 1-70.509714 0v-265.508572z m0-73.142857v-146.285714a36.571429 36.571429 0 0 0-36.571428-36.571429H501.321143a73.142857 73.142857 0 0 1-52.150857-21.796571l-111.908572-113.590857a36.571429 36.571429 0 0 0-25.965714-10.898286H107.081143a36.571429 36.571429 0 0 0-36.571429 36.571428v292.571429h846.409143z"
                        fill="#e0e0e0"
                      ></path>
                    </g>
                  </svg>
                  Projects
                </NavLink>
              </li>
              {/* <!-- Menu Item Users --> */}
              <li>
                <NavLink
                  to="/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
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
                      <path
                        d="M13 20V18C13 15.2386 10.7614 13 8 13C5.23858 13 3 15.2386 3 18V20H13ZM13 20H21V19C21 16.0545 18.7614 14 16 14C14.5867 14 13.3103 14.6255 12.4009 15.6311M11 7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7ZM18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z"
                        stroke="#e0e0e0"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{' '}
                    </g>
                  </svg>
                  Users
                </NavLink>
              </li>
              {/* Social Media */}
              <li>
                <NavLink
                  to="/socailmedia"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('socailmedia') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    height="18"
                    width="18"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 455.683 455.683"
                    xmlSpace="preserve"
                    fill="#ffffff"
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
                      <g>
                        {' '}
                        <g>
                          {' '}
                          <path d="M383.183,143.241c0-0.129,0.043-0.949,0.043-0.949c-0.022-67.215-54.704-121.896-121.94-121.896 c-46.658,0-87.362,27.309-107.789,68.164c-10.462-8.111-22.434-13.978-35.98-13.978c-33.176,0-60.182,26.985-60.182,60.161 c0,0,0.41,2.934,0.733,5.199C24.159,151.481,0,182.5,0,219.17c0,22.649,8.844,44.004,24.85,60.01 c16.027,16.027,37.361,24.871,60.01,24.871h289.501c44.846,0,81.322-36.455,81.322-81.279 C455.704,181.054,423.693,147.814,383.183,143.241z M374.383,280.064H84.859c-16.243,0-31.536-6.363-43.055-17.861 c-11.476-11.497-17.817-26.791-17.817-43.055c0-29.185,20.773-54.315,49.332-59.794l11.174-2.135l-1.855-12.856l-1.316-9.621 c0-19.975,16.221-36.174,36.196-36.174c11.821,0,22.951,5.781,29.746,15.531l13.59,19.565l7.571-22.563 c13.46-39.906,50.756-66.697,92.819-66.697c54.035,0,97.974,43.918,97.974,97.91l-1.208,22.973l13.525,0.237l2.826-0.086 c31.623,0,57.357,25.712,57.357,57.335C431.718,254.33,406.005,280.064,374.383,280.064z M378.006,392.297v42.991h-84.277v-42.991 c0-8.758,7.161-15.876,15.811-15.876h52.654C370.866,376.421,377.985,383.539,378.006,392.297z M200.824,344.82 c0-16.005,12.986-28.991,28.991-28.991s28.97,12.986,28.97,28.991c0,16.006-12.986,28.991-28.97,28.991 C213.81,373.811,200.824,360.847,200.824,344.82z M306.888,344.82c0-16.005,12.986-28.991,28.991-28.991 c16.006,0,28.991,12.986,28.991,28.991c0,16.006-12.986,28.991-28.991,28.991S306.888,360.847,306.888,344.82z M94.804,344.82 c0-16.005,12.986-28.991,28.991-28.991s28.991,12.986,28.991,28.991c0,16.006-12.986,28.991-28.991,28.991 S94.804,360.847,94.804,344.82z M271.964,392.297v42.991h-84.234v-42.991c0-8.758,7.097-15.876,15.833-15.876h52.568 C264.868,376.421,271.943,383.539,271.964,392.297z M165.944,392.297v42.991H81.667v-42.991c0-8.758,7.162-15.876,15.811-15.876 h52.654C158.783,376.421,165.944,383.539,165.944,392.297z"></path>{' '}
                        </g>{' '}
                        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{' '}
                        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{' '}
                        <g> </g> <g> </g> <g> </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                  Social Media
                </NavLink>
              </li>
              {/* Menu Item General Settings */}
              <li>
                <NavLink
                  to="/general-settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('general-settings') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
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
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
                        fill="#e0e0e0"
                      ></path>{' '}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z"
                        fill="#e0e0e0"
                      ></path>{' '}
                    </g>
                  </svg>
                  General Settings
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
