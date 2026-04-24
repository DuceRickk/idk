import React, { useState, useEffect } from 'react';
import './index.css';
import {
  UI_TEXT, NAV_ITEMS, PHASES, CERTIFICATIONS,
  SKILLS_DATA, RESOURCES_BY_PHASE, RESOURCE_ICONS,
  MARKET_DECISIONS, MARKET_INSIGHTS,
} from './data';
import bcrypt from 'bcryptjs';

const HASH = '$2y$10$nOuJ22P5M7TzK62B1.1t1u5V8/T/P6bA.Wj9H4L/P0y.N5.eX/5';

const MI = ({ name, className = '' }) => (
  <span className={`material-symbols-rounded ${className}`}>{name}</span>
);

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('bussola_lang') || 'pt');
  const [activeSection, setActiveSection] = useState('dashboard');

  const [auth, setAuth]           = useState({ user: null, loading: true });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError]       = useState('');
  const [loginBusy, setLoginBusy]         = useState(false);

  const [certStatus, setCertStatus] = useState(() => JSON.parse(localStorage.getItem('bussola_certs') || '{}'));
  const [skillStatus, setSkillStatus] = useState(() => JSON.parse(localStorage.getItem('bussola_skills') || '{}'));
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [expandedCert, setExpandedCert] = useState(null);
  const [openSkillCats, setOpenSkillCats] = useState(new Set());
  const [toastMsg, setToastMsg] = useState('');

  const t = (key) => UI_TEXT[lang][key] || key;

  useEffect(() => {
    const ok = sessionStorage.getItem('bussola_auth');
    setAuth({ user: ok ? { id: 'local' } : null, loading: false });
  }, []);

  useEffect(() => {
    const updatedCerts = { ...certStatus };
    let changed = false;
    CERTIFICATIONS.forEach(c => {
      if (!c.isSeparator && !(c.id in updatedCerts)) {
        updatedCerts[c.id] = c.defaultStatus;
        changed = true;
      }
    });
    if (changed) setCertStatus(updatedCerts);
  }, []);

  useEffect(() => {
    localStorage.setItem('bussola_lang', lang);
    localStorage.setItem('bussola_certs', JSON.stringify(certStatus));
    localStorage.setItem('bussola_skills', JSON.stringify(skillStatus));
  }, [lang, certStatus, skillStatus]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getCertStats = () => {
    const certs = CERTIFICATIONS.filter(c => !c.isSeparator);
    return { total: certs.length, completed: certs.filter(c => certStatus[c.id] === 'completed').length };
  };

  const getSkillStats = () => {
    let total = 0, done = 0;
    SKILLS_DATA.forEach(cat => cat.skills.forEach(s => { total++; if (skillStatus[s]) done++; }));
    return { total, done };
  };

  const getProgress = () => {
    const c = getCertStats(), s = getSkillStats();
    const total = c.total + s.total, done = c.completed + s.done;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const getCurrentPhaseIndex = () => {
    for (let i = 0; i < PHASES.length; i++) {
      const phase = PHASES[i];
      const mainCerts = phase.certIds.filter(id => {
        const cert = CERTIFICATIONS.find(c => c.id === id);
        return cert && !cert.optional;
      });
      const allDone = mainCerts.every(id => certStatus[id] === 'completed');
      if (!allDone) return i;
    }
    return PHASES.length - 1;
  };

  const getNextCert = () => {
    return CERTIFICATIONS.find(c => !c.isSeparator && certStatus[c.id] === 'studying')
      || CERTIFICATIONS.find(c => !c.isSeparator && certStatus[c.id] === 'not_started');
  };

  const getPhaseProgress = (phase) => {
    const certs = phase.certIds.filter(id => {
      const cert = CERTIFICATIONS.find(c => c.id === id);
      return cert && !cert.optional && !cert.isSeparator;
    });
    const done = certs.filter(id => certStatus[id] === 'completed').length;
    return { done, total: certs.length, pct: certs.length ? Math.round((done / certs.length) * 100) : 0 };
  };

  const handleNav = (id) => {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSkillCat = (idx) => {
    const newSet = new Set(openSkillCats);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setOpenSkillCats(newSet);
  };

  const toggleSkill = (s) => setSkillStatus(prev => ({ ...prev, [s]: !prev[s] }));
  const setCert = (id, status) => setCertStatus(prev => ({ ...prev, [id]: status }));

  const handleLogout = () => {
    sessionStorage.removeItem('bussola_auth');
    setAuth({ user: null, loading: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true); setLoginError('');
    const ok = await bcrypt.compare(loginPassword, HASH);
    if (ok) {
      sessionStorage.setItem('bussola_auth', '1');
      setAuth({ user: { id: 'local' }, loading: false });
    } else {
      setLoginError('Senha incorreta');
    }
    setLoginBusy(false);
  };

  const LoginScreen = () => (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-logo"><MI name="explore" className="blue-text" /> Bússola</div>
        <h1 className="login-title">Entrar</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label className="login-label">Senha</label>
            <input
              className="login-input"
              type="password" autoComplete="current-password" required autoFocus
              value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
            />
          </div>
          {loginError && <div className="login-error">{loginError}</div>}
          <button className="login-btn" type="submit" disabled={loginBusy}>
            {loginBusy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );

  // ── Components ──────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <nav className="sidebar">
      <div className="sidebar-header">
        <MI name="explore" className="blue-text" /> Bússola
      </div>
      <ul className="nav-list">
        {NAV_ITEMS.map(n => (
          <li key={n.id}>
            <button className={`nav-item ${activeSection === n.id ? 'active' : ''}`} onClick={() => handleNav(n.id)}>
              <MI name={n.icon} />
              <span className="nav-label">{t(n.key)}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="lang-btn" onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')}>
          <MI name="language" /> {lang.toUpperCase()}
        </button>
        {auth.user && (
          <button className="lang-btn logout-btn" onClick={handleLogout} title="Sair">
            <MI name="logout" /> Sair
          </button>
        )}
      </div>
    </nav>
  );

  const MobileHeader = () => (
    <header className="mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
        <MI name="explore" /> Bússola
      </div>
      <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
        {lang.toUpperCase()}
      </button>
    </header>
  );

  const Dashboard = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? t('greeting_morning') : hour < 18 ? t('greeting_afternoon') : t('greeting_evening');
    const cs = getCertStats(), ss = getSkillStats(), prog = getProgress();
    const phaseIdx = getCurrentPhaseIndex();
    const currentPhase = PHASES[phaseIdx];
    const next = getNextCert();

    return (
      <section id="section-dashboard" className="section">
        <div className="dashboard-hero">
          <p className="hero-greeting">{greeting}</p>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-sub">{t('hero_sub')}</p>
        </div>
        <div className="stats-row">
          <div className="card stat-card">
            <div className="stat-value">{cs.completed}/{cs.total}</div>
            <div className="stat-label">{t('certs_done')}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{ss.done}/{ss.total}</div>
            <div className="stat-label">{t('skills_done')}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{prog}%</div>
            <div className="stat-label">{t('progress')}</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${prog}%` }}></div></div>
          </div>
        </div>

        <div className="card phase-status-card" style={{ borderLeft: `4px solid ${currentPhase.color}` }}>
          <div className="phase-status-label" style={{ color: currentPhase.color }}>
            <MI name="flag" /> {t('phase_label')} — Fase {currentPhase.number} {t('phase_of')} {PHASES.length}
          </div>
          <div className="phase-status-name">{currentPhase.name}</div>
          <div className="phase-status-tagline">{currentPhase.tagline}</div>
        </div>

        {next && (
          <div className="card suggestion-card">
            <div className="suggestion-label"><MI name="push_pin" /> {t('study_today')}</div>
            <div className="suggestion-text">{next.name}</div>
            <div className="suggestion-desc">{next.desc}</div>
            {next.gotcha && (
              <div className="gotcha-alert inline-gotcha">
                <MI name="warning" /> {next.gotcha}
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  const Trilha = () => {
    const certStatusLabels = {
      not_started: t('not_started'), studying: t('studying'),
      completed: t('completed'), retired: t('retired'),
    };

    return (
      <section id="section-trilha" className="section">
        <div className="section-header">
          <h2 className="section-title"><MI name="map" /> {t('section_trilha_title')}</h2>
          <p className="section-subtitle">{t('section_trilha_sub')}</p>
        </div>

        {PHASES.map((phase) => {
          const { done, total, pct } = getPhaseProgress(phase);
          const isExpanded = expandedPhase === phase.id;
          const phaseCerts = CERTIFICATIONS.filter(
            c => !c.isSeparator && c.phaseId === phase.id
          );

          return (
            <div key={phase.id} className={`phase-card ${isExpanded ? 'expanded' : ''}`} style={{ borderLeft: `4px solid ${phase.color}` }}>
              <div className="phase-header" onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}>
                <div className="phase-header-left">
                  <span className="phase-badge" style={{ background: phase.color }}>Fase {phase.number}</span>
                  <div>
                    <div className="phase-name">{phase.name}</div>
                    <div className="phase-tagline">{phase.tagline}</div>
                  </div>
                </div>
                <div className="phase-header-right">
                  <span className="phase-time"><MI name="schedule" /> {phase.estimatedTime}</span>
                  <span className="phase-cert-count">{done}/{total} certs</span>
                  <MI name="expand_more" className={`phase-chevron ${isExpanded ? 'open' : ''}`} />
                </div>
              </div>

              <div className="phase-progress-bar">
                <div className="phase-progress-fill" style={{ width: `${pct}%`, background: phase.color }}></div>
              </div>

              <div className={`phase-body ${isExpanded ? 'open' : ''}`}>
                  {/* Certifications */}
                  <div className="phase-section">
                    <h4 className="phase-section-title"><MI name="workspace_premium" /> Certificações desta fase</h4>
                    {phaseCerts.map(cert => {
                      const st = certStatus[cert.id] || 'not_started';
                      const isCertOpen = expandedCert === cert.id;
                      return (
                        <div key={cert.id} className={`cert-item-phase ${st}`}>
                          <div className="cert-item-header" onClick={() => setExpandedCert(isCertOpen ? null : cert.id)}>
                            <div className="cert-item-left">
                              <div className={`cert-dot ${st}`}>{st === 'completed' && <MI name="check" />}</div>
                              <div>
                                <div className="cert-item-name">
                                  {cert.name}
                                  {cert.optional && <span className="cert-optional-tag">{t('optional')}</span>}
                                  {st === 'retired' && <span className="cert-retired-tag">APOSENTADA</span>}
                                </div>
                                <div className="cert-item-desc">{cert.desc}</div>
                              </div>
                            </div>
                            <div className="cert-item-right">
                              <span className={`cert-badge ${st}`}>{certStatusLabels[st]}</span>
                              <MI name="expand_more" className={`phase-chevron ${isCertOpen ? 'open' : ''}`} />
                            </div>
                          </div>

                          {isCertOpen && (
                            <div className="cert-detail">
                              <div className="cert-detail-grid">
                                <div className="cert-detail-block">
                                  <div className="cert-detail-label"><MI name="info" /> {t('why_it_matters')}</div>
                                  <div className="cert-detail-text">{cert.whyItMatters}</div>
                                </div>
                                <div className="cert-detail-block">
                                  <div className="cert-detail-label"><MI name="receipt_long" /> {t('exam_info')}</div>
                                  <div className="cert-exam-row">
                                    <span>{cert.examDetails.price}</span>
                                    <span>{cert.examDetails.questions} questões</span>
                                    <span>{cert.examDetails.passingPct}% aprovação</span>
                                    <span><MI name="schedule" /> {cert.estimatedWeeks}</span>
                                  </div>
                                </div>
                              </div>

                              {cert.studyTips && cert.studyTips.length > 0 && (
                                <div className="cert-detail-block">
                                  <div className="cert-detail-label"><MI name="checklist" /> {t('how_to_study')}</div>
                                  <ul className="study-tip-list">
                                    {cert.studyTips.map((tip, i) => (
                                      <li key={i} className="study-tip-item">
                                        <MI name="check_circle" className="tip-icon" /> {tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {cert.gotcha && (
                                <div className="gotcha-alert">
                                  <MI name="warning" /> {cert.gotcha}
                                </div>
                              )}

                              <div className="cert-actions">
                                {['not_started', 'studying', 'completed', 'retired'].map(s => (
                                  <button key={s} className={`cert-btn ${st === s ? 'active' : ''}`} onClick={() => setCert(cert.id, s)}>
                                    {certStatusLabels[s]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkpoints */}
                  <div className="phase-section">
                    <h4 className="phase-section-title"><MI name="task_alt" /> {t('checkpoints')}</h4>
                    <ul className="checkpoint-list">
                      {phase.checkpoints.map((cp, i) => (
                        <li key={i} className="checkpoint-item">
                          <MI name="radio_button_unchecked" className="checkpoint-icon" /> {cp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gotchas */}
                  <div className="phase-section">
                    <h4 className="phase-section-title"><MI name="warning" /> {t('gotchas')}</h4>
                    {phase.gotchas.map((g, i) => (
                      <div key={i} className="gotcha-alert">{g}</div>
                    ))}
                  </div>

                  {/* Key Resources */}
                  <div className="phase-section">
                    <h4 className="phase-section-title"><MI name="menu_book" /> {t('key_resources')}</h4>
                    <div className="phase-resources-grid">
                      {phase.keyResources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noreferrer" className="phase-resource-link">
                          <MI name={RESOURCE_ICONS[r.type] || 'article'} className="phase-resource-icon" />
                          <div>
                            <div className="phase-resource-name">{r.name}</div>
                            <div className="phase-resource-desc">{r.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="phase-market-insight">
                    <MI name="insights" /> {phase.marketInsight}
                  </div>
                </div>
            </div>
          );
        })}
      </section>
    );
  };

  const Skills = () => (
    <section id="section-skills" className="section">
      <div className="section-header">
        <h2 className="section-title"><MI name="construction" /> {t('section_skills_title')}</h2>
        <p className="section-subtitle">{t('section_skills_sub')}</p>
      </div>
      {SKILLS_DATA.map((cat, i) => {
        const done = cat.skills.filter(s => skillStatus[s]).length;
        const pct = Math.round((done / cat.skills.length) * 100);
        const isOpen = openSkillCats.has(i);
        const phase = PHASES.find(p => p.id === cat.phaseId);

        return (
          <div key={i} className="skill-category">
            <div className="skill-category-header" onClick={() => toggleSkillCat(i)}>
              <div className="skill-cat-title">
                <MI name={cat.icon} /> {cat.category}
                {phase && <span className="skill-phase-tag" style={{ background: phase.color }}>Fase {phase.number}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="skill-cat-progress">{done}/{cat.skills.length} ({pct}%)</span>
                <MI name="expand_more" className={`skill-cat-chevron ${isOpen ? 'open' : ''}`} />
              </div>
            </div>
            {isOpen && (
              <div className="skill-list open">
                {cat.skills.map(s => {
                  const chk = skillStatus[s];
                  return (
                    <div key={s} className="skill-item" onClick={() => toggleSkill(s)}>
                      <div className={`skill-checkbox ${chk ? 'checked' : ''}`}>{chk && <MI name="check" />}</div>
                      <span className={`skill-label ${chk ? 'checked' : ''}`}>{s}</span>
                    </div>
                  );
                })}
                <div className="progress-bar" style={{ marginTop: '12px' }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );

  const Resources = () => (
    <section id="section-resources" className="section">
      <div className="section-header">
        <h2 className="section-title"><MI name="menu_book" /> {t('section_resources_title')}</h2>
        <p className="section-subtitle">{t('section_resources_sub')}</p>
      </div>
      {RESOURCES_BY_PHASE.map((group, idx) => (
        <div key={idx} className="phase-group">
          <h3 className="phase-header"><MI name={group.icon} /> {group.phase}</h3>
          <div className="card-grid">
            {group.items.map((r, ri) => (
              <div key={ri} className="card resource-card">
                <div className={`resource-type ${r.type}`}>
                  <MI name={RESOURCE_ICONS[r.type] || 'article'} />
                  {r.type.toUpperCase()} {r.lang && `· ${r.lang}`}
                </div>
                <div className="resource-name">{r.name}</div>
                <div className="resource-desc">{r.desc}</div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                    {lang === 'pt' ? 'Acessar' : 'Visit'} <MI name="arrow_forward" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );

  const Market = () => (
    <section id="section-market" className="section">
      <div className="section-header">
        <h2 className="section-title"><MI name="trending_up" /> {t('section_market_title')}</h2>
        <p className="section-subtitle">{t('section_market_sub')}</p>
      </div>

      {/* Market Insights */}
      <div className="market-insights-row">
        {MARKET_INSIGHTS.map((ins, i) => (
          <div key={i} className={`market-insight-card insight-${ins.type}`}>
            <div className="market-insight-header">
              <MI name={ins.icon} /> {ins.title}
            </div>
            <div className="market-insight-desc">{ins.desc}</div>
          </div>
        ))}
      </div>

      {/* Market Decisions */}
      <div className="decisions-section">
        <h3 className="decisions-title"><MI name="lightbulb" /> {t('decisions_title')}</h3>
        <div className="decisions-grid">
          {MARKET_DECISIONS.map((d, i) => (
            <div key={i} className="market-decision-card" style={{ borderTop: `3px solid ${d.color}` }}>
              <div className="decision-header">
                <MI name={d.icon} style={{ color: d.color }} />
                <div>
                  <div className="decision-title">{d.title}</div>
                  <div className="decision-impact" style={{ color: d.color }}>{d.impact}</div>
                </div>
              </div>
              <div className="decision-desc">{d.desc}</div>
              <div className="decision-action">
                <MI name="arrow_forward" /> {d.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Settings = () => {
    const exportData = () => {
      const data = { certs: certStatus, skills: skillStatus, lang };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'bussola-progress.json'; a.click();
      showToast('Progresso exportado!');
    };

    const importData = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.certs) setCertStatus(data.certs);
          if (data.skills) setSkillStatus(data.skills);
          if (data.lang) setLang(data.lang);
          showToast('Progresso importado!');
        } catch { showToast('Erro ao importar arquivo'); }
      };
      reader.readAsText(file);
    };

    const resetData = () => {
      if (!window.confirm(t('reset_confirm'))) return;
      localStorage.removeItem('bussola_certs');
      localStorage.removeItem('bussola_skills');
      setCertStatus({}); setSkillStatus({});
      showToast('Progresso resetado');
    };

    return (
      <section id="section-settings" className="section">
        <div className="section-header">
          <h2 className="section-title"><MI name="settings" /> {t('section_settings_title')}</h2>
          <p className="section-subtitle">{t('section_settings_sub')}</p>
        </div>
        <div className="card-grid">
          <div className="settings-group card">
            <h3><MI name="download" /> {t('export_data')}</h3>
            <p>Salve seu progresso em um arquivo JSON.</p>
            <button className="settings-btn" onClick={exportData}>{t('export_data')}</button>
          </div>
          <div className="settings-group card">
            <h3><MI name="upload" /> {t('import_data')}</h3>
            <p>Restaure progresso a partir de um arquivo JSON.</p>
            <input type="file" id="import-file" accept=".json" style={{ display: 'none' }} onChange={importData} />
            <button className="settings-btn" onClick={() => document.getElementById('import-file').click()}>{t('import_data')}</button>
          </div>
          <div className="settings-group card">
            <h3><MI name="delete" /> {t('reset_data')}</h3>
            <p>{t('reset_confirm')}</p>
            <button className="settings-btn danger" onClick={resetData}>{t('reset_data')}</button>
          </div>
        </div>
      </section>
    );
  };

  if (auth.loading) return <div className="login-overlay"><div className="login-spinner"><MI name="explore" className="blue-text" /></div></div>;
  if (!auth.user)   return LoginScreen();

  return (
    <div className="app-container">
      {Sidebar()}
      {MobileHeader()}
      <main className="main-content">
        {Dashboard()}
        {Trilha()}
        {Skills()}
        {Resources()}
        {Market()}
        {Settings()}
      </main>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
