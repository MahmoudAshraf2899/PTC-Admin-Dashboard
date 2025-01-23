import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeroSection } from './pages/HeroSection/HeroSection';
import GuaranteeSection from './pages/GuaranteeSection/GuaranteeSection';
import { AdSection } from './pages/AdSection/AdSection';
import Projects from './pages/projects/Projects';
import AddProject from './pages/projects/AddProject';
import { EditProject } from './pages/projects/EditProject';
import { AboutUs } from './pages/AboutUs/AboutUs';
import { PrivacyPolicy } from './pages/PrivacyPolicy/PrivacyPolicy';
import { Constructions } from './pages/Constructions/Constructions';
import { Developments } from './pages/Developments/Developments';
import Users from './pages/Users/Users';
import AddUser from './pages/Users/AddUser';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : token == null ? (
    <>
      <ToastContainer />
      <div>
        <PageTitle title="Signin | PTC Admin Dashboard" />

        <SignIn />
      </div>
    </>
  ) : (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Routes>
          <Route
            index
            element={
              <>
                <PageTitle title="PTC Admin Dashboard" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/Hero-section"
            element={
              <>
                <PageTitle title="Hero Section | PTC - Admin Dashboard" />
                <HeroSection />
              </>
            }
          />
          <Route
            path="/Guarantee-Section"
            element={
              <>
                <PageTitle title="Guarantee Section | PTC - Admin Dashboard" />
                <GuaranteeSection />
              </>
            }
          />
          <Route
            path="/Ad-Section"
            element={
              <>
                <PageTitle title="Ad Section | PTC - Admin Dashboard" />
                <AdSection />
              </>
            }
          />

          <Route
            path="/projects"
            element={
              <>
                <PageTitle title="Projects | PTC - Admin Dashboard" />
                <Projects />
              </>
            }
          />
          <Route
            path="/AddProject"
            element={
              <>
                <PageTitle title="Add Project | PTC - Admin Dashboard" />
                <AddProject />
              </>
            }
          />
          <Route
            path="/EditProject/:id"
            element={
              <>
                <PageTitle title="Edit Project | PTC - Admin Dashboard" />
                <EditProject />
              </>
            }
          />
          <Route
            path="/About-Us"
            element={
              <>
                <PageTitle title="About Us | PTC - Admin Dashboard" />
                <AboutUs />
              </>
            }
          />
          <Route
            path="/Privacy-Policy"
            element={
              <>
                <PageTitle title="Privacy Policy  | PTC - Admin Dashboard" />
                <PrivacyPolicy />
              </>
            }
          />
          <Route
            path="/constructions"
            element={
              <>
                <PageTitle title="Constructions Page  | PTC - Admin Dashboard" />
                <Constructions />
              </>
            }
          />
          <Route
            path="/development"
            element={
              <>
                <PageTitle title="Developments Page  | PTC - Admin Dashboard" />
                <Developments />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <PageTitle title="Users Page  | PTC - Admin Dashboard" />
                <Users />
              </>
            }
          />
          <Route
            path="/AddUser"
            element={
              <>
                <PageTitle title="Add User Page  | PTC - Admin Dashboard" />
                <AddUser />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | PTC Admin Dashboard" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            }
          />
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
