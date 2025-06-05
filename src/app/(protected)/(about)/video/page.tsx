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

interface CustomUploadFile extends UploadFile {
  filename: string;
  url: string;
  status: 'done' | 'uploading' | 'error' | 'removed';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function VideoPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user } = useUser();
  const isAdmin = user?.accessLevel === 'ADMIN';

  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const uploadRef = useRef<typeof Upload>(null);
  const [editingFileUid, setEditingFileUid] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/videos`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map(
          (file: { id: number; originalname: string; filename: string; url: string }) =>
            ({
              uid: file.id.toString(),
              name: file.originalname,
              filename: file.filename,
              status: 'done' as const,
              url: file.url,
            }) as CustomUploadFile,
        );
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

  const saveNewName = async (file: CustomUploadFile) => {
    if (!newFileName.trim()) {
      message.error('Имя видео не может быть пустым');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${file.filename}/rename`, {
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
            ? ({
                ...f,
                name: newFileName.trim(),
                filename: updated.filename,
                url: updated.url,
              } as CustomUploadFile)
            : f,
        ),
      );
      message.success('Имя видео обновлено');
      setEditingFileUid(null);
    } catch {
      message.error('Ошибка при переименовании видео');
    }
  };

  const handleDelete = async (file: CustomUploadFile) => {
    try {
      if (!file.filename) {
        message.error('Неизвестное имя файла для удаления');
        return;
      }
      await fetch(`${API_BASE_URL}/videos/${file.filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      message.success('Видео успешно удалено');
    } catch {
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
                    action={`${API_BASE_URL}/videos/upload`}
                    listType="text"
                    fileList={fileList}
                    beforeUpload={(file) => {
                      const isVideo = file.type.startsWith('video/');
                      if (!isVideo) {
                        message.error('Можно загружать только видеофайлы');
                      }
                      return isVideo || Upload.LIST_IGNORE;
                    }}
                    onRemove={async (file: UploadFile) => {
                      try {
                        const customFile = file as CustomUploadFile;
                        if (!customFile.filename) {
                          message.error('Неизвестное имя файла для удаления');
                          return;
                        }
                        await fetch(`${API_BASE_URL}/videos/${customFile.filename}`, {
                          method: 'DELETE',
                          credentials: 'include',
                        });
                        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                        message.success('Видео успешно удалено');
                      } catch {
                        message.error('Ошибка при удалении видео');
                      }
                    }}
                    onChange={({ file, fileList: newFileList }: UploadChangeParam<UploadFile>) => {
                      if (file.status === 'done' && file.response) {
                        const response = file.response as {
                          originalname: string;
                          filename: string;
                          url: string;
                        };
                        const updatedList = newFileList.map((f) => {
                          if (f.uid === file.uid) {
                            return {
                              ...f,
                              name: file.response.originalname,
                              filename: response.filename,
                              url: response.url,
                              status: 'done' as const,
                            } as CustomUploadFile;
                          }
                          return f as CustomUploadFile;
                        });
                        setFileList(updatedList);
                        message.success('Видео успешно загружено');
                      } else if (file.status === 'error') {
                        message.error(`Ошибка при загрузке видео: ${file.name}`);
                      } else {
                        setFileList(newFileList as CustomUploadFile[]);
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

