'use client';

import { Typography, Breadcrumb, Layout, theme, message } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import AuthGuard from '@/components/AuthGuard';
import AppLoadingComponent from '@/components/AppLoading';
import React, { useEffect, useState, useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { Input } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function DocsPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const nameOfPage = 'Документы';

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadRef = useRef<any>(null);
  const [editingFileUid, setEditingFileUid] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3001/documents')
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
        message.error('Ошибка при загрузке списка документов');
      });
  }, []);

  const startEditing = (file: UploadFile) => {
    setEditingFileUid(file.uid);
    setNewFileName(file.name || '');
  };

  const saveNewName = async (file: UploadFile) => {
    if (!newFileName.trim()) {
      message.error('Имя файла не может быть пустым');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/documents/${file.filename}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newFileName.trim() }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      setFileList((prev) =>
        prev.map((f) =>
          f.uid === file.uid
            ? {
                ...f,
                name: newFileName.trim(),
              }
            : f,
        ),
      );
      message.success('Имя файла обновлено');
      setEditingFileUid(null);
    } catch (error) {
      message.error('Ошибка при переименовании файла');
    }
  };

  return (
    <AuthGuard>
      <AppLoadingComponent />
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
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Upload
                  ref={uploadRef}
                  action="http://localhost:3001/documents/upload"
                  listType="picture"
                  fileList={fileList}
                  onRemove={async (file) => {
                    try {
                      if (!file.filename) {
                        message.error('Неизвестное имя файла для удаления');
                        return;
                      }
                      await fetch(`http://localhost:3001/documents/${file.filename}`, {
                        method: 'DELETE',
                      });
                      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                      message.success('Файл успешно удален');
                    } catch (error) {
                      message.error('Ошибка при удалении файла');
                    }
                  }}
                  onChange={({ file, fileList: newFileList }: UploadChangeParam<UploadFile>) => {
                    if (file.status === 'done' && file.response) {
                      const updatedList = newFileList.map((f) => {
                        if (f.uid === file.uid) {
                          return {
                            ...f,
                            url: file.response.url,
                            name: file.response.originalname,
                          };
                        }
                        return f;
                      });
                      setFileList(updatedList);
                    } else {
                      setFileList(newFileList);
                    }
                  }}
                  showUploadList={{
                    showRemoveIcon: true,
                    showDownloadIcon: false,
                    showPreviewIcon: false,
                  }}
                  itemRender={(originNode, file, fileList, actions) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        {file.uid === editingFileUid ? (
                          <>
                            {console.log('Рендер Input для файла:', file)}
                            <Input
                              autoFocus
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onBlur={() => saveNewName(file)}
                              onPressEnter={() => saveNewName(file)}
                              style={{ width: 200 }}
                            />
                          </>
                        ) : (
                          <span
                            style={{ cursor: 'pointer', color: '#1677ff' }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Клик по имени файла:', file);
                              startEditing(file);
                            }}
                            title="Нажмите, чтобы переименовать"
                          >
                            {file.name}
                          </span>
                        )}
                        <span>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 8 }}
                          >
                            Скачать
                          </a>
                          <a onClick={() => actions.remove?.()}>Удалить</a>
                        </span>
                      </div>
                    );
                  }}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    style={{ float: 'right', marginBottom: 8 }}
                  >
                    Загрузить документ
                  </Button>
                </Upload>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}

