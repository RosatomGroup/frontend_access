import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import {
  QuestionCircleOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Button } from 'antd';

export default function Header() {
  return (
    <div className={styles.wrapper}>
      {/* <div > */}
      <Link href={'/'} className={styles.headerLogo}>
        <img src="./logo.png" alt="logo app" />
        <h2>RBAC</h2>
      </Link>
      {/* </div> */}
      <nav className={styles.navHeader}>
        <Button
          type="link"
          icon={<SearchOutlined />}
          style={{ fontSize: '20px', color: 'white' }}
        />
        <Button
          type="link"
          icon={<QuestionCircleOutlined />}
          style={{ fontSize: '20px', color: 'white' }}
        />
        {/* <QuestionCircleOutlined style={{ fontSize: '20px' }} /> */}
        <div className={styles.countNotification_wrapper}>
          <p className={styles.countNotification}>11</p>
          <BellOutlined style={{ fontSize: '20px' }} />
        </div>
        {/* <SearchOutlined style={{fontSize: '30px', color: 'white'}}/> */}
        <div className={styles.userProfile}>
          <div className={styles.userIcon}>
            <UserOutlined />
          </div>
          <p>Иванов Иван</p>
        </div>
      </nav>
    </div>
  );
}
