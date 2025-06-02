// // src/app/(request)/all/page.tsx
// 'use client';

// import OutReqTable, { BackendRequestDataType } from '../../tables/OutReqTable';
// import BaseLayout from '@/components/BaseLayout';
// import React, { useState, useEffect } from 'react';
// import { notification } from 'antd';

// const API_BASE_URL = 'http://localhost:3001';

// export default function AllRequests() {
//   const [requestsData, setRequestsData] = useState<BackendRequestDataType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [api, contextHolder] = notification.useNotification();

//   useEffect(() => {
//     const fetchAllRequests = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/requests`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const data: BackendRequestDataType[] = await response.json();
//           setRequestsData(data);
//         } else {
//           const errorData = await response.json();
//           console.error('Failed to fetch all requests:', errorData);
//           api.error({
//             message: 'Ошибка загрузки заявок',
//             description: errorData.message || 'Не удалось получить список всех заявок.',
//           });
//           setRequestsData([]);
//         }
//       } catch (error) {
//         console.error('Error fetching all requests:', error);
//         api.error({
//           message: 'Сетевая ошибка',
//           description: 'Не удалось связаться с сервером для получения всех заявок.',
//         });
//         setRequestsData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllRequests();
//   }, [api]);

//   return (
//     <BaseLayout
//       title="Все заявки"
//       breadcrumbs={[
//         { title: 'Заявки', href: '/' },
//         { title: 'Все заявки' },
//       ]}
//     >
//       {contextHolder}
//       <OutReqTable dataSource={requestsData} loading={loading} />
//     </BaseLayout>
//   );
// }
// src/app/(request)/all/page.tsx
'use client';

import OutReqTable, { BackendRequestDataType } from '../../tables/OutReqTable';
import BaseLayout from '@/components/BaseLayout';
import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useAuthFetch } from '@/hooks/useAuthFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function AllRequests() {
  const [requestsData, setRequestsData] = useState<BackendRequestDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { fetchWithAuth } = useAuthFetch();

  useEffect(() => {
    const fetchAllRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/requests`);
        setRequestsData(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        api.error({
          message: 'Ошибка загрузки заявок',
          description: error instanceof Error ? error.message : 'Не удалось загрузить список заявок',
        });
        setRequestsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, [api, fetchWithAuth]);

  return (
    <BaseLayout
      title="Все заявки"
      breadcrumbs={[
        { title: 'Заявки', href: '/' },
        { title: 'Все заявки' },
      ]}
    >
      {contextHolder}
      <OutReqTable dataSource={requestsData} loading={loading} />
    </BaseLayout>
  );
}