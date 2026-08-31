const KEY='dcitPortalDataV4';
const clone=o=>JSON.parse(JSON.stringify(o));
const defaults={
 credentials:{username:'admin',password:'admin123'},session:null,theme:'light',
 profile:{name:'Messias Quixindo',email:'eufrasio@dcit.ao',role:'Administrador',phone:''},
 tasks:[{id:1,title:'Editar vídeo do culto domingo',due:'30 Ago',priority:'Alta',owner:'MQ',done:false},{id:2,title:'Criar arte - Culto da Juventude',due:'31 Ago',priority:'Média',owner:'EQ',done:false}],
 events:[{id:1,date:'2026-08-30',time:'14:00 - 16:00',title:'Reunião Geral DCIT',place:'Sala de Reuniões',type:'Reunião'},{id:2,date:'2026-08-31',time:'16:00 - 18:00',title:'Preparação para culto',place:'Templo Central',type:'Trabalho'}],
 notices:[{id:1,title:'Escala do próximo domingo',text:'A escala para o próximo domingo já está disponível.',date:'Hoje, 09:30',kind:'Importante',unread:true}],
 projects:[{id:1,title:'Transmissão Online',progress:70,status:'Em andamento'},{id:2,title:'Novo Site DCIT',progress:20,status:'Em andamento'}],
 files:[],team:[{id:1,initials:'MQ',name:'Messias Quixindo',role:'Administrador',level:'Admin'}],messages:[]
};
let data=load();
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));
    return s?Object.assign(clone(defaults),s,{credentials:Object.assign(clone(defaults.credentials),s.credentials||{}),profile:Object.assign(clone(defaults.profile),s.profile||{})}):clone(defaults)}catch{return clone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function uid(){return Date.now()+Math.floor(Math.random()*999)}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
function isAdmin(){return data.session?.role==='Administrador'}
function go(id){const p=document.getElementById(id);if(!p)return;document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===id));document.getElementById('content').scrollTo({top:0,behavior:'smooth'});location.hash=id;document.getElementById('sidebar').classList.remove('open')}
function renderAll(){renderHeader();renderDashboard();renderTasks();renderEvents();renderNotices();renderProjects();renderFiles();renderTeam();renderChat();renderCalendar();syncProfile()}
function renderHeader(){const p=data.profile,initial=(p.name||'MQ').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();document.querySelectorAll('.user strong').forEach(x=>x.textContent=p.name);document.querySelectorAll('.user small').forEach(x=>x.textContent=p.role);document.querySelectorAll('.user>b,.top-right>b').forEach(x=>x.textContent=initial);const b=document.getElementById('bell');if(b)b.innerHTML=`♧<i>${data.notices.filter(n=>n.unread).length}</i>`}
function renderDashboard(){const s=document.querySelectorAll('.stats article strong');if(s.length>=4){s[0].textContent=String(data.tasks.filter(x=>!x.done).length).padStart(2,'0');s[1].textContent=String(data.events.filter(x=>x.date==='2026-08-30').length).padStart(2,'0');s[2].textContent=String(data.projects.length).padStart(2,'0');s[3].textContent=String(data.notices.filter(x=>x.unread).length).padStart(2,'0')}const h=document.querySelector('#inicio h1');if(h)h.textContent=`Olá, ${(data.profile.name||'utilizador').split(' ')[0]}! 👋`;const eb=document.getElementById('dashboardEvents'),nb=document.getElementById('dashboardNotices');if(eb)eb.innerHTML=data.events.slice(0,3).map(e=>`<div class="event"><b>${esc(e.date.slice(8))}<small>AGO</small></b><div><strong>${esc(e.title)}</strong><p>${esc(e.time)}
</p><small>📍 ${esc(e.place)}
</small>
</div>
<label>
${esc(e.type)}
</label>
</div>`).join('');if(nb)nb.innerHTML=data.notices.slice(0,3).map(n=>`<div class="notice"><b>!</b><div><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p><small>${esc(n.date)}</small></div>${n.unread?'<i></i>':''}</div>`).join('')}
function renderTasks(){const b=document.querySelector('#tarefas .tasks');if(!b)return;b.innerHTML=data.tasks.map(t=>`<label><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''}><span><strong>${esc(t.title)}</strong><small>Prazo: ${esc(t.due)} · Responsável: ${esc(t.owner)}</small></span><em class="${t.priority==='Alta'?'high':t.priority==='Baixa'?'low':'medium'}">${esc(t.priority)}</em><button class="delete" data-delete="task" data-id="${t.id}">×</button></label>`).join('')}
function renderEvents(){const b=document.querySelector('#agenda .timeline');if(b)b.innerHTML=data.events.map(e=>`<div><b>${esc(e.time)}</b><strong>${esc(e.title)}</strong><small>${esc(e.place)} · ${esc(e.date)}</small><button class="delete" data-delete="event" data-id="${e.id}">×</button></div>`).join('')}
function renderNotices(){const b=document.querySelector('#avisos .large');if(b)b.innerHTML=data.notices.map(n=>`<div class="list ${n.unread?'unread':''}"><b>!</b><div><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p><small>${esc(n.date)}</small></div><label>${esc(n.kind)}</label><button class="delete" data-delete="notice" data-id="${n.id}">×</button></div>`).join('')}
function renderProjects(){const b=document.querySelector('#projetos .projects');if(b)b.innerHTML=data.projects.map((p,i)=>`<div class="project"><div class="cover ${['one','two','three','four'][i%4]}"></div><strong>${esc(p.title)}</strong><small>${esc(p.status)} · ${p.progress}%</small><div class="bar"><i style="width:${Math.max(0,Math.min(100,p.progress))}%"></i></div><div class="project-actions"><button class="secondary" data-edit-project="${p.id}">Editar</button><button class="delete" data-delete="project" data-id="${p.id}">Eliminar</button></div></div>`).join('')}
function renderFiles(){const b=document.querySelector('#ficheiros .files');if(!b)return;b.innerHTML='<div class="filehead"><span>Nome</span><span>Categoria</span><span>Tamanho</span><span>Ação</span></div>'+data.files.map(f=>`<div><span>📄 ${esc(f.name)}</span><span>${esc(f.category)}</span><span>${esc(f.size)}</span><span><a href="${f.data||'#'}" download="${esc(f.name)}" class="secondary">Baixar</a> <button class="delete" data-delete="file" data-id="${f.id}">×</button></span></div>`).join('')}
function renderTeam(){const b=document.querySelector('#equipa .members');if(!b)return;b.innerHTML=data.team.map(m=>`<div><b>${esc(m.initials)}</b><span><strong>${esc(m.name)}</strong><small>${esc(m.role)}</small></span><em>${esc(m.level)}</em>${isAdmin()?`<button class="delete" data-delete="team" data-id="${m.id}">×</button>`:''}</div>`).join('')}
function renderChat(){const b=document.getElementById('chatMessages');if(!b)return;b.innerHTML=data.messages.map(m=>`<div class="chat-msg"><b>${esc(m.author)}</b><p>${esc(m.text)}</p><small>${esc(m.time)}</small></div>`).join('');b.scrollTop=b.scrollHeight}
function renderCalendar(){const b=document.getElementById('days');if(!b)return;b.innerHTML='';const first=new Date(2026,7,1).getDay();for(let i=0;i<first;i++)b.appendChild(document.createElement('button'));for(let d=1;d<=31;d++){const x=document.createElement('button');x.textContent=d;if(d===30)x.className='today';x.onclick=()=>toast(`${data.events.filter(e=>e.date===`2026-08-${String(d).padStart(2,'0')}`).length} evento(s) em ${d}/08/2026`);b.appendChild(x)}}
function syncProfile(){const map={profileName:data.profile.name,profileEmail:data.profile.email,profileRole:data.profile.role,profilePhone:data.profile.phone,adminUsername:data.credentials.username};Object.entries(map).forEach(([id,v])=>{const x=document.getElementById(id);if(x)x.value=v||''})}
function openModal(type,item=null){const modal=document.getElementById('modal'),title=document.getElementById('modalTitle'),input=document.getElementById('modalInput'),desc=document.getElementById('modalDesc');modal.dataset.type=type;modal.dataset.id=item?.id||'';title.textContent=item?`Editar ${type}`:type;input.value=item?.title||item?.name||'';desc.value=item?.text||item?.role||'';modal.classList.add('show');input.focus()}
function closeModal(){document.getElementById('modal').classList.remove('show')}
function saveModal(){const modal=document.getElementById('modal'),type=modal.dataset.type,id=Number(modal.dataset.id),t=document.getElementById('modalInput').value.trim(),d=document.getElementById('modalDesc').value.trim();
    if(!t){toast('Preencha o nome/título.');
    return}if(type==='Novo membro')data.team.push({id:uid(),initials:t.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(),name:t,role:d||'Membro',level:'Membro'});else if(type==='Nova tarefa')data.tasks.push({id:uid(),title:t,due:'A definir',priority:'Média',owner:'MQ',done:false});
else if(type==='Novo aviso')data.notices.unshift({id:uid(),title:t,text:d||'Novo aviso interno.',date:'Agora',kind:'Informativo',unread:true});
else if(type==='Novo evento')data.events.push({id:uid(),date:'2026-08-30',time:'A definir',title:t,place:d||'A definir',type:'Evento'});
else if(type==='Novo projeto')data.projects.push({id:uid(),title:t,progress:0,status:'Em andamento'});
else if(type==='Editar projeto'){const p=data.projects.find(x=>x.id===id);if(p){p.title=t;const n=prompt('Progresso (0-100):',p.progress);
    if(n!==null)p.progress=Math.max(0,Math.min(100,Number(n)||0));}}save();closeModal();
    toast('Guardado com sucesso.')}
