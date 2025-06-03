'use client';

import { Breadcrumb, Button, Input, Layout, message, Modal, Spin, theme, Typography } from 'antd';
import AppSider from '../../../../components/AppSider';
import AppHeader from '../../../../components/AppHeader';
import { List } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useUser } from '@/components/UserContext';
import Image from 'next/image';

const { Header, Content } = Layout;
const { TextArea } = Input;

type NewsItem = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
};

export default function UpdatesPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, isLoading } = useUser();
  const isAdmin = user?.accessLevel === 'ADMIN';

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      message.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAddNews = async () => {
    if (!newText.trim()) {
      message.warning('Введите текст новости');
      return;
    }

    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, text: newText }),
      });
      setNewText('');
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      message.error('Ошибка при сохранении новости');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await fetch(`/api/updates?id=${id}`, {
        method: 'DELETE',
      });
      fetchNews();
    } catch (err) {
      message.error('Ошибка при удалении новости');
    }
  };

  const handleEditClick = (item: NewsItem) => {
    setEditMode(true);
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewText(item.text);
    setIsModalOpen(true);
  };

  const handleUpdateNews = async () => {
    if (!newText.trim() || !editingId) {
      message.warning('Заполните все поля');
      return;
    }

    try {
      await fetch('/api/updates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title: newTitle, text: newText }),
      });
      setNewText('');
      setNewTitle('');
      setEditingId(null);
      setEditMode(false);
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      message.error('Ошибка при обновлении новости');
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
                  title: 'Объявления',
                },
              ]}
            />
            <Typography.Title level={4}>Обновления</Typography.Title>
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
                {isAdmin && (
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    style={{ marginBottom: 16 }}
                    onClick={() => {
                      setEditMode(false);
                      setEditingId(null);
                      setNewTitle('');
                      setNewText('');
                      setIsModalOpen(true);
                    }}
                  >
                    Загрузить новость
                  </Button>
                )}
                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={newsList}
                  renderItem={(item) => (
                    <List.Item>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <Typography.Title level={5}>{item.title}</Typography.Title>

                          <Typography.Paragraph>{item.text}</Typography.Paragraph>
                          <Typography.Text type="secondary">
                            <Image
                              src="/favicon.ico"
                              alt="logo"
                              width={20}
                              height={20}
                              style={{ marginRight: '5px' }}
                            />
                            опубликовано {new Date(item.createdAt).toLocaleString('ru-RU')}
                          </Typography.Text>
                        </div>

                        {isAdmin && (
                          <div>
                            <Button
                              type="primary"
                              ghost
                              icon={<EditOutlined />}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginRight: 8 }}
                              onClick={() => handleEditClick(item)}
                            >
                              {/* Редактировать */}
                            </Button>

                            <Button
                              type="primary"
                              icon={<DeleteOutlined />}
                              danger
                              ghost
                              onClick={() => handleDeleteNews(item.id)}
                            >
                              {/* Удалить */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />

                <Modal
                  title={editMode ? 'Редактировать новость' : 'Опубликовать новость'}
                  open={isModalOpen}
                  onOk={editMode ? handleUpdateNews : handleAddNews}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setEditingId(null);
                    setNewText('');
                    setNewTitle('');
                  }}
                  okText="Сохранить"
                  cancelText="Отмена"
                >
                  <TextArea
                    rows={1}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Введите заголовок новости..."
                    style={{ marginBottom: '10px' }}
                  />
                  <TextArea
                    rows={4}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Введите текст новости..."
                  />
                </Modal>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

