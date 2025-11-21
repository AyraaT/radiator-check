import { initRadiatorViewer, updateRadiator } from "./geometry.js";

const UI_SCHEMA=[
  {
    card:"main",
    title:"title",
    badge:"badge",
    subtitle:"subtitle",
    rows:[
      {},
      ["height",],
      {label:"validationHeightBound",validate:"heightBound"},
      ["length","links"],
      {label:"validationLinks",validate:"links"},
      {label:"validationLinksBound",validate:"linksBound"},
      ["depth","columns"],
      {label:"validationColumns",validate:"columns"},
      {label:"validationColumnsBound",validate:"columnsBound"},
      {label:"validationDepthBound",validate:"depthBound"}
    ]
  },
  {
    card:"render",
    renderer: true
  },
  {
    card:"temperature",
    rows:[
      {select:"template",options:["template1","template2","template3"]},
      ["tFlow","tReturn","tRoom"],
    ]
  },
  {
    card:"results",
    results:["Average","Arbonia","Zender","IRSAP","Cordivari","FIR Iron"],
    footer:{
      buttons:[
        {label: "about", url: "https://www.hslu.ch/de-ch/hochschule-luzern/forschung/projekte/detail/?pid=7067"}, 
        {label: "github", url: "https://github.com/AyraaT/radiator-check"}, 
        {label: "excel", url: "20251118_RadiatorCheck_Prototyp1.xlsx"}
      ],
      note:"footer"
    }
  },
]

const LANG_KEY="app-language"
let lang=localStorage.getItem(LANG_KEY)||"de"

const translations = {
  title:"Radiator Check",
  badge:"v1.0 2025",

  en:{
    subtitle:"Currently works for Column Radiators",
    height:"Height [mm]",
    depth:"Depth [mm]",
    length:"Length [mm]",
    links:"Links [N]",
    columns:"Columns [N]",
    template:"Temperature Template",
    template1:"75/65/20 °C – (EN 442)",
    template2:"55/45/24 °C",
    template3:"50/40/22 °C",
    tFlow:"Flow [°C]",
    tReturn:"Return [°C]",
    tRoom:"Room [°C]",
    validationColumns:"⚠ Depth does not match column count.",
    validationColumnsBound:"⚠ Only models between 2 and 6 columns are supported",
    validationLinks:"⚠ Length does not match links count.",
    validationLinksBound:"⚠ Value too big",
    validationHeightBound:"⚠ Value too big",
    validationDepthBound:"⚠ Value too big",
    Average:"Average",
    excel:"Download Excel",
    about:"About",
    github:"Github",
    footer:`Created by <a href="https://www.hslu.ch/de-ch/hochschule-luzern/forschung/projekte/detail/?pid=7067">HSLU</a>, <a href="https://bauteilboerse-basel.ch/">Bauteilbörse Basel</a> and <a href="https://zirkular.net/">Zirkular</a>.<br>
    Financed through <a href="https://cbi-booster.ch/">CBI Booster</a> and <a href="https://baselcircular.ch/">Basel Circular</a>.`
  },

  de:{
    subtitle:"Funktioniert derzeit für Gliedradiatoren",
    height:"Höhe [mm]",
    depth:"Tiefe [mm]",
    length:"Länge [mm]",
    links:"Glieder [N]",
    columns:"Säulen [N]",
    template:"Temperaturvorlage",
    template1:"75/65/20 °C – (EN 442)",
    template2:"55/45/24 °C",
    template3:"50/40/22 °C",
    tFlow:"Vorlauf [°C]",
    tReturn:"Rücklauf [°C]",
    tRoom:"Raum [°C]",
    validationColumns:"⚠ Tiefe passt nicht zur Säulenanzahl.",
    validationColumnsBound:"⚠ Nur Modelle mit 2 bis 6 Säulen werden unterstützt.",
    validationLinks:"⚠ Länge passt nicht zur Gliederanzahl.",
    validationLinksBound:"⚠ Wert zu gross",
    validationHeightBound:"⚠ Wert zu gross",
    validationDepthBound:"⚠ Wert zu gross",
    Average:"Durchschnitt",
    excel:"Excel herunterladen",
    about:"Info",
    github:"Github",
    footer:`Erstellt von <a href="https://www.hslu.ch/de-ch/hochschule-luzern/forschung/projekte/detail/?pid=7067">HSLU</a>, <a href="https://bauteilboerse-basel.ch/">Bauteilbörse Basel</a> und <a href="https://zirkular.net/">Zirkular</a>.<br>
    Finanziert durch <a href="https://cbi-booster.ch/">CBI Booster</a> und <a href="https://baselcircular.ch/">Basel Circular</a>.`
  },

  fr:{
    subtitle:"Actuellement compatible avec les radiateurs à colonnes",
    height:"Hauteur [mm]",
    depth:"Profondeur [mm]",
    length:"Longueur [mm]",
    links:"Éléments [N]",
    columns:"Colonnes [N]",
    template:"Profil de température",
    template1:"75/65/20 °C – (EN 442)",
    template2:"55/45/24 °C",
    template3:"50/40/22 °C",
    tFlow:"Aller [°C]",
    tReturn:"Retour [°C]",
    tRoom:"Ambiante [°C]",
    validationColumns:"⚠ La profondeur ne correspond pas au nombre de colonnes.",
    validationColumnsBound:"⚠ Seuls les modèles de 2 à 6 colonnes sont pris en charge.",
    validationLinks:"⚠ La longueur ne correspond pas au nombre d’éléments.",
    validationLinksBound:"⚠ Valeur trop élevée",
    validationHeightBound:"⚠ Valeur trop élevée",
    validationDepthBound:"⚠ Valeur trop élevée",
    Average:"Moyenne",
    excel:"Télécharger Excel",
    about:"À propos",
    github:"Github",
    footer:`Créé par <a href="https://www.hslu.ch/de-ch/hochschule-luzern/forschung/projekte/detail/?pid=7067">HSLU</a>, <a href="https://bauteilboerse-basel.ch/">Bauteilbörse Basel</a> et <a href="https://zirkular.net/">Zirkular</a>.<br>
    Financé par <a href="https://cbi-booster.ch/">CBI Booster</a> et <a href="https://baselcircular.ch/">Basel Circular</a>.`
  },

  it:{
    subtitle:"Attualmente funziona per radiatori a colonne",
    height:"Altezza [mm]",
    depth:"Profondità [mm]",
    length:"Lunghezza [mm]",
    links:"Elementi [N]",
    columns:"Colonne [N]",
    template:"Profilo di temperatura",
    template1:"75/65/20 °C – (EN 442)",
    template2:"55/45/24 °C",
    template3:"50/40/22 °C",
    tFlow:"Mandata [°C]",
    tReturn:"Ritorno [°C]",
    tRoom:"Ambiente [°C]",
    validationColumns:"⚠ La profondità non coincide con il numero di colonne.",
    validationColumnsBound:"⚠ Sono supportati solo modelli da 2 a 6 colonne.",
    validationLinks:"⚠ La lunghezza non coincide con il numero di elementi.",
    validationLinksBound:"⚠ Valore troppo grande",
    validationHeightBound:"⚠ Valore troppo grande",
    validationDepthBound:"⚠ Valore troppo grande",
    Average:"Media",
    excel:"Scarica Excel",
    about:"Informazioni",
    github:"Github",
    footer:`Creato da <a href="https://www.hslu.ch/de-ch/hochschule-luzern/forschung/projekte/detail/?pid=7067">HSLU</a>, <a href="https://bauteilboerse-basel.ch/">Bauteilbörse Basel</a> e <a href="https://zirkular.net/">Zirkular</a>.<br>
    Finanziato da <a href="https://cbi-booster.ch/">CBI Booster</a> e <a href="https://baselcircular.ch/">Basel Circular</a>.`
  }
}

