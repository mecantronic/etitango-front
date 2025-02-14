/* eslint-disable prettier/prettier */
import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { useState } from 'react';

import withRoot from './components/withRoot';
// import EtiAppBar from './components/EtiAppBar';
// import AppFooter from './components/AppFooter';
import { UserContext } from './helpers/UserContext';
import { NotificationContext } from './helpers/NotificationContext';
import HistoriaEti from './modules/home/historia-del-ETI/HistoriaEti';
import ManifiestoETiano from './modules/home/manifiesto-etiano/ManifistoEtiano';
import ComisionGeneroContact from './modules/home/comision-de-genero/ComisionGeneroContact';
import ComisionGeneroProtocol from './modules/home/comision-de-genero/ComisionGeneroProtocol';
import ComisionGeneroWho from './modules/home/comision-de-genero/comisionGeneroWho';
import Inscripcion from './modules/inscripcion/Inscripcion';
import SignupList from './modules/inscripcion/SignupList';
import SignInScreen from './modules/signIn/signIn';
import SuperAdmin from './modules/superAdmin/index';
import EventsList from './modules/superAdmin/events/EventsList';
import Profile from './modules/user/profile';
import UserHome from './modules/user/index';
import Home from './modules/home/Home';
import Bank from './modules/user/profile/bank';
import withUserMenu from './components/withUserMenu';
// import EventForm from './modules/superAdmin/events/EventForm';
import NewEvent from './modules/superAdmin/events/NewEvent';
import TemplatesList from './modules/superAdmin/templates';
import EditTemplate from './modules/superAdmin/templates/EditTemplate';
import RolesList from './modules/superAdmin/roles/RolesList';
import { Notification } from './components/notification/Notification';
import Instructions from './modules/instructions/index';
import NewAppBar from 'components/NewBar';
import NewFooter from 'components/NewFooter';
import UserPanel from 'modules/user/components/panel/userPanel';
import NewEditEvent from 'modules/superAdmin/events/NewEditEvent';
import EditEvent from 'modules/superAdmin/events/EditEvent';

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    lng: 'es', //TODO this could be set from user info
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    nsSeparator: '.'
  });

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EDIT: '/newEditEvent',
  SUPERADMIN: '/super-admin',
  PROFILE: '/user/profile',
  USER: '/user',
  USER_HOME: '/user',
  SIGN_IN: '/sign-in',
  SIGNUP: '/inscripcion',
  SIGNUPS: '/lista-inscriptos',
  BANKS: '/banks',
  ROLES: '/roles',
  TEMPLATES: '/templates',
  INSTRUCTIONS: '/instructions',
  ATTENDANCE: '/attendance',
  DASHBOARD: '/dashboard'
};

export const PRIVATE_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.USER,
  ROUTES.USER_HOME,
  ROUTES.SIGNUP,
  ROUTES.SIGNUPS,
  ROUTES.ATTENDANCE
];

function App() {
  const [user, setUser] = useState({ user: {} });
  const [notification, setNotificationInfo] = useState({
    visible: false,
    notificationProps: {},
    notificationText: ''
  });
  const setNotification = (notificationText, notificationProps) => {
    if (!notification.visible) {
      setNotificationInfo({
        notificationProps,
        notificationText,
        visible: true
      });
      setTimeout(() => {
        setNotificationInfo({
          ...notification,
          visible: false
        });
      }, 10000);
    }
  };
  return (
    <div className="container">
      <UserContext.Provider value={{ user, setUser }}>
        <NotificationContext.Provider value={{ notification, setNotification }}>
          <NewAppBar />
          <div className='content'>
          <Notification {...notification} />
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<UserPanel />}/>
            <Route path="historia-del-eti" element={<HistoriaEti />} exact />
            <Route path="manifiesto-etiano" element={<ManifiestoETiano />} exact />
            <Route path="comision-de-genero-contact" element={<ComisionGeneroContact />} exact />
            <Route path="comision-de-genero-protocol" element={<ComisionGeneroProtocol />} exact />
            <Route path="comision-de-genero-who" element={<ComisionGeneroWho />} exact />
            {/* <Route path="info-general" element={<NewEditEvent />} exact /> */}
            <Route path={ROUTES.SIGNUP} element={withUserMenu(Inscripcion)()} exact />
            <Route path={ROUTES.SIGNUPS} element={withUserMenu(SignupList)()} exact />
            <Route
              path={ROUTES.ATTENDANCE}
              element={withUserMenu(SignupList)({ isAttendance: true })}
              exact
            />
            <Route path={ROUTES.SIGN_IN} element={<SignInScreen />} exact />
            <Route path={ROUTES.SUPERADMIN} element={<SuperAdmin />} />
            <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`} element={<EventsList />} />
            {/* <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}${ROUTES.EDIT}/:id`} element={<NewEditEvent />} /> */}
            <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}${ROUTES.EDIT}/:id`} element={<EditEvent />} />
            <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/:id`} element={<NewEvent />} />
            <Route path={`${ROUTES.SUPERADMIN}${ROUTES.ROLES}`} element={<RolesList />} />
            <Route path={ROUTES.USER} element={withUserMenu(UserHome)()} />
            <Route path={`${ROUTES.BANKS}/:id`} element={<Bank />} />
            <Route path={ROUTES.PROFILE} element={withUserMenu(Profile)()} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}`} element={<TemplatesList />} />
            <Route
              path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}/:id`}
              element={<EditTemplate />}
            />
            <Route path={ROUTES.INSTRUCTIONS} element={<Instructions />} />
          </Routes>
          </div>
          <NewFooter />
        </NotificationContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default withRoot(App);
