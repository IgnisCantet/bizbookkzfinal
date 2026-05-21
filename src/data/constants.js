/**
 * © 2026 ТОО «NOVA Comp». Все права защищены.
 * Закон РК «Об авторском праве» №6-I
 */

export const MRP = 4325, MZP = 85000;
export const APP = { name: "BizBook KZ", version: "4.0.0", owner: "ТОО «NOVA Comp»", year: 2026 };

// ─── BRAND COLORS (original #7c6fff palette) ──────────────────────
export const PALETTE = {
  primary:   "#7c6fff",
  primary2:  "#6152e0",
  dark:      "#0d0d1a",
  card:      "#13131f",
  card2:     "#1a1a2e",
  card3:     "#21213a",
  border:    "rgba(124,111,255,0.15)",
  border2:   "rgba(124,111,255,0.28)",
  text:      "#f0efff",
  muted:     "#6b6b8a",
  dim:       "#252540",
  gold:      "#f59e0b",
  goldL:     "#fbbf24",
  green:     "#22c55e",
  red:       "#ef4444",
  orange:    "#f59e0b",
  cyan:      "#06b6d4",
  pink:      "#ec4899",
  // Light theme
  lbg:       "#f5f4ff",
  lcard:     "#ffffff",
  lcard2:    "#eeecff",
  lborder:   "rgba(124,111,255,0.18)",
  ltext:     "#0d0d1a",
  lmuted:    "#6b6b8a",
};

export const CO = {
  name: "ТОО «NOVA COMP»", bin: "241040014477", reg: "10.10.2024",
  city: "Алматы", address: "г. Алматы, Турксибский р-н, мкр ЖУЛДЫЗ-2, д.35, кв.64",
  phone: "+7 705 474 1612", email: "info@novacomp.kz",
  director: "Иванов Алексей Сергеевич", regime: "ОУР", nds: true,
  bank: "Halyk Bank", bik: "HSBKKZKX", iik: "KZ89 601A 1234 5678 9100",
};

export const EMPLOYEES = [
  { id:1, name:"Иванов Алексей Сергеевич", pos:"Генеральный директор", salary:600000, type:"standard", hired:"01.11.2024" },
  { id:2, name:"Петрова Анна Владимировна", pos:"Менеджер по продажам",  salary:380000, type:"standard", hired:"01.11.2024" },
  { id:3, name:"Сейткали Марат Бекович",   pos:"Маркетолог",            salary:350000, type:"standard", hired:"15.11.2024" },
];

export const DOCS_DATA = [
  { id:1, no:"ЭСФ-0001",  type:"ЭСФ",         dir:"out", cp:"ТОО «Digital Solutions»", cpBin:"200340015877", amount:1180000, nds:163448, date:"05.05.2026", service:"Разработка CRM-системы",        pay:"paid",    ship:"shipped",   signed:true  },
  { id:2, no:"ЭАВР-0001", type:"ЭАВР",         dir:"out", cp:"ТОО «Digital Solutions»", cpBin:"200340015877", amount:1180000, nds:163448, date:"05.05.2026", service:"Разработка CRM-системы",        pay:"paid",    ship:"shipped",   signed:true  },
  { id:3, no:"СЧ-0002",   type:"счёт",         dir:"out", cp:"ИП Сейткалиева Г.А.",     cpBin:"850101300211", amount:250000,  nds:0,      date:"07.05.2026", service:"SEO-оптимизация сайта",         pay:"partial", ship:"unshipped", signed:false },
  { id:4, no:"АВР-0001",  type:"АВР",          dir:"out", cp:"ИП Сейткалиева Г.А.",     cpBin:"850101300211", amount:120000,  nds:0,      date:"07.05.2026", service:"Консультационные услуги",       pay:"paid",    ship:"shipped",   signed:true  },
  { id:5, no:"ДВР-0001",  type:"доверенность", dir:"out", cp:"ТОО «Digital Solutions»", cpBin:"200340015877", amount:0,       nds:0,      date:"06.05.2026", service:"Доверенность на получение ТМЦ", pay:"paid",    ship:"shipped",   signed:true  },
  { id:6, no:"НАК-0001",  type:"накладная",    dir:"out", cp:"ТОО «Digital Solutions»", cpBin:"200340015877", amount:340000,  nds:0,      date:"06.05.2026", service:"Компьютерное оборудование",     pay:"unpaid",  ship:"unshipped", signed:false },
  { id:7, no:"ЭСФ-ВХ-4521",type:"ЭСФ",        dir:"in",  cp:"ТОО «КазАренда»",         cpBin:"180930021455", amount:310200,  nds:42993,  date:"01.05.2026", service:"Аренда офиса май 2026",         pay:"paid",    ship:"shipped",   signed:true  },
  { id:8, no:"АКТ-ВХ-012", type:"акт",         dir:"in",  cp:"Beeline Kazakhstan",      cpBin:"970341000003", amount:45000,   nds:0,      date:"01.05.2026", service:"Услуги связи май",               pay:"paid",    ship:"shipped",   signed:true  },
];

