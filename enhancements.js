(() => {
  const VERSION = '0.2'
  const AS_OF = '2026-09-17'
  const actionOrder = ['Planned','In progress','Monitoring','Completed']

  const actions = [
    { id:'A-001', sourceRisk:'R-014', sourceDecision:'D-008', projectId:'samutsongkhram', title:'Field verification — 51-STC', owner:'Field Manager', dueDate:'2026-09-22', priority:'Critical', baseStatus:'In progress', progress:35, evidence:'Field record + cause assessment', followUp:'Reassess residual risk after field confirmation' },
    { id:'A-002', sourceRisk:'R-017', sourceDecision:'D-011', projectId:'samutsongkhram', title:'Close MRV evidence gaps', owner:'MRV Lead', dueDate:'2026-09-20', priority:'High', baseStatus:'In progress', progress:55, evidence:'Evidence checklist + reviewer sign-off', followUp:'Freeze verification package candidate' },
    { id:'A-003', sourceRisk:'R-021', sourceDecision:'D-014', projectId:'andaman', title:'Recheck 81-STC field condition', owner:'Ecology Analyst', dueDate:'2026-09-25', priority:'High', baseStatus:'Planned', progress:10, evidence:'Field condition + water level + substrate', followUp:'Decide monitor vs remediation' },
    { id:'A-004', sourceRisk:'R-031', sourceDecision:null, projectId:'rayong', title:'Apply tide-aware scene screening', owner:'Remote Sensing Lead', dueDate:'2026-09-18', priority:'Medium', baseStatus:'Monitoring', progress:80, evidence:'Scene list + tide metadata', followUp:'Confirm false-signal rate decreases' },
    { id:'A-005', sourceRisk:'R-034', sourceDecision:'D-019', projectId:'maeklong', title:'Prioritise stale monitoring plots', owner:'Operations Lead', dueDate:'2026-09-24', priority:'Medium', baseStatus:'Planned', progress:15, evidence:'Updated field schedule', followUp:'Review progress after next field round' },
  ]

  const riskDetails = {
    'R-014': { cause:'ยังไม่ยืนยัน — candidate: site condition / exposure', consequence:'อาจกระทบ establishment performance และ carbon forecast หากเกิดเป็นวงกว้าง', residual:'High', sourceType:'Observed + derived', evidence:['Growth check: weak','Field condition: abnormal candidate','Drone asset: available'] },
    'R-017': { cause:'Monitoring / review evidence บางส่วนยังไม่ complete', consequence:'อาจเลื่อน readiness gate และเพิ่ม rework ก่อน verification', residual:'High', sourceType:'Rule-based', evidence:['Evidence: partial','Review: pending','Monitoring coverage: 71%'] },
    'R-021': { cause:'ยังไม่ยืนยัน', consequence:'อาจต้องปรับ treatment / monitoring frequency ของแปลง', residual:'Medium', sourceType:'Observed + comparative', evidence:['Growth: weak','Field: mixed','Satellite: no critical alert'] },
    'R-025': { cause:'coastal dynamics / imagery variation candidate', consequence:'หากยืนยัน อาจเพิ่ม physical exposure ต่อพื้นที่ปลูก', residual:'Medium', sourceType:'Derived signal', evidence:['Satellite signal: watch','Field confirmation: not yet required','Growth performance: strong'] },
    'R-031': { cause:'tide-state mismatch ระหว่าง imagery dates', consequence:'อาจสร้าง false change signal ถ้าเทียบภาพต่างสภาวะน้ำ', residual:'Low', sourceType:'Data-quality rule', evidence:['Tide metadata: available','Scene screening: in use','Follow-up: continue'] },
    'R-034': { cause:'field / review throughput ต่ำกว่าแผน', consequence:'ข้อมูลบางแปลงอาจ stale และกระทบรอบสรุประดับโครงการ', residual:'Medium', sourceType:'Rule-based', evidence:['Monitoring: 69%','Data freshness: mixed','Critical ecological risks: none in demo'] },
  }

  const sourceStatus = [
    ['Plot / project master','Partial','Known plot concepts are represented; canonical project grouping is still assumed.'],
    ['Drone / mosaic / heatmap','Conceptual','MVP shows the integration point; no live API is connected.'],
    ['Field monitoring','Conceptual','Known field/growth context is used as illustrative evidence.'],
    ['Satellite / tide','Conceptual','Known monitoring context is represented; no live scene ingestion.'],
    ['MRV / verification','Assumed','Readiness model is a management prototype, not an official verification result.'],
    ['Carbon target / forecast','Assumed','All carbon numbers are placeholders until methodology-backed calculations are connected.'],
  ]

  const projectById = id => projects.find(p => p.id === id)
  const riskById = id => risks.find(r => r.id === id)
  const dateFmt = iso => new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(new Date(`${iso}T00:00:00+07:00`))
  const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

  state.actionStatus = 'All'
  state.actionStatusMap = load('risk-dashboard:action-status', {})
  const savedReviewed = load('risk-dashboard:reviewed-decisions', [])
  savedReviewed.forEach(id => state.reviewed.add(id))

  if (!navItems.some(([key]) => key === 'actions')) navItems.push(['actions','05','Action Center'])
  if (!navItems.some(([key]) => key === 'brief')) navItems.push(['brief','06','Executive Brief'])

  const baseBind = bind

  const actionStatusFor = a => state.actionStatusMap[a.id] || a.baseStatus
  const persist = () => {
    localStorage.setItem('risk-dashboard:action-status', JSON.stringify(state.actionStatusMap))
    localStorage.setItem('risk-dashboard:reviewed-decisions', JSON.stringify([...state.reviewed]))
  }

  function assumptionBanner() {
    return `<div class="demo-banner"><strong>MVP / ASSUMED DATA</strong><span>ใช้เพื่อทดสอบ executive workflow เท่านั้น — carbon target/forecast, project grouping, milestone และ risk บางรายการเป็นข้อมูลสมมติ ห้ามใช้เป็น carbon accounting, verification result หรือ impact claim</span></div>`
  }

  function portfolioStats() {
    const totalArea = projects.reduce((s,p)=>s+p.areaRai,0)
    const totalTarget = projects.reduce((s,p)=>s+p.carbonTarget,0)
    const totalForecast = projects.reduce((s,p)=>s+p.carbonForecast,0)
    const avgMonitoring = Math.round(projects.reduce((s,p)=>s+p.monitoring,0)/projects.length)
    const avgMrv = Math.round(projects.reduce((s,p)=>s+p.mrv,0)/projects.length)
    const highRisk = risks.filter(r=>severityRank[r.severity]>=3).length
    const openActions = actions.filter(a=>actionStatusFor(a)!=='Completed').length
    return {totalArea,totalTarget,totalForecast,avgMonitoring,avgMrv,highRisk,openActions}
  }

  shell = function(content) {
    const title = { overview:'Overview', projects:'Projects', risks:'Risk Center', decisions:'Decisions', actions:'Actions', mrv:'MRV Readiness', brief:'Executive Brief' }[state.nav] || 'Command Center'
    return `<div class="app-shell"><aside class="sidebar ${state.mobile ? 'open' : ''}"><div class="brand"><div class="brand-mark">FC</div><div><strong>Forest Carbon</strong><span>Command Center</span></div></div><nav>${navItems.map(([k,c,l]) => `<button data-nav="${k}" class="${state.nav===k?'active':''}"><span>${c}</span>${l}</button>`).join('')}</nav><div class="sidebar-note"><small>PROTOTYPE</small><strong>Executive MVP v${VERSION}</strong><span>Local state · demo data</span></div></aside><div class="content-shell"><header class="topbar"><button id="menu" class="menu-button">☰</button><div><span>Forest carbon portfolio</span><strong>${title}</strong></div><div class="top-actions"><span class="live-dot"></span>Prototype<div class="avatar">EX</div></div></header><main>${content}</main></div></div>`
  }

  function actionCenter() {
    const statuses = ['All',...actionOrder]
    const filtered = actions.filter(a => state.actionStatus==='All' || actionStatusFor(a)===state.actionStatus)
    const completed = actions.filter(a=>actionStatusFor(a)==='Completed').length
    const avgProgress = Math.round(actions.reduce((n,a)=>n+(actionStatusFor(a)==='Completed'?100:a.progress),0)/actions.length)
    return `<div class="page-heading"><div><div class="eyebrow">ACTION CENTER</div><h1>Mitigation & follow-up</h1><p>ทุก action trace กลับไปยัง risk / decision และมี evidence ที่ต้องส่งมอบ</p></div></div>${assumptionBanner()}<div class="metric-grid four">${metricCard('Actions',actions.length,'tracked in MVP')}${metricCard('Completed',completed,`${actions.length-completed} open`,'good')}${metricCard('Average progress',`${avgProgress}%`,'demo progress','warning')}${metricCard('Critical actions',actions.filter(a=>a.priority==='Critical'&&actionStatusFor(a)!=='Completed').length,'requires attention','danger')}</div><div class="toolbar"><div class="segmented">${statuses.map(s=>`<button data-action-filter="${s}" class="${state.actionStatus===s?'active':''}">${s}</button>`).join('')}</div><button class="secondary small" data-export="actions">Export CSV</button></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Action</th><th>Source</th><th>Priority</th><th>Owner</th><th>Due</th><th>Status</th><th>Progress</th><th></th></tr></thead><tbody>${filtered.map(a=>{const status=actionStatusFor(a);return `<tr><td><strong>${a.id} · ${a.title}</strong><span class="cell-sub">Evidence: ${a.evidence}</span></td><td><button class="table-link" data-risk-detail="${a.sourceRisk}">${a.sourceRisk}</button>${a.sourceDecision?` · ${a.sourceDecision}`:''}</td><td><span class="${cls(a.priority)}">${a.priority}</span></td><td>${a.owner}</td><td>${dateFmt(a.dueDate)}</td><td>${status}</td><td><div class="mini-progress"><span style="width:${status==='Completed'?100:a.progress}%"></span></div><small>${status==='Completed'?100:a.progress}%</small></td><td><button class="secondary tiny" data-cycle-action="${a.id}">${status==='Completed'?'Reopen':'Advance'}</button></td></tr>`}).join('')}</tbody></table></div></section><section class="panel"><div class="panel-head"><div><h2>Closed-loop requirement</h2><p>งานไม่ถือว่าจบเพียงเพราะ task completed</p></div></div><div class="evidence-flow"><div><span>1</span><strong>Action complete</strong><p>evidence attached</p></div><b>→</b><div><span>2</span><strong>Follow-up monitor</strong><p>new observation</p></div><b>→</b><div><span>3</span><strong>Reassess risk</strong><p>likelihood / impact</p></div><b>→</b><div><span>4</span><strong>Residual risk</strong><p>close / continue / escalate</p></div></div></section>`
  }

  function executiveBriefText() {
    const s = portfolioStats()
    const critical = risks.filter(r=>r.severity==='Critical')
    const high = risks.filter(r=>r.severity==='High')
    const atRisk = projects.filter(p=>p.status==='At risk')
    return `Executive brief — ${AS_OF}\nPortfolio: ${projects.length} projects, ${fmt(s.totalArea)} rai.\nMonitoring average: ${s.avgMonitoring}%. MRV readiness average: ${s.avgMrv}%.\nAssumed carbon forecast: ${fmt(s.totalForecast)} / ${fmt(s.totalTarget)} tCO₂e (${Math.round(s.totalForecast/s.totalTarget*100)}% of target).\nOpen risk exposure: ${critical.length} Critical, ${high.length} High.\nPending decisions in this browser: ${decisions.length-state.reviewed.size}. Open actions: ${s.openActions}.\nAt-risk projects: ${atRisk.map(p=>p.shortName).join(', ') || 'none'}.\nTop management attention: ${critical.concat(high).slice(0,3).map(r=>`${r.id} ${r.scope} — ${r.title}`).join(' | ')}.\n\nImportant: carbon, target, milestone and several risk values are assumed/demo data and are not suitable for reporting, verification or carbon accounting.`
  }

  function briefView() {
    const s = portfolioStats()
    const priorityRisks = [...risks].sort((a,b)=>severityRank[b.severity]-severityRank[a.severity] || b.likelihood*b.impact-a.likelihood*a.impact).slice(0,5)
    return `<div class="page-heading"><div><div class="eyebrow">EXECUTIVE BRIEF</div><h1>Management briefing</h1><p>หน้าเดียวสำหรับประชุม: performance → risks → decisions → actions → data caveats</p></div><div class="brief-actions"><button class="secondary" id="copyBrief">Copy brief</button><button class="primary" id="printBrief">Print / PDF</button></div></div>${assumptionBanner()}<section class="panel brief-hero"><div><small>PORTFOLIO POSITION</small><h2>${projects.length} projects · ${fmt(s.totalArea)} rai</h2><p>Monitoring ${s.avgMonitoring}% · MRV ${s.avgMrv}% · assumed carbon forecast ${Math.round(s.totalForecast/s.totalTarget*100)}% of target</p></div><div class="brief-score"><strong>${s.highRisk}</strong><span>High / Critical risks</span></div></section><div class="two-col main-grid"><section class="panel"><div class="panel-head"><div><h2>Top management attention</h2><p>รายการที่ควรใช้เวลาใน meeting</p></div></div><div class="attention-list">${priorityRisks.map(r=>`<button class="attention-item" data-risk-detail="${r.id}"><span class="${cls(r.severity)}">${r.severity}</span><div><strong>${r.id} · ${r.title}</strong><span>${projectById(r.projectId).shortName} · owner ${r.owner} · due ${r.due}</span></div><span class="attention-arrow">›</span></button>`).join('')}</div></section><section class="panel"><div class="panel-head"><div><h2>Decision & action queue</h2><p>สิ่งที่ต้องเคลื่อนต่อ</p></div></div><div class="brief-queue"><div><strong>${decisions.length-state.reviewed.size}</strong><span>pending decisions</span><button data-nav="decisions">Open decisions</button></div><div><strong>${s.openActions}</strong><span>open actions</span><button data-nav="actions">Open actions</button></div><div><strong>${projects.filter(p=>p.mrv<75).length}</strong><span>projects MRV &lt;75%</span><button data-nav="mrv">Open MRV</button></div></div></section></div><section class="panel"><div class="panel-head"><div><h2>Data source status</h2><p>Known context เทียบกับ assumption ที่ยังต้องต่อระบบจริง</p></div></div><div class="source-grid">${sourceStatus.map(([name,status,note])=>`<div class="source-card"><span class="source-status ${status.toLowerCase()}">${status}</span><strong>${name}</strong><p>${note}</p></div>`).join('')}</div></section><section class="panel print-note"><div class="panel-head"><div><h2>Generated brief text</h2><p>ใช้เป็น draft meeting note เท่านั้น ต้องตรวจ assumption ก่อน</p></div></div><pre id="briefText">${executiveBriefText()}</pre></section>`
  }

  function riskDrawerHtml(r) {
    const detail = riskDetails[r.id] || {cause:'Not assessed',consequence:'Not assessed',residual:r.severity,sourceType:'Unknown',evidence:[]}
    const p = projectById(r.projectId)
    const linkedAction = actions.find(a=>a.sourceRisk===r.id)
    const linkedDecision = decisions.find(d=>d.projectId===r.projectId && d.title.includes(r.scope)) || decisions.find(d=>d.projectId===r.projectId)
    return `<div class="drawer-backdrop" data-close-risk></div><aside class="risk-drawer" role="dialog" aria-modal="true"><button class="drawer-close" data-close-risk>×</button><div class="eyebrow">${r.id} · ${r.category}</div><h2>${r.title}</h2><div class="drawer-badges"><span class="${cls(r.severity)}">${r.severity}</span><span>Confidence ${r.confidence}</span><span>${r.status}</span></div><div class="drawer-section"><small>PROJECT / SCOPE</small><strong>${p.name}</strong><p>${r.scope}</p></div><div class="drawer-grid"><div><small>Likelihood</small><strong>${r.likelihood}/5</strong></div><div><small>Impact</small><strong>${r.impact}/5</strong></div><div><small>Residual</small><strong>${detail.residual}</strong></div><div><small>Due</small><strong>${r.due}</strong></div></div><div class="drawer-section"><small>SOURCE & CONFIDENCE</small><strong>${r.source}</strong><p>${detail.sourceType} · confidence ${r.confidence}</p></div><div class="drawer-section"><small>CAUSE</small><p>${detail.cause}</p></div><div class="drawer-section"><small>CONSEQUENCE</small><p>${detail.consequence}</p></div><div class="drawer-section"><small>TREATMENT</small><p>${r.action}</p></div><div class="drawer-section"><small>EVIDENCE</small><div class="evidence-chips">${detail.evidence.map(e=>`<span>${e}</span>`).join('')}</div></div><div class="drawer-section"><small>TRACEABILITY</small><strong>${r.owner}</strong>${linkedDecision?`<p>Decision: ${linkedDecision.id}${state.reviewed.has(linkedDecision.id)?' · reviewed':''}</p>`:''}${linkedAction?`<p>Action: ${linkedAction.id} · ${actionStatusFor(linkedAction)}</p>`:''}</div><div class="drawer-actions"><button class="secondary" data-open-project="${r.projectId}">Open project</button>${linkedAction?'<button class="primary" data-open-actions>Open action center</button>':''}</div></aside>`
  }

  function openRisk(id) {
    closeRisk()
    const r = riskById(id)
    if (!r) return
    const host = document.createElement('div')
    host.id = 'riskDrawerHost'
    host.innerHTML = riskDrawerHtml(r)
    document.body.appendChild(host)
  }

  function closeRisk() {
    document.getElementById('riskDrawerHost')?.remove()
  }

  function csvEscape(v) {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replaceAll('"','""')}"` : s
  }

  function downloadCSV(type) {
    const rows = type==='actions'
      ? [['Action ID','Project','Risk','Decision','Title','Priority','Owner','Due','Status','Progress','Evidence'],...actions.map(a=>[a.id,projectById(a.projectId).name,a.sourceRisk,a.sourceDecision||'',a.title,a.priority,a.owner,a.dueDate,actionStatusFor(a),actionStatusFor(a)==='Completed'?100:a.progress,a.evidence])]
      : [['Risk ID','Project','Scope','Title','Category','Severity','Confidence','Likelihood','Impact','Owner','Due','Status','Source','Treatment'],...risks.map(r=>[r.id,projectById(r.projectId).name,r.scope,r.title,r.category,r.severity,r.confidence,r.likelihood,r.impact,r.owner,r.due,r.status,r.source,r.action])]
    const blob = new Blob([rows.map(row=>row.map(csvEscape).join(',')).join('\n')],{type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `forest-carbon-${type}-${AS_OF}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function toast(message) {
    document.querySelector('.toast')?.remove()
    const el = document.createElement('div')
    el.className = 'toast'
    el.textContent = message
    document.body.appendChild(el)
    requestAnimationFrame(()=>el.classList.add('show'))
    setTimeout(()=>el.remove(),2200)
  }

  function decorateRisks() {
    if (state.nav === 'risks') {
      const filtered = risks.filter(r=>(state.severity==='All'||r.severity===state.severity)&&(state.category==='All'||r.category===state.category))
      document.querySelectorAll('.risk-table tbody tr').forEach((row,i)=>{ if(filtered[i]) row.dataset.riskDetail = filtered[i].id })
      const toolbar = document.querySelector('.toolbar')
      if (toolbar && !toolbar.querySelector('[data-export]')) toolbar.insertAdjacentHTML('beforeend','<button class="secondary small" data-export="risks">Export CSV</button>')
    }
    if (state.nav === 'projects') {
      const projectRisks = risks.filter(r=>r.projectId===state.project)
      document.querySelectorAll('.compact-risk').forEach((row,i)=>{ if(projectRisks[i]) row.dataset.riskDetail = projectRisks[i].id })
    }
    if (state.nav === 'overview') {
      const topRisks = [...risks].sort((a,b)=>severityRank[b.severity]-severityRank[a.severity]).slice(0,4)
      document.querySelectorAll('.attention-item').forEach((row,i)=>{ if(topRisks[i]) row.dataset.riskDetail = topRisks[i].id })
    }
  }

  bind = function() {
    baseBind()
    document.querySelectorAll('[data-action-filter]').forEach(el=>el.addEventListener('click',()=>{ state.actionStatus=el.dataset.actionFilter; render() }))
    document.querySelectorAll('[data-cycle-action]').forEach(el=>el.addEventListener('click',()=>{
      const a = actions.find(x=>x.id===el.dataset.cycleAction)
      const current = actionStatusFor(a)
      const idx = actionOrder.indexOf(current)
      state.actionStatusMap[a.id] = current==='Completed' ? 'In progress' : actionOrder[Math.min(idx+1,actionOrder.length-1)]
      persist(); toast(`Action ${a.id}: ${state.actionStatusMap[a.id]}`); render()
    }))
    document.querySelectorAll('[data-export]').forEach(el=>el.addEventListener('click',()=>downloadCSV(el.dataset.export)))
    document.querySelectorAll('[data-review]').forEach(el=>el.addEventListener('click',()=>setTimeout(persist,0)))
    document.getElementById('printBrief')?.addEventListener('click',()=>window.print())
    document.getElementById('copyBrief')?.addEventListener('click',async()=>{
      try { await navigator.clipboard.writeText(executiveBriefText()); toast('Brief copied') }
      catch { toast('Clipboard unavailable — select the brief text manually') }
    })
  }

  render = function() {
    const views = { overview, projects:projectsView, risks:riskCenter, decisions:decisionCenter, actions:actionCenter, mrv:mrvView, brief:briefView }
    document.getElementById('app').innerHTML = shell(views[state.nav]())
    bind()
    decorateRisks()
  }

  document.addEventListener('click', event => {
    const riskTarget = event.target.closest('[data-risk-detail]')
    if (riskTarget) {
      event.preventDefault(); event.stopImmediatePropagation(); openRisk(riskTarget.dataset.riskDetail); return
    }
    if (event.target.closest('[data-close-risk]')) { event.preventDefault(); closeRisk(); return }
    const projectTarget = event.target.closest('[data-open-project]')
    if (projectTarget) { closeRisk(); state.project=projectTarget.dataset.openProject; state.nav='projects'; render(); return }
    if (event.target.closest('[data-open-actions]')) { closeRisk(); state.nav='actions'; render(); return }
  }, true)

  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeRisk() })

  render()
})()
