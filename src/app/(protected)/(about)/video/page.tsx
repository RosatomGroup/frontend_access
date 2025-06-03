'use client';

import {
  App as AntdApp,
  Breadcrumb,
  Button,
  Input,
  Layout,
  message,
  Spin,
  theme,
  Typography,
  Upload,
} from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useUser } from '@/components/UserContext';

const { Header, Content } = Layout;

export default function VideoPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { user, isLoading } = useUser();
  const isAdmin = user?.accessLevel === 'ADMIN';

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadRef = useRef<any>(null);
  const [editingFileUid, setEditingFileUid] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/videos', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((file: any) => ({
          uid: file.id.toString(),
          name: file.originalname,
          filename: file.filename,
          status: 'done',
          url: file.url,
        }));
        setFileList(formatted);
      })
      .catch(() => {
        message.error('Ошибка при загрузке списка видео');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const startEditing = (file: UploadFile) => {
    setEditingFileUid(file.uid);
    setNewFileName(file.name || '');
  };

  const saveNewName = async (file: UploadFile) => {
    if (!newFileName.trim()) {
      message.error('Имя видео не может быть пустым');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/videos/${file.filename}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',

        body: JSON.stringify({ newName: newFileName.trim() }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const updated = await response.json();

      setFileList((prev) =>
        prev.map((f) =>
          f.uid === file.uid
            ? {
                ...f,
                name: newFileName.trim(),
                filename: updated.filename,
                url: updated.url,
              }
            : f,
        ),
      );
      message.success('Имя видео обновлено');
      setEditingFileUid(null);
    } catch (error) {
      message.error('Ошибка при переименовании видео');
    }
  };

  const handleDelete = async (file: UploadFile) => {
    try {
      if (!file.filename) {
        message.error('Неизвестное имя файла для удаления');
        return;
      }
      await fetch(`http://localhost:3001/videos/${file.filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      message.success('Видео успешно удалено');
    } catch (error) {
      message.error('Ошибка при удалении видео');
    }
  };

  return (
    <AntdApp>
      <Layout>
        <AppHeader />
        <Layout style={{ minHeight: '100vh' }}>
          <AppSider />
          <Layout>
            <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
              <Breadcrumb
                style={{ margin: '16px 0' }}
                items={[
                  {
                    title: 'О системе',
                  },
                  {
                    title: 'Видео',
                  },
                ]}
              />
              <Typography.Title level={4}>Видео</Typography.Title>
            </Header>
            <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
              <Spin spinning={loading} size="large">
                <div
                  style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <Upload
                    disabled={!isAdmin}
                    withCredentials={true}
                    name="file"
                    ref={uploadRef}
                    action="http://localhost:3001/videos/upload"
                    listType="text"
                    fileList={fileList}
                    beforeUpload={(file) => {
                      const isVideo = file.type.startsWith('video/');
                      if (!isVideo) {
                        message.error('Можно загружать только видеофайлы');
                      }
                      return isVideo || Upload.LIST_IGNORE;
                    }}
                    onRemove={async (file) => {
                      try {
                        if (!file.filename) {
                          message.error('Неизвестное имя файла для удаления');
                          return;
                        }
                        await fetch(`http://localhost:3001/videos/${file.filename}`, {
                          method: 'DELETE',
                          credentials: 'include',
                        });
                        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                        message.success('Видео успешно удалено');
                      } catch (error) {
                        message.error('Ошибка при удалении видео');
                      }
                    }}
                    onChange={({ file, fileList: newFileList }: UploadChangeParam<UploadFile>) => {
                      if (file.status === 'done' && file.response) {
                        const updatedList = newFileList.map((f) => {
                          if (f.uid === file.uid) {
                            return {
                              ...f,
                              name: file.response.originalname,
                              filename: file.response.filename,
                              url: file.response.url,
                              status: 'done',
                            };
                          }
                          return f;
                        });
                        setFileList(updatedList);
                        message.success('Видео успешно загружено');
                      } else if (file.status === 'error') {
                        message.error(`Ошибка при загрузке видео: ${file.name}`);
                      } else {
                        setFileList(newFileList);
                      }
                    }}
                    showUploadList={false}
                  >
                    {isAdmin && (
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        style={{ float: 'right', marginBottom: 8 }}
                      >
                        Загрузить видео
                      </Button>
                    )}
                  </Upload>

                  {fileList.map((file) => (
                    <div key={file.uid} style={{ marginBottom: '20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px',
                          padding: '10px',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        {file.uid === editingFileUid ? (
                          isAdmin && (
                            <Input
                              autoFocus
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onBlur={() => saveNewName(file)}
                              onPressEnter={() => saveNewName(file)}
                              style={{ width: 300 }}
                            />
                          )
                        ) : (
                          <span
                            style={{
                              cursor: isAdmin ? 'pointer' : 'default',
                              color: 'rgba(0, 0, 0, 0.8)',
                            }}
                            onClick={(e) => {
                              if (!isAdmin) return;
                              e.preventDefault();
                              e.stopPropagation();
                              startEditing(file);
                            }}
                            title={isAdmin ? 'Нажмите, чтобы переименовать' : ''}
                          >
                            {file.name}
                          </span>
                        )}
                        <span style={{ display: 'flex', flexDirection: 'row' }}>
                          {file.url && (
                            <Button
                              type="primary"
                              icon={<PlayCircleOutlined />}
                              ghost
                              style={{ marginRight: 8 }}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Открыть
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              type="primary"
                              icon={<DeleteOutlined />}
                              danger
                              ghost
                              onClick={() => {
                                handleDelete(file);
                              }}
                            >
                              Удалить
                            </Button>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Spin>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </AntdApp>
  );
}

