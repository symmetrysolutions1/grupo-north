const defaultVisits = [
  {store:'Supermercado La 14',city:'Cali',brand:'North',price:'$13.900',status:'complete',date:'Hoy'},
  {store:'Éxito San Fernando',city:'Cali',brand:'Marca A',price:'$11.200',status:'review',date:'Ayer'},
  {store:'Carulla Santa Bárbara',city:'Bogotá',brand:'Marca B',price:'$14.600',status:'complete',date:'06 oct'},
  {store:'Mercamío Centro',city:'Pereira',brand:'North',price:'$13.500',status:'complete',date:'05 oct'},
];
const evidence = [
  {name:'gondola_north_001.jpg', store:'Supermercado La 14 · Cali', meta:'Hoy · Alex R.', type:'FOTO', tone:''},
  {name:'precio_marca_a.png', store:'Éxito San Fernando · Cali', meta:'Ayer · Camila M.', type:'FOTO', tone:'pink'},
  {name:'formulario_visita_018.pdf', store:'Carulla Santa Bárbara · Bogotá', meta:'06 oct · Alex R.', type:'FORMULARIO', tone:'yellow'},
  {name:'exhibicion_north.jpg', store:'Mercamío Centro · Pereira', meta:'05 oct · Jorge P.', type:'FOTO', tone:'green'},
  {name:'catalogo_competencia.xlsx', store:'Estudio categoría · Nacional', meta:'04 oct · Admin', type:'EXCEL', tone:'pink'},
  {name:'posicionamiento_marca_b.pdf', store:'Análisis de anaquel · Bogotá', meta:'02 oct · Camila M.', type:'PDF', tone:'yellow'},
];
const storedVisits = JSON.parse(localStorage.getItem('northVisits') || 'null');
const cleanedVisits = Array.isArray(storedVisits) ? storedVisits.map((visit) => /bsdbdsb|asdf|test|sdd/i.test(`${visit.store || ''} ${visit.brand || ''}`) ? {...visit, store:'Éxito San Fernando', city:'Cali', brand:'Marca A', price:'$11.200', status:'complete', date:'Hoy'} : visit) : defaultVisits;
const state = {visits: cleanedVisits};
if (Array.isArray(storedVisits)) localStorage.setItem('northVisits', JSON.stringify(cleanedVisits));
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderVisits(){
  const rows = state.visits.slice(0,4).map((visit) => `<tr><td>${escapeHtml(visit.store)}<small class="muted">${escapeHtml(visit.date || 'Hoy')}</small></td><td class="city-cell">${escapeHtml(visit.city)}</td><td><span class="brand-label"><i class="${visit.brand === 'North' ? '' : visit.brand === 'Marca B' ? 'green' : 'gray'}"></i>${escapeHtml(visit.brand)}</span></td><td><strong>${escapeHtml(visit.price || 'Sin precio')}</strong></td><td><span class="status-chip ${visit.status === 'review' ? 'review' : 'complete'}">${visit.status === 'review' ? 'En revisión' : 'Completa'}</span></td></tr>`).join('');
  $('#recentVisits').innerHTML = rows;
  $('#visitMetric').textContent = 24 + state.visits.length - defaultVisits.length;
  $('#storeMetric').textContent = 18 + Math.max(0, state.visits.length - defaultVisits.length);
  $('#evidenceMetric').textContent = 86 + Math.max(0, state.visits.length - defaultVisits.length);
}
function renderEvidence(filter=''){
  const items = evidence.filter(item => `${item.name} ${item.store} ${item.type}`.toLowerCase().includes(filter.toLowerCase()));
  $('#evidenceGrid').innerHTML = items.map((item,index) => `<article class="evidence-card"><div class="evidence-visual ${item.tone}">${item.type === 'FOTO' ? '▧' : item.type === 'EXCEL' ? '▤' : '▥'}<span>${item.type === 'FOTO' ? 'Vista previa' : item.type}</span></div><div class="evidence-info"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.store)}</small><div><small>${escapeHtml(item.meta)}</small><span class="evidence-type">${item.type}</span></div></div></article>`).join('');
}
function escapeHtml(value=''){return value.replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function showView(name){
  document.body.classList.toggle('home-mode', name === 'home');
  document.body.classList.toggle('red-app-mode', name === 'visits');
  $$('.page-view').forEach(view => view.classList.toggle('active', view.id === `${name}View`));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name === 'evidence') renderEvidence();
}
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('show');window.clearTimeout(window.__toastTimer);window.__toastTimer=window.setTimeout(()=>node.classList.remove('show'),3200)}
function setToday(){const input=document.querySelector('input[name="date"]');if(input && !input.value){const now=new Date();input.value=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10)}}
function setVisitStep(step){const form=$('#visitForm');if(!form)return;form.dataset.step=String(step);window.scrollTo({top:0,behavior:'smooth'});}
function validateVisitStep(step){const section=document.querySelector(`#visitForm .form-section[data-step="${step}"]`);if(!section)return true;const invalid=[...section.querySelectorAll('[required]')].find(field=>!field.checkValidity());if(invalid){invalid.reportValidity();return false;}return true;}

