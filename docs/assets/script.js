async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}

function createMemberCard(m){
  const el = document.createElement('div');
  el.className = 'member';
  
  const img = document.createElement('img');
  img.src = m.photo || 'assets/person-placeholder.svg';
  img.alt = m.name;
  img.loading = 'lazy';
  
  const info = document.createElement('div');
  info.className = 'info';
  
  const name = document.createElement('h3');
  name.textContent = m.name;
  
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = m.title || '';
  
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';
    
    if(m.cris) {
      const crisLink = document.createElement('a');
      crisLink.href = m.cris;
      crisLink.className = 'social-link cris';
      crisLink.target = '_blank';
      crisLink.rel = 'noopener';
      crisLink.title = 'CRIS Profile';
      crisLink.innerHTML = '<i class="fas fa-user-circle"></i>';
      socialLinks.appendChild(crisLink);
    }
    
    if(m.linkedin) {
      const linkedinLink = document.createElement('a');
      linkedinLink.href = m.linkedin;
      linkedinLink.className = 'social-link linkedin';
      linkedinLink.target = '_blank';
      linkedinLink.rel = 'noopener';
      linkedinLink.title = 'LinkedIn Profile';
      linkedinLink.innerHTML = '<i class="fab fa-linkedin-in"></i>';
      socialLinks.appendChild(linkedinLink);
    }
    
    if(m.orcid) {
      const orcidLink = document.createElement('a');
      orcidLink.href = 'https://orcid.org/' + m.orcid;
      orcidLink.className = 'social-link orcid';
      orcidLink.target = '_blank';
      orcidLink.rel = 'noopener';
      orcidLink.title = 'ORCID Profile';
      orcidLink.innerHTML = '<i class="fab fa-orcid"></i>';
      socialLinks.appendChild(orcidLink);
    }

  info.appendChild(name);
  info.appendChild(title);
  info.appendChild(socialLinks);
  
  el.appendChild(img);
  el.appendChild(info);
  
  return el;
}

function createToolCard(t){
  const container = document.createElement('div');
  container.className = 'card-container';
  
  const card = document.createElement('article');
  card.className = 'card';
  
  // Create front of card
  const front = document.createElement('div');
  front.className = 'card-front';
  
  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  const img = document.createElement('img');
  img.src = t.image || 'assets/tool-placeholder.svg';
  img.alt = t.name;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  thumb.appendChild(img);
  
  const title = document.createElement('h3');
  title.textContent = t.name;
  
  const shortDesc = document.createElement('p');
  shortDesc.textContent = t.shortDescription || '';
  
  front.appendChild(thumb);
  front.appendChild(title);
  front.appendChild(shortDesc);
  
  // Create back of card
  const back = document.createElement('div');
  back.className = 'card-back';
  
  const backTitle = document.createElement('h3');
  backTitle.textContent = t.name;
  
  const description = document.createElement('div');
  description.className = 'description';
  description.textContent = t.description || '';
  
  const actions = document.createElement('div');
  actions.className = 'actions';
  const learn = document.createElement('a');
  learn.className = 'btn';
  learn.textContent = 'Learn more';
  const slug = t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  learn.href = t.learnMoreUrl || `contact.html?tool=${encodeURIComponent(slug)}`;
  actions.appendChild(learn);
  
  back.appendChild(backTitle);
  back.appendChild(description);
  back.appendChild(actions);
  
  // Add hover handlers for flip
  container.addEventListener('mouseenter', () => {
    card.classList.add('flipped');
  });
  
  container.addEventListener('mouseleave', () => {
    card.classList.remove('flipped');
  });
  
  card.appendChild(front);
  card.appendChild(back);
  container.appendChild(card);
  
  return container;
}

async function renderIndex(){
  try {
    console.log('Starting to load data...');
    const [teamData, toolsData] = await Promise.all([
      loadJSON('data/team.json'),
      loadJSON('data/tools.json')
    ]);
    console.log('Data loaded:', { teamData, toolsData });
    
    const teamNameEl = document.getElementById('team-name');
    if (teamNameEl) teamNameEl.textContent = teamData.teamName;
    
    const teamDescEl = document.getElementById('team-description');
    if (teamDescEl) teamDescEl.textContent = teamData.description || '';
    
    const yearEl = document.getElementById('team-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const membersEl = document.getElementById('members');
    if (membersEl) {
      console.log('Found members element, rendering', teamData.members?.length, 'members');
      membersEl.innerHTML = '';
      (teamData.members || []).forEach(m => membersEl.appendChild(createMemberCard(m)));
    } else {
      console.error('Members element not found');
    }

    const toolsGrid = document.getElementById('tools-grid');
    if (toolsGrid) {
      console.log('Found tools grid, rendering', toolsData?.length, 'tools');
      toolsGrid.innerHTML = '';
      toolsData.forEach(t => toolsGrid.appendChild(createToolCard(t)));
    } else {
      console.error('Tools grid element not found');
    }
  } catch (error) {
    console.error('Error rendering index:', error);
  }
}

function getQueryParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}



document.addEventListener('DOMContentLoaded',()=>{
  // Prevent default hash scroll on page load
  let initialHash = location.hash;
  if (initialHash) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')||location.pathname.endsWith('docs/') ){
    renderIndex().then(() => {
      // If there was a hash in the URL, scroll to it after content is loaded
      if (initialHash) {
        requestAnimationFrame(() => {
          const element = document.querySelector(initialHash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }).catch(e=>console.error(e));
  } else if(location.pathname.endsWith('contact.html')){
    document.getElementById('team-year').textContent = new Date().getFullYear();
    
    // Handle contact form submission
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const senderEmail = document.getElementById('senderEmail').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link with form data
        const mailtoLink = `mailto:qsts@vtt.fi?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + senderEmail + '\n\n' + message)}`;
        window.location.href = mailtoLink;
      });
    }
  }
});
