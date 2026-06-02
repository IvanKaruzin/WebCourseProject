export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand">★ CineVault</span>
        <span className="footer-text">© {new Date().getFullYear()} Онлайн-кинобиблиотека</span>
      </div>
    </footer>
  )
}