const TEMPLATES={
  template1:{tFlow:75,tReturn:65,tRoom:20},
  template2:{tFlow:55,tReturn:45,tRoom:24},
  template3:{tFlow:50,tReturn:40,tRoom:22},
}

function infer(values) {
  let { length, depth, links, columns } = values;

  fieldRefs.links.placeholder = ""
  fieldRefs.length.placeholder = ""

  if (!links && length) links = fieldRefs.links.placeholder = Math.round(length/45) 
  if (!length && links) fieldRefs.length.placeholder = links*45

    fieldRefs.columns.placeholder = ""
  if (!columns && depth) columns = fieldRefs.columns.placeholder = [
      [70,2],[110,3],[150,4],[200,5],[250,6]
    ].find(([max])=>depth<=max)?.[1] ?? ""

  return { ...values, links, columns };
}


const radiatorOutput = ({height, length, depth, columns, links, tFlow, tReturn, tRoom, models}) => {

  if (!VALIDATIONS.links({length,links}) || !VALIDATIONS.columns({columns,depth})){
    return null
  }

  const [m,e] = [
    models[columns],
    ({
      2: -0.00000002*height**2 + 0.00008*height + 1.2298,
      3: -0.00000001*height**2 + 0.00006*height + 1.2636,
      4: -0.00000002*height**2 + 0.00008*height + 1.2608,
      5: -0.00000002*height**2 + 0.00007*height + 1.2826,
      6: -0.00000002*height**2 + 0.00006*height + 1.2931
    })[columns]
  ]

  if (!m || !e) return null
  
  const d = (tFlow - tReturn) / Math.log((tFlow - tRoom) / (tReturn - tRoom))

  return (links || 1) * m * (d / 49.8) ** e
}

