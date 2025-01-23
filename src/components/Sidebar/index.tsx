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
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
