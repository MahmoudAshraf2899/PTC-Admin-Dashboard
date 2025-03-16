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
import { Settings } from './pages/Settings';
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
import { EditUser } from './pages/Users/EditUser';
import { GeneralSettings } from './pages/GeneralSettings/GeneralSettings';
import SocialMedia from './pages/SocialMedia/SocialMedia';
import { ContactUs } from './pages/ContactUs/ContactUs';
import { AuthProvider } from './Auth/auth';

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

  return (
    <AuthProvider>
      {' '}
      {/* ✅ Wraps the whole app */}
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : token == null ? (
        <div>
          <PageTitle title="Signin | PTC Admin Dashboard" />
          <SignIn />
        </div>
      ) : (
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
            <Route path="/Hero-section" element={<HeroSection />} />
            <Route path="/Guarantee-Section" element={<GuaranteeSection />} />
            <Route path="/Ad-Section" element={<AdSection />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/AddProject" element={<AddProject />} />
            <Route path="/EditProject/:id" element={<EditProject />} />
            <Route path="/About-Us" element={<AboutUs />} />
            <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/constructions" element={<Constructions />} />
            <Route path="/development" element={<Developments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/AddUser" element={<AddUser />} />
            <Route path="/EditUser/:id" element={<EditUser />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/general-settings" element={<GeneralSettings />} />
            <Route path="/socailmedia" element={<SocialMedia />} />
            <Route path="/auth/signin" element={<SignIn />} />
          </Routes>
        </DefaultLayout>
      )}
    </AuthProvider>
  );
}

export default App;
