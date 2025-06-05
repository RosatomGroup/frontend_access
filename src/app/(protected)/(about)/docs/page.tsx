'use client';

import { Breadcrumb, Button, Input, Layout, message, Spin, theme, Typography, Upload } from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useUser } from '@/components/UserContext';

const { Header, Content } = Layout;
const { Title } = Typography;

interface Document {
  id: number;
  originalname: string;
  filename: string;
  url: string;
}

interface CustomUploadFile extends UploadFile {
  filename: string;
  url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function DocsPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user } = useUser();
  const isAdmin = user?.accessLevel === 'ADMIN';

  const nameOfPage = 'Документы';

  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const uploadRef = useRef<unknown>(null);
  const [editingFileUid, setEditingFileUid] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/documents`)
      .then((res) => res.json())
      .then((data: Document[]) => {
        const formatted = data.map((file) => ({
          uid: file.id.toString(),
          name: file.originalname,
          filename: file.filename,
          status: 'done' as const,
          url: file.url,
        }));
        setFileList(formatted);
      })
      .catch(() => {
        message.error('Ошибка при загрузке списка документов');
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
      message.error('Имя файла не может быть пустым');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${file.filename}/rename`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newFileName.trim() }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const updated: Document = await response.json();

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
      message.success('Имя файла обновлено');
      setEditingFileUid(null);
    } catch (error) {
      console.error(error);
      message.error('Ошибка при переименовании файла');
    }
  };

  return (
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
                  title: 'Документы',
                },
              ]}
            />
            <Title level={4}>{nameOfPage}</Title>
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
                  ref={uploadRef}
                  action={`${API_BASE_URL}/documents/upload`}
                  listType="picture"
                  fileList={fileList}
                  onRemove={async (file: UploadFile) => {
                    try {
                      const customFile = file as CustomUploadFile;
                      if (!customFile.filename) {
                        message.error('Неизвестное имя файла для удаления');
                        return;
                      }
                      await fetch(`${API_BASE_URL}/documents/${customFile.filename}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                      message.success('Файл успешно удален');
                    } catch (error) {
                      console.error(error);
                      message.error('Ошибка при удалении файла');
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
                          } as CustomUploadFile;
                        }
                        return f;
                      });
                      setFileList(updatedList as CustomUploadFile[]);
                      message.success('Файл успешно загружен');
                    } else if (file.status === 'error') {
                      message.error(`Ошибка при загрузке файла: ${file.name}`);
                    } else {
                      setFileList(newFileList as CustomUploadFile[]);
                    }
                  }}
                  showUploadList={{
                    showRemoveIcon: isAdmin,
                    showDownloadIcon: false,
                    showPreviewIcon: false,
                  }}
                  itemRender={(originNode, file, fileList, actions) => {
                    const customFile = file as CustomUploadFile;
                    return (
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
                        {customFile.uid === editingFileUid ? (
                          isAdmin && (
                            <Input
                              autoFocus
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onBlur={() => saveNewName(customFile)}
                              onPressEnter={() => saveNewName(customFile)}
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
                        <span>
                          <Button
                            type="primary"
                            ghost
                            icon={<DownloadOutlined />}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 8 }}
                          >
                            Скачать
                          </Button>
                          {isAdmin && (
                            <Button
                              type="primary"
                              icon={<DeleteOutlined />}
                              danger
                              ghost
                              onClick={() => actions.remove?.()}
                            >
                              Удалить
                            </Button>
                          )}
                        </span>
                      </div>
                    );
                  }}
                >
                  {isAdmin && (
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      style={{ float: 'right', marginBottom: 8 }}
                    >
                      Загрузить документ
                    </Button>
                  )}
                </Upload>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

