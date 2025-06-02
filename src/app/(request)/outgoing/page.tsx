// 'use client';

// import OutReqTable, { BackendRequestDataType } from '../../tables/OutReqTable';
// import BaseLayout from '@/components/BaseLayout';
// import React, { useState, useEffect } from 'react';
// import { notification } from 'antd';

// const API_BASE_URL = 'http://localhost:3001';

// export default function OutgoingRequest() {
//   const [requestsData, setRequestsData] = useState<BackendRequestDataType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [api, contextHolder] = notification.useNotification();

//   useEffect(() => {
//     const fetchOutgoingRequests = async () => {
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
//           console.error('Failed to fetch outgoing requests:', errorData);
//           api.error({
//             message: 'Ошибка загрузки исходящих заявок',
//             description: errorData.message || 'Не удалось получить список исходящих заявок.',
//           });
//           setRequestsData([]);
//         }
//       } catch (error) {
//         console.error('Error fetching outgoing requests:', error);
//         api.error({
//           message: 'Сетевая ошибка',
//           description: 'Не удалось связаться с сервером для получения исходящих заявок.',
//         });
//         setRequestsData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOutgoingRequests();
//   }, [api]);

//   return (
//     <BaseLayout
//       title="Исходящие заявки"
//       breadcrumbs={[
//         { title: 'Заявки', href: '/' },
//         { title: 'Исходящие' },
//       ]}
//     >
//       {contextHolder}
//       <OutReqTable dataSource={requestsData} loading={loading} />
//     </BaseLayout>
//   );
// }
// src/app/(request)/outgoing/page.tsx
'use client';

import OutReqTable, { BackendRequestDataType } from '../../tables/OutReqTable';
import BaseLayout from '@/components/BaseLayout';
import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useAuthFetch } from '@/hooks/useAuthFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function OutgoingRequest() {
  const [requestsData, setRequestsData] = useState<BackendRequestDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { fetchWithAuth } = useAuthFetch();

  useEffect(() => {
    const fetchOutgoingRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/requests`);
        setRequestsData(data);
      } catch (error) {
        console.error('Error fetching outgoing requests:', error);
        api.error({
          message: 'Ошибка загрузки',
          description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        });
        setRequestsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOutgoingRequests();
  }, [api, fetchWithAuth]);

  return (
    <BaseLayout
      title="Исходящие заявки"
      breadcrumbs={[
        { title: 'Заявки', href: '/' },
        { title: 'Исходящие' },
      ]}
    >
      {contextHolder}
      <OutReqTable dataSource={requestsData} loading={loading} />
    </BaseLayout>
  );
}