import { useState } from 'react';
import { BrandMark } from './Icons.jsx';

function Login({ onSubmit, notice }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedNickname = nickname.trim();
    if (!normalizedNickname) return setError('Digite um apelido para continuar.');
    if (normalizedNickname.length > 30) return setError('Use um apelido com no máximo 30 caracteres.');
    if (!onSubmit(normalizedNickname)) setError('Não foi possível iniciar a sessão demonstrativa.');
  }

  function handleChange(event) {
    setNickname(event.target.value);
    if (error) setError('');
  }

  return (
    <main className="login-page">
      <div className="login-orb login-orb-one" aria-hidden="true" />
      <div className="login-orb login-orb-two" aria-hidden="true" />
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><BrandMark size={44} /><span>TalkIA</span></div>
        <div className="login-heading">
          <span className="eyebrow">Ambiente demonstrativo</span>
          <h1 id="login-title">Conversas que viram clareza.</h1>
          <p>Entre com um apelido para acessar o espaço de colaboração do TalkIA.</p>
        </div>
        {notice && <div className="form-notice" role="alert">{notice}</div>}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="nickname">Como podemos chamar você?</label>
          <input id="nickname" name="nickname" value={nickname} onChange={handleChange} placeholder="Seu apelido"
            autoComplete="nickname" autoFocus maxLength={30}
            aria-describedby={error ? 'nickname-error nickname-hint' : 'nickname-hint'} aria-invalid={Boolean(error)} />
          <div className="field-meta"><span id="nickname-hint">De 1 a 30 caracteres</span><span>{nickname.length}/30</span></div>
          {error && <p className="field-error" id="nickname-error" role="alert">{error}</p>}
          <button className="button button-primary login-submit" type="submit">Entrar no TalkIA</button>
        </form>
        <p className="demo-disclaimer">Esta entrada não usa senha ou autenticação real. O apelido fica salvo apenas neste navegador.</p>
      </section>
      <p className="login-footer">TalkIA · colaboração com contexto</p>
    </main>
  );
}

export default Login;
