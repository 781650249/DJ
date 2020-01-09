import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
// import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
// import SelectLang from '@/components/SelectLang'; // import logo from '../assets/logo.svg';
import logo from '@/assets/imgs/logo.png';

import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>{/* <SelectLang /> */}</div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              {/* <img alt="logo" className={styles.logo} src={logo} /> */}
              <img
                style={{
                  width: '40px',
                  height: '40px',
                  marginRight: '20px',
                }}
                src={logo}
                alt=""
              />
              <span className={styles.title}>DJ Project</span>
            </div>
            <div className={styles.desc}></div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          Copyright &copy; 2020 DJ PROJECT
        </div>
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