function login(){const u=document.getElementById('loginUser').value.trim(),p=document.getElementById('loginPass').value;if(u===data.credentials.username&&p===data.credentials.password){data.session={username:u,role:'Administrador'};localStorage.setItem(KEY,JSON.stringify(data));document.getElementById('login').classList.remove('show');renderAll();toast('Sessão iniciada.')}else toast('Credenciais inválidas.')}
function logout(){data.session=null;save();document.getElementById('login').classList.add('show')}

document.addEventListener('click',e=>{const n=e.target.closest('[data-page]');
    if(n)go(n.dataset.page);
    const m=e.target.closest('[data-modal]');if(m)openModal(m.dataset.modal);
    if(e.target.id==='close')closeModal();
    if(e.target.id==='save')saveModal();
    const del=e.target.closest('[data-delete]');
    if(del){const type=del.dataset.delete,id=Number(del.dataset.id),map={task:'tasks',event:'events',notice:'notices',project:'projects',file:'files',team:'team'},arr=data[map[type]];if(!arr)return;
    if(type==='team'&&!isAdmin()){toast('Apenas o administrador pode remover membros.');
        return}if(confirm('Eliminar este item?')){data[map[type]]=arr.filter(x=>x.id!==id);save();
            toast('Eliminado.')}}const ep=e.target.closest('[data-edit-project]');
            if(ep){const p=data.projects.find(x=>x.id===Number(ep.dataset.editProject));if(p)openModal('Editar projeto',p)}if(e.target.id==='loginBtn')login();
            if(e.target.id==='logout')logout();
            if(e.target.id==='theme'){data.theme=data.theme==='dark'?'light':'dark';document.body.classList.toggle('dark',data.theme==='dark');save()}if(e.target.id==='bell'){data.notices.forEach(n=>n.unread=false);save();toast('Avisos lidos.')}});
