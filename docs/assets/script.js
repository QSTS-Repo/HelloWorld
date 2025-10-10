async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}

function createMemberCard(m){
  const el = document.createElement('div'); el.className='member';
  const img = document.createElement('img'); img.src = m.photo || 'assets/person-placeholder.svg'; img.alt = m.name;
  const info = document.createElement('div');
  const name = document.createElement('div'); name.textContent = m.name; name.style.fontWeight='600';
  const links = document.createElement('div'); links.style.fontSize='13px';
  if(m.cris) links.innerHTML += `<a href="${m.cris}" target="_blank" rel="noopener">CRIS</a> `;
  if(m.linkedin) links.innerHTML += ` <a href="${m.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;
  info.appendChild(name); info.appendChild(links);
  el.appendChild(img); el.appendChild(info);
  return el;
}

function createToolCard(t){
  const el = document.createElement('article'); el.className='card';
  const thumb = document.createElement('div'); thumb.className='thumb';
  const img = document.createElement('img'); img.src = t.image || 'assets/tool-placeholder.svg'; img.alt = t.name; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover';
  thumb.appendChild(img);
  const title = document.createElement('h3'); title.textContent = t.name;
  const p = document.createElement('p'); p.textContent = t.shortDescription || '';
  const actions = document.createElement('div'); actions.className='actions';
  const learn = document.createElement('a'); learn.className='btn'; learn.textContent='Learn more';
  const slug = t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  learn.href = `contact.html?tool=${encodeURIComponent(slug)}`;
  actions.appendChild(learn);
  el.appendChild(thumb); el.appendChild(title); el.appendChild(p); el.appendChild(actions);
  return el;
}

async function renderIndex(){
  const data = await loadJSON('data/team.json');
  document.getElementById('team-name').textContent = data.teamName;
  document.getElementById('team-tagline').textContent = data.tagline || '';
  document.getElementById('team-description').textContent = data.description || '';
  document.getElementById('team-year').textContent = new Date().getFullYear();

  const membersEl = document.getElementById('members'); membersEl.innerHTML='';
  (data.members||[]).forEach(m=>membersEl.appendChild(createMemberCard(m)));

  const toolsGrid = document.getElementById('tools-grid'); toolsGrid.innerHTML='';
  (data.tools||[]).forEach(t=>toolsGrid.appendChild(createToolCard(t)));
}

function getQueryParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

async function renderContact(){
  const slug = getQueryParam('tool');
  const data = await loadJSON('data/team.json');
  document.getElementById('team-year-2').textContent = new Date().getFullYear();
  const tool = (data.tools||[]).find(t=>t.slug===slug) || (data.tools||[]).find(t=>t.name.toLowerCase().includes(slug||'')) || null;
  if(!tool){
    document.getElementById('tool-title').textContent = 'Tool not found';
    document.getElementById('tool-desc').textContent = 'No tool matches the requested identifier.';
    return;
  }
  document.getElementById('tool-title').textContent = tool.name;
  document.getElementById('tool-desc').textContent = tool.description || tool.shortDescription || '';
  document.getElementById('tool-image').src = tool.image || 'assets/tool-placeholder.svg';
  const mail = tool.contactEmail || data.contactEmail || 'mailto:info@example.com';
  const mailEl = document.getElementById('contact-mail'); mailEl.href = 'mailto:'+mail; mailEl.textContent = mail;

  const links = document.getElementById('tool-links'); links.innerHTML='';
  if(tool.github){
    const a = document.createElement('a'); a.className='btn secondary'; a.href=tool.github; a.target='_blank'; a.rel='noopener'; a.textContent='GitHub repo';
    links.appendChild(a);
  }
  if(tool.moreInfo){
    const a = document.createElement('a'); a.className='btn'; a.href=tool.moreInfo; a.target='_blank'; a.rel='noopener'; a.textContent='More info';
    links.appendChild(a);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')||location.pathname.endsWith('docs/') ){
    renderIndex().catch(e=>console.error(e));
  } else if(location.pathname.endsWith('contact.html')){
    renderContact().catch(e=>console.error(e));
  }
});