$$('.nav-item').forEach(button => button.addEventListener('click',()=>showView(button.dataset.view)));
$$('.home-link').forEach(link => { link.addEventListener('click',()=>showView('home')); link.addEventListener('keydown',(event)=>{if(event.key==='Enter' || event.key===' '){event.preventDefault();showView('home');}}); });
$$('[data-step-target]').forEach(button => button.addEventListener('click',()=>{const form=$('#visitForm');const current=Number(form.dataset.step||1);const target=Number(button.dataset.stepTarget);if(target>current && !validateVisitStep(current))return;setVisitStep(target);}));
$$('[data-view-link]').forEach(button => button.addEventListener('click',()=>showView(button.dataset.viewLink)));
$$('[data-action="new-visit"]').forEach(button => button.addEventListener('click',()=>{showView('visits');setVisitStep(1);setToday();}));
$$('[data-action="review-info"]').forEach(button => button.addEventListener('click',()=>showView('dashboard')));
$('#evidenceSearch').addEventListener('input',(event)=>renderEvidence(event.target.value));
document.querySelectorAll('#brandsView .compare-select').forEach((control,index)=>{const options=index===0?['North','Marca A','Marca B']:['Todas las marcas','Marca A','Marca B'];const label=control.querySelector('small');const current=control.querySelector('strong')?.textContent.trim() || options[0];const select=document.createElement('select');select.innerHTML=options.map(option=>`<option value="${option}">${option}</option>`).join('');select.value=options.includes(current)?current:options[0];control.replaceChildren(label,select);select.addEventListener('change',()=>toast(`Comparando con ${select.value}`));});
const exportMatrixButton=document.querySelector('#brandsView .outline-button');
if(exportMatrixButton)exportMatrixButton.addEventListener('click',()=>{const csv='Marca,Precio promedio,Calidad percibida,Posicionamiento dominante\nNorth,$13.900,4.5,Calidad / confianza\nMarca A,$11.200,3.7,Precio / ahorro\nMarca B,$14.600,4.1,Tradición\n';const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='north-panorama-competitivo.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Matriz exportada correctamente');});
$('#evidenceFile').addEventListener('change',(event)=>{const file=event.target.files[0];if(!file)return;const preview=$('#filePreview');preview.classList.remove('hidden');preview.innerHTML=`<strong>✓ ${escapeHtml(file.name)}</strong><br><span>${Math.round(file.size/1024)} KB · listo para asociar</span>`;toast('Evidencia lista para guardar con la visita');});
$('#visitForm').addEventListener('submit',(event)=>{event.preventDefault();const data=new FormData(event.currentTarget);const price = data.get('price') ? `$${Number(data.get('price')).toLocaleString('es-CO')}` : 'Sin precio';state.visits.unshift({store:data.get('store'),city:data.get('city'),brand:data.get('brand'),price,status:'complete',date:'Ahora'});localStorage.setItem('northVisits',JSON.stringify(state.visits));renderVisits();event.currentTarget.reset();$('#filePreview').classList.add('hidden');toast('Visita guardada. La evidencia quedó asociada al registro.');showView('dashboard');});
document.body.classList.add('home-mode');
renderVisits();renderEvidence();setToday();