document.addEventListener('change',e=>{if(e.target.matches('[data-task]')){const t=data.tasks.find(x=>x.id===Number(e.target.dataset.task));
    if(t){t.done=e.target.checked;save()}}});
document.getElementById('menu')?.addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('saveProfile')?.addEventListener('click',()=>{data.profile.name=document.getElementById('profileName').value.trim()||data.profile.name;data.profile.email=document.getElementById('profileEmail').value.trim();data.profile.role=document.getElementById('profileRole').value;data.profile.phone=document.getElementById('profilePhone').value.trim();
    save();toast('Perfil atualizado.')});
document.getElementById('saveCredentials')?.addEventListener('click',()=>{if(!isAdmin()){toast('Apenas o administrador pode alterar credenciais.');return}const u=document.getElementById('adminUsername').value.trim(),p=document.getElementById('adminPassword').value;if(!u){toast('Utilizador obrigatório.');
    return}data.credentials.username=u;if(p)data.credentials.password=p;data.session.username=u;save();
toast('Credenciais alteradas. Faça login novamente se necessário.')});
document.getElementById('exportData')?.addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
a.download='dcit-backup.json';a.click()});
document.getElementById('resetData')?.addEventListener('click',()=>{if(confirm('Restaurar tudo?')){localStorage.removeItem(KEY);location.reload()}});
document.getElementById('sendChat')?.addEventListener('click',()=>{const x=document.getElementById('chatInput'),t=x.value.trim();
    if(t){data.messages.push({id:uid(),author:data.profile.name,text:t,time:new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})});x.value='';save()}});
document.getElementById('uploadFile')?.addEventListener('change',e=>{const f=e.target.files[0];
    if(!f)return;
    if(f.size>4*1024*1024){toast('Para localStorage, use ficheiros até 4 MB.');
        return}const r=new FileReader();
        r.onload=()=>{data.files.push({id:uid(),name:f.name,category:f.type||'Ficheiro',size:(f.size/1024/1024).toFixed(2)+' MB',updated:'Agora',data:r.result});
        save();
        toast('Ficheiro guardado localmente.')};
        r.readAsDataURL(f)});

document.body.classList.toggle('dark',data.theme==='dark');
if(data.session)document.getElementById('login')?.classList.remove('show');
else document.getElementById('login')?.classList.add('show');
renderAll();
if(location.hash&&document.getElementById(location.hash.slice(1)))go(location.hash.slice(1));