export const BANK_OPS = [
  { id:1, date:"05.05.2026", desc:"Оплата от ТОО «Digital Solutions»", amount:1180000, type:"in",  cat:"revenue" },
  { id:2, date:"04.05.2026", desc:"Выплата ЗП Иванов А.С.",            amount:-503000, type:"out", cat:"salary"  },
  { id:3, date:"04.05.2026", desc:"Выплата ЗП Петрова А.В.",           amount:-320700, type:"out", cat:"salary"  },
  { id:4, date:"04.05.2026", desc:"Выплата ЗП Сейткали М.Б.",          amount:-295000, type:"out", cat:"salary"  },
  { id:5, date:"05.05.2026", desc:"Налоги ИПН + СН за Q1",             amount:-158000, type:"out", cat:"tax"     },
  { id:6, date:"05.05.2026", desc:"Соцплатежи ОПВ+СО+ОСМС+ОПВР",      amount:-212000, type:"out", cat:"tax"     },
  { id:7, date:"01.05.2026", desc:"Аренда офиса ТОО «КазАренда»",      amount:-310200, type:"out", cat:"expense" },
  { id:8, date:"07.05.2026", desc:"Частичная оплата ИП Сейткалиева",   amount:125000,  type:"in",  cat:"revenue" },
];

export const COUNTERPARTIES = [
  { id:1, name:"ТОО «Digital Solutions»", bin:"200340015877", type:"client",   nds:true,  status:"active" },
  { id:2, name:"ИП Сейткалиева Г.А.",     bin:"850101300211", type:"client",   nds:false, status:"active" },
  { id:3, name:"ТОО «КазАренда»",         bin:"180930021455", type:"supplier", nds:true,  status:"active" },
  { id:4, name:"Beeline Kazakhstan",       bin:"970341000003", type:"supplier", nds:true,  status:"active" },
];

export const TAXES_DATA = [
  { code:"КПН",  rate:"20%",  form:"ФНО 100", deadline:"10 апр 2027", status:"planned", amount:null,   note:"Авансы ежемесячно до 25 числа"   },
  { code:"НДС",  rate:"16%",  form:"ФНО 300", deadline:"15 мая 2026", status:"urgent",  amount:120690, note:"Порог: 43.25 млн ₸"              },
  { code:"ИПН",  rate:"10%",  form:"ФНО 200", deadline:"15 мая 2026", status:"urgent",  amount:130000, note:"Вычет 30 МРП = 129 750 ₸/мес"    },
  { code:"СН",   rate:"6%",   form:"ФНО 200", deadline:"15 мая 2026", status:"urgent",  amount:78900,  note:"↓ снижен с 11% до 6% с 2026"     },
  { code:"ОПВ",  rate:"10%",  form:"ФНО 200", deadline:"25 мая 2026", status:"pending", amount:133000, note:"Макс. база: 50 МЗП"               },
  { code:"ОПВР", rate:"3.5%", form:"ФНО 200", deadline:"25 мая 2026", status:"pending", amount:46550,  note:"↑ повышен с 2.5% до 3.5% с 2026" },
  { code:"СО",   rate:"5%",   form:"ФНО 200", deadline:"25 мая 2026", status:"pending", amount:32500,  note:"Макс 7 МЗП · мин 1 МЗП"          },
  { code:"ВОСМС",rate:"2%",   form:"ФНО 200", deadline:"25 мая 2026", status:"pending", amount:26600,  note:"+ 2% от работника"                },
];

export const TAX_CALENDAR = [
  { date:"15 мая",  items:["ФНО 200.00 (ИПН+СН за Q1)", "ФНО 300.00 (НДС за Q1)"],            urgent:true,  amount:329590 },
  { date:"25 мая",  items:["ОПВ за апрель", "ОПВР за апрель", "СО+ВОСМС за апрель"],           urgent:true,  amount:238650 },
  { date:"25 июня", items:["КПН авансовый за май", "ОПВ+СО+ОСМС за май"],                      urgent:false, amount:180000 },
  { date:"15 авг",  items:["ФНО 200.00 за Q2", "ФНО 300.00 за Q2"],                            urgent:false, amount:null   },
];

