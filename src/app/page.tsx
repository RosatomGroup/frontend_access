import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <header></header>
      <main></main>
      <footer></footer>
      <div className={styles.page}>
        <p>Тестовая станица проекта.</p>
        <a className={styles.link} href="/login">
          Войти
        </a>
        <a className={styles.link} href="/register">
          Регистрация
        </a>
        <a className={styles.link} href="/users">
          Пользователи
        </a>
        <a className={styles.link} href="/profile">
          Профиль
        </a>
      </div>
    </>
  );
}
