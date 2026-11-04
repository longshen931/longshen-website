// 公共清单仅包含已核实的项目文档和官方入口。
const publicResources = [
  {title:'scikit-survival',url:'https://scikit-survival.readthedocs.io/en/stable/',category:'method',noteZh:'生存分析模型与时间依赖评价指标的 Python 文档。',noteEn:'Python documentation for survival models and time-dependent evaluation.'},
  {title:'lifelines',url:'https://lifelines.readthedocs.io/en/latest/index.html',category:'method',noteZh:'Cox、参数生存模型与删失数据分析的入门和参考。',noteEn:'A practical reference for Cox and parametric survival models and censoring.'},
  {title:'pycox',url:'https://github.com/havakv/pycox',category:'method',noteZh:'基于 PyTorch 的深度生存分析模型及示例代码。',noteEn:'Deep survival models and examples built with PyTorch.'},
  {title:'SHAP',url:'https://shap.readthedocs.io/en/latest/',category:'writing',noteZh:'模型解释方法与可视化的官方文档。',noteEn:'Official documentation for model explanations and visualizations.'}
];
// 本地收藏与公开资源使用不同状态，避免误以为个人条目已公开发布。
const resourceKey = 'longshen-personal-resources-v1';
const categories = {method:['方法与模型','Methods & models'],data:['数据与文献','Data & literature'],writing:['写作与可视化','Writing & visualization'],other:['其他','Other']};
const resourceText = (zh,en) => document.documentElement.lang === 'en' ? en : zh;
const safeText = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 只允许合法的 HTTPS 地址，避免将脚本或本地文件当作网址打开。
function safeUrl(value) { try { const url = new URL(String(value)); return url.protocol === 'https:' && url.hostname ? url.href : null; } catch { return null; } }
// 校验导入数据和旧浏览器记录，不渲染未经检查的对象。
function normalizeResource(item) { if (!item || typeof item !== 'object') return null; const url = safeUrl(item.url); const title = typeof item.title === 'string' ? item.title.trim().slice(0,80) : ''; if (!url || !title) return null; return {title,url,category:Object.hasOwn(categories,item.category)?item.category:'other',note:typeof item.note === 'string'?item.note.trim().slice(0,240):''}; }
let personalResources = [];
try { const raw=JSON.parse(localStorage.getItem(resourceKey)||'[]'); personalResources=Array.isArray(raw)?raw.slice(0,200).map(normalizeResource).filter(Boolean):[]; } catch {}
let resourceTab='public';
// 更新当前浏览器的备忘；容量异常时保留原有记录并提示用户导出。
function persistResources() { try { localStorage.setItem(resourceKey,JSON.stringify(personalResources)); return true; } catch { return false; } }
// 搜索范围包括标题、网址、用途与分类名称。
function renderResources() {
  const search=document.getElementById('resource-search').value.trim().toLocaleLowerCase();
  const source=resourceTab==='public'?publicResources:personalResources;
  const filtered=source.map((item,index)=>({item,index})).filter(({item})=>[item.title,item.url,item.note||'',item.noteZh||'',item.noteEn||'',...(categories[item.category]||[])].join(' ').toLocaleLowerCase().includes(search));
  const count=document.getElementById('mine-count'); if(count)count.textContent=`(${personalResources.length})`;
  document.getElementById('resource-list').innerHTML=filtered.length?filtered.map(({item,index})=>`<article class="resource-row"><div class="resource-icon" aria-hidden="true">↗</div><div class="resource-main"><div class="resource-meta"><span>${resourceText(...categories[item.category])}</span><span>${safeText(new URL(item.url).hostname)}</span></div><h3><a href="${safeText(item.url)}" target="_blank" rel="noopener noreferrer">${safeText(item.title)} <span aria-hidden="true">↗</span></a></h3><p>${safeText(resourceTab==='public'?resourceText(item.noteZh,item.noteEn):item.note||resourceText('暂无备注','No note yet'))}</p></div>${resourceTab==='mine'?`<button class="resource-remove" data-remove="${index}" aria-label="${safeText(resourceText('删除备忘：','Remove bookmark: ')+item.title)}">×</button>`:''}</article>`).join(''):`<p class="resource-empty">${resourceText(resourceTab==='public'?'没有匹配的公开资源。':'这里还没有备忘，点击“添加网址”开始。',resourceTab==='public'?'No matching public resources.':'Your list is empty. Select “Add a link” to begin.')}</p>`;
}
// 切换清单时保持输入的搜索词，并同步标签选择状态。
document.querySelectorAll('[data-resource-tab]').forEach(button=>button.addEventListener('click',()=>{resourceTab=button.dataset.resourceTab;document.querySelectorAll('[data-resource-tab]').forEach(tab=>{tab.classList.toggle('active',tab===button);tab.setAttribute('aria-selected',String(tab===button));});renderResources();}));
document.getElementById('resource-search').addEventListener('input',renderResources);
const resourceDialog=document.getElementById('resource-dialog');
document.getElementById('add-resource').addEventListener('click',()=>resourceDialog.showModal());
document.getElementById('resource-close').addEventListener('click',()=>resourceDialog.close());
// 保存前先检查重复网址和数量，保存成功后切换至私人清单。
document.getElementById('resource-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const record=normalizeResource(Object.fromEntries(new FormData(form)));const error=document.getElementById('resource-error');if(!record){error.textContent=resourceText('请填写名称和有效的 HTTPS 网址。','Enter a name and a valid HTTPS URL.');return;}if(personalResources.some(item=>item.url===record.url)){error.textContent=resourceText('这个网址已经在你的备忘中。','This URL is already in your bookmarks.');return;}if(personalResources.length>=200){error.textContent=resourceText('备忘已达 200 条，请先导出整理。','Your list has reached 200 entries. Export it first.');return;}personalResources.unshift(record);if(!persistResources()){personalResources.shift();error.textContent=resourceText('浏览器未能保存。请检查存储设置或空间。','The browser could not save this entry. Check its storage settings or space.');return;}error.textContent='';form.reset();resourceDialog.close();document.querySelector('[data-resource-tab="mine"]').click();});
// 私人条目可删除，公共推荐由网站维护。
document.getElementById('resource-list').addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(!button||resourceTab!=='mine')return;const index=Number(button.dataset.remove);if(!Number.isInteger(index)||!personalResources[index])return;const removed=personalResources.splice(index,1)[0];if(!persistResources()){personalResources.splice(index,0,removed);return;}renderResources();});
// 导出纯 JSON 备忘，可在另一台设备上通过导入按钮恢复。
document.getElementById('export-resources').addEventListener('click',()=>{const data=JSON.stringify({format:'longshen-bookmarks-v1',items:personalResources},null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='longshen-bookmarks.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
// 导入操作只读取用户选择的 JSON，合并时以完整网址去重。
document.getElementById('import-resources').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>500000)throw Error('size');const data=JSON.parse(await file.text());if(data.format!=='longshen-bookmarks-v1'||!Array.isArray(data.items))throw Error('format');const imported=data.items.slice(0,200).map(normalizeResource).filter(Boolean);if(!imported.length&&data.items.length)throw Error('records');const previous=personalResources;personalResources=[...previous,...imported.filter(item=>!previous.some(existing=>existing.url===item.url))].slice(0,200);if(!persistResources()){personalResources=previous;throw Error('storage');}document.querySelector('[data-resource-tab="mine"]').click();alert(resourceText(`已导入，现有 ${personalResources.length} 条备忘。`,`Imported. You now have ${personalResources.length} bookmarks.`));}catch{alert(resourceText('导入失败：请选择本站导出的有效 JSON 文件（不超过 500 KB）。','Import failed. Choose a valid JSON export from this site (up to 500 KB).'));}finally{event.target.value='';}});
// 现有语言按钮切换后，资源列表一并刷新。
document.getElementById('language').addEventListener('click',renderResources);
renderResources();