export const NEWS_DATA = [
  { id:1, date:"12.05.2026", tag:"НК РК",  title:"ОПВР вырос до 3.5% — важно для расчёта ФОТ",        hot:true  },
  { id:2, date:"10.05.2026", tag:"НДС",    title:"Порог НДС снижен до 43.25 млн ₸",                   hot:true  },
  { id:3, date:"05.05.2026", tag:"ЭСФ",    title:"ЭСФ обязательны для всех ИП на упрощёнке с 2026",   hot:true  },
  { id:4, date:"01.05.2026", tag:"СН",     title:"Социальный налог снижен до 6% (был 11%)",            hot:false },
];

export const DOC_COLORS = {
  "ЭСФ":"#f59e0b","ЭАВР":"#06b6d4","АВР":"#22c55e","акт":"#22c55e",
  "счёт":"#7c6fff","доверенность":"#ec4899","накладная":"#64748b","СФ":"#f59e0b",
};
export const DOC_ICONS = {
  "ЭСФ":"🧾","ЭАВР":"📋","АВР":"✅","акт":"✅",
  "счёт":"📄","доверенность":"📜","накладная":"📦","СФ":"🗂",
};

// ─── НК РК 2026 salary calculator ─────────────────────────────────
export function calcSalary(gross, type = "standard") {
  const isPens = type === "pensioner", isStu = type === "student";
  const isDis  = type === "disabled",  isNR  = type === "nonresident";
  const opv    = (isPens||isNR) ? 0 : Math.round(Math.min(gross,50*MZP)*0.10);
  const vosms  = (isPens||isStu) ? 0 : Math.round(gross*0.02);
  const ded    = 30*MRP + (isDis ? 882*MRP : 0);
  const ipnB   = isNR ? gross : Math.max(0, gross-opv-vosms-ded);
  const ipn    = Math.round(ipnB*(isNR?0.20:0.10));
  const net    = gross-opv-vosms-ipn;
  const opvr   = isPens ? 0 : Math.round(Math.min(gross,50*MZP)*0.035);
  const so     = isPens ? 0 : Math.round(Math.min(Math.max(gross-opv,MZP),7*MZP)*0.05);
  const sn     = Math.max(0, Math.round(gross*0.06)-so);
  const vemp   = Math.round(gross*0.02);
  return { gross, opv, vosms, ipn, net, opvr, so, sn, vemp, total:gross+opvr+so+sn+vemp };
}

// ─── Translations ──────────────────────────────────────────────────
export const T = {
  ru: {
    home:"Главная", docs:"Документы", bank:"Банк", taxes:"Отчёты", profile:"Профиль",
    analytics:"Аналитика", calendar:"Календарь", news:"Новости", ai:"ИИ-ассистент",
    settings:"Настройки", logout:"Выйти", create:"+ Создать", save:"Сохранить",
    cancel:"Отмена", send:"Отправить", sign:"Подписать ЭЦП", delete:"Удалить",
    income:"Доходы", expense:"Расходы", profit:"Прибыль", salary:"Зарплата",
    dark:"Тёмная", light:"Светлая", system:"Системная", lang:"Язык",
    login:"Войти", register:"Регистрация", welcome:"Добро пожаловать!",
    copyright:"© 2026 ТОО «NOVA Comp». Все права защищены.",
    paid:"Оплачен", unpaid:"Не оплачен", partial:"Частично",
    urgent:"Срочно", pending:"Ожидает", planned:"Запланирован",
  },
  kz: {
    home:"Басты", docs:"Құжаттар", bank:"Банк", taxes:"Есептер", profile:"Профиль",
    analytics:"Аналитика", calendar:"Күнтізбе", news:"Жаңалықтар", ai:"ЖИ-көмекші",
    settings:"Баптаулар", logout:"Шығу", create:"+ Жасау", save:"Сақтау",
    cancel:"Болдырмау", send:"Жіберу", sign:"ЭЦҚ қол қою", delete:"Жою",
    income:"Кіріс", expense:"Шығыс", profit:"Пайда", salary:"Жалақы",
    dark:"Қараңғы", light:"Жарық", system:"Жүйелік", lang:"Тіл",
    login:"Кіру", register:"Тіркелу", welcome:"Қош келдіңіз!",
    copyright:"© 2026 ТОО «NOVA Comp». Барлық құқықтар қорғалған.",
    paid:"Төленді", unpaid:"Төленбеді", partial:"Ішінара",
    urgent:"Шұғыл", pending:"Күтуде", planned:"Жоспарда",
  }
};