const CALCULATIONS={
  Average: v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0701 * v.height + 3.1231,
      3: 0.0911 * v.height + 7.6769,
      4: 0.1145 * v.height + 11.7580,
      5: 0.1370 * v.height + 16.6470,
      6: 0.1609 * v.height + 20.1290,
    }
   }),
  Arbonia: v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0704 * v.height + 3.1521,
      3: 0.0893 * v.height + 8.8262,
      4: 0.1127 * v.height + 12.3910,
      5: 0.1288 * v.height + 22.5110,
      6: 0.1578 * v.height + 17.2940,
    }
   }),
  Zender: v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0660 * v.height + 5.1012,
      3: 0.0874 * v.height + 7.5286,
      4: 0.1116 * v.height + 11.3750,
      5: 0.1351 * v.height + 15.4360,
      6: 0.1575 * v.height + 19.8000,
    }
   }),
   IRSAP: v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0690 * v.height + 1.5026,
      3: 0.0912 * v.height + 5.4758,
      4: 0.1145 * v.height + 9.7000,
      5: 0.1383 * v.height + 12.1410,
      6: 0.1621 * v.height + 14.6090,
    }
   }),
   Cordivari: v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0739 * v.height + 2.2582,
      3: 0.0959 * v.height + 7.5701,
      4: 0.1191 * v.height + 12.6840,
      5: 0.1410 * v.height + 17.6470,
      6: 0.1544 * v.height + 31.8940,
    }


   }),
   "FIR Iron": v => radiatorOutput({ 
    ...v, 
    models: {
      2: 0.0727 * v.height + 2.9525,
      3: 0.0956 * v.height + 6.9839,
      4: 0.1186 * v.height + 11.0120,
      5: 0.1458 * v.height + 13.8780,
      6: 0.1730 * v.height + 16.8890,
    }
   })
}

const VALIDATIONS={
  links:({length, links})=>{
    if (!length || !links) return true;

    return links >= Math.round(length/45*0.85) && links <= Math.round(length/45*1.15)
  },

  columns:({columns,depth})=>{
    if (!columns || !depth) return true;
    
    const rules = {
      2: { min: 0, max: 70 },
      3: { min: 70, max: 110 },
      4: { min: 110, max: 150 },
      5: { min: 150, max: 200 },
      6: { min: 200, max: 250 },
    };

    const r = rules[columns];
    
    if (!r) return false

    return depth >= r.min && depth <= r.max;

  },

  columnsBound:({columns})=>{
    return !columns || (columns >= 2 && columns <= 6)
  },

  heightBound:({height})=>{
    return !height || (height <= 3000)
  },

  linksBound:({links})=>{
    return !links || (links <= 400)
  },
  
  depthBound:({depth})=>{
    return !depth || (depth <= 250)
  },
}

const runFormula=(f,v)=>{
  try{
    const r=f(v)
    if(r===null||r===undefined||r==="")return"—"
    const n=Number(r)
    return isNaN(n)?"—":n.toFixed(1)
  }catch{return"—"}
}

const isSpacer=i=>i===null||i===undefined||i===""||(typeof i==="object"&&Object.keys(i).length===0)||(i&&i.spacer)

let fieldRefs={},validationRefs={}

function render(){
  const app=document.getElementById("app")
  app.innerHTML=""
  fieldRefs={}
  validationRefs={}

  UI_SCHEMA.forEach(section=>{
    const card=document.createElement("div")
    card.className="card"

    if(section.title||section.badge){
      card.innerHTML+=`
      <div class="title-row">
        <div class="title">
          ${section.title?`<h1 data-i18n="${section.title}"></h1>`:""}
          ${section.badge?`<span class="badge" data-i18n="${section.badge}"></span>`:""}
        </div>
        ${section.card==="main"?`<select id="lang-switch"><option value="de">🇩🇪&nbsp;&nbsp;DE</option><option value="en">🇬🇧&nbsp;&nbsp;EN</option><option value="fr">🇫🇷&nbsp;&nbsp;FR</option><option value="it">🇮🇹&nbsp;&nbsp;IT</option></select>`:""}
      </div>`
    }

    if(section.subtitle) card.innerHTML+=`<p class="subtitle" data-i18n="${section.subtitle}"></p>`

    if(section.renderer){
      card.className = "card render-card";
      card.innerHTML = `<div class="viewer-container"><canvas id="radiator-viewer"></canvas></div>`;
    }

    if(section.rows){
      section.rows.forEach(row=>{
        if(isSpacer(row)){card.appendChild(spacerNode());return}
        const rowEl=document.createElement("div")
        rowEl.className="row"

        if(Array.isArray(row)){
          row.forEach(key=>{
            const l=document.createElement("label")
            l.innerHTML=`<span data-i18n="${key}"></span><input type="number" data-key="${key}">`
            const input=l.querySelector("input")
            fieldRefs[key]=input
            input.addEventListener("input",()=>handleInput(key))
            rowEl.appendChild(l)
          })
        }
        else if(row.select){
          const wrap=document.createElement("label")
          wrap.innerHTML=`<span data-i18n="${row.select}"></span><select data-template><option value=""></option>${row.options.map(o=>`<option value="${o}" data-i18n="${o}"></option>`).join("")}</select>`
          wrap.querySelector("select").addEventListener("change",e=>{applyTemplate(e.target.value);calculate();})
          rowEl.appendChild(wrap)
        }
        else if(row.label){
          rowEl.dataset.validation=row.validate
          rowEl.style.display="none"
          const warn=document.createElement("div")
          warn.dataset.i18n=row.label
          validationRefs[row.validate]=rowEl
          rowEl.appendChild(warn)
        }

        card.appendChild(rowEl)
      })
    }

    if(section.results){
      const div=document.createElement("div")
      div.className="results"
      section.results.forEach(item=>{
        if(isSpacer(item)){div.appendChild(spacerNode());return}
        const r=document.createElement("div")
        r.className="result-card"
        r.dataset.result=item
        r.innerHTML=`
          <div class="result-label" data-i18n="${item}"></div>
          <output data-result="${item}">—</output>
        `
        div.appendChild(r)
      })
      card.appendChild(div)
    }


    if(section.footer){
      const footer=document.createElement("footer")
      section.footer.buttons.forEach(btn=>{
        if (isSpacer(btn)) {
          footer.appendChild(spacerNode())
          return
        }

        const label = typeof btn === "string" ? btn : btn.label
        const url   = typeof btn === "object" ? btn.url : null

        const b = document.createElement("button")
        b.dataset.i18n = label

        if (url) {
          b.dataset.url = url
          b.addEventListener("click",()=>window.open(url,"_blank"))
        }

        footer.appendChild(b)
      })

      const note = document.createElement("p")
      note.className = "subtitle"
      note.dataset.i18n = section.footer.note
      note.dataset.i18nHtml = true
      footer.appendChild(note)

      card.appendChild(footer)
    }

    app.appendChild(card)
  })

  applyTranslations()
  calculate()
}

function applyTemplate(k){
  const p=TEMPLATES[k]
  if(!p)return
  Object.entries(p).forEach(([n,v])=>{
    if(fieldRefs[n]) fieldRefs[n].value=v
  })
}

function handleInput(key){
  if(["tFlow","tReturn","tRoom"].includes(key)){
    const sel=document.querySelector("[data-template]")
    if(sel&&sel.value)sel.value=""
  }
  calculate()
}

function runValidation(values) {
  const result = {
    valid: true,
    errors: {}
  }

  for (const [rule, rowEl] of Object.entries(validationRefs)) {
    const ok = VALIDATIONS[rule](values)

    result.errors[rule] = !ok
    if (!ok) result.valid = false

    rowEl.style.display = ok ? "none" : "block"
  }

  return result
}

function calculate() {
  let values = Object.fromEntries(
      Object.entries(fieldRefs).map(([key, input]) => [key, parseFloat(input.value)])
    )
  
  values = infer(values)

  const { valid } = runValidation(values)

  if (!valid) {
    clearResults()
    return
  }

  updateRadiator({
    height: values.height / 1000 || 0.8,
    columns: values.columns || 3,
    links: values.links || 1,
  })

  updateResults(values)
}

function clearResults() {
  document.querySelectorAll("output[data-result]").forEach(out => {
    out.textContent = "—"
  })
}

function updateResults(values) {
  document.querySelectorAll("output[data-result]").forEach(out => {
    const key = out.dataset.result
    out.textContent = CALCULATIONS[key]
      ? runFormula(CALCULATIONS[key], values) + " W"
      : "—"
  })
}

function applyTranslations(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = translations?.[lang]?.[el.dataset.i18n] || translations?.[el.dataset.i18n] || el.dataset.i18n
  })
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    el.innerHTML = translations?.[lang]?.[el.dataset.i18n] || translations?.[el.dataset.i18n] || el.dataset.i18n
  })
  const sel=document.getElementById("lang-switch")
  if(sel)sel.value=lang
}

document.addEventListener("change",e=>{
  if(e.target.id==="lang-switch"){
    lang=e.target.value
    localStorage.setItem(LANG_KEY,lang)
    applyTranslations()
  }
})

const spacerNode=()=>{
  const d=document.createElement("div")
  d.className="schema-spacer"
  return d
}


render()
initRadiatorViewer();
const select = document.querySelector("[data-template]")
if (select) {
  select.value = "template1"
  applyTemplate("template1")
}