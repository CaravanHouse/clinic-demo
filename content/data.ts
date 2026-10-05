// Данные вымышленной клиники Mehr Medical. Всё на двух языках: { ru, uz }.
// Это демо: имена, адреса, телефоны и цены придуманы.
import type { L } from "@/lib/i18n";

export type BranchId = "yunusabad" | "chilanzar" | "mirzo";
export type CenterId = "adult" | "kids" | "diagnostics" | "surgery";
export type DepartmentId =
  | "therapy"
  | "cardiology"
  | "neurology"
  | "endocrinology"
  | "gynecology"
  | "pediatrics"
  | "kids-lor"
  | "ultrasound"
  | "lab"
  | "mri"
  | "surgery"
  | "dentistry";

export interface Branch {
  id: BranchId;
  name: L;
  address: L;
  hours: L;
  metro: L;
  floors: number;
}

export const branches: Branch[] = [
  {
    id: "yunusabad",
    name: { ru: "Юнусабад — главный корпус", uz: "Yunusobod — bosh bino" },
    address: { ru: "Юнусабадский район, ул. Демо, 12", uz: "Yunusobod tumani, Demo koʻchasi, 12" },
    hours: { ru: "Ежедневно 07:00–22:00", uz: "Har kuni 07:00–22:00" },
    metro: { ru: "м. Юнус Раджаби, 5 минут пешком", uz: "Yunus Rajabiy metrosi, 5 daqiqa piyoda" },
    floors: 5,
  },
  {
    id: "chilanzar",
    name: { ru: "Чиланзар — детский центр", uz: "Chilonzor — bolalar markazi" },
    address: { ru: "Чиланзарский район, 9-й квартал, 3", uz: "Chilonzor tumani, 9-mavze, 3" },
    hours: { ru: "Пн–Сб 08:00–20:00", uz: "Du–Sha 08:00–20:00" },
    metro: { ru: "м. Новза, 7 минут пешком", uz: "Novza metrosi, 7 daqiqa piyoda" },
    floors: 3,
  },
  {
    id: "mirzo",
    name: { ru: "Мирзо-Улугбек — диагностика", uz: "Mirzo Ulugʻbek — diagnostika" },
    address: { ru: "Мирзо-Улугбекский район, ул. Примерная, 7", uz: "Mirzo Ulugʻbek tumani, Namuna koʻchasi, 7" },
    hours: { ru: "Ежедневно 08:00–21:00", uz: "Har kuni 08:00–21:00" },
    metro: { ru: "м. Буюк Ипак Йули, 10 минут", uz: "Buyuk Ipak Yoʻli metrosi, 10 daqiqa" },
    floors: 4,
  },
];

export interface Center {
  id: CenterId;
  name: L;
  description: L;
}

export const centers: Center[] = [
  {
    id: "adult",
    name: { ru: "Взрослая поликлиника", uz: "Kattalar poliklinikasi" },
    description: { ru: "Терапевты и узкие специалисты для взрослых", uz: "Kattalar uchun terapevtlar va tor mutaxassislar" },
  },
  {
    id: "kids",
    name: { ru: "Детский центр", uz: "Bolalar markazi" },
    description: { ru: "Педиатры и детские специалисты с рождения", uz: "Tugʻilgandan boshlab pediatrlar va bolalar mutaxassislari" },
  },
  {
    id: "diagnostics",
    name: { ru: "Диагностический центр", uz: "Diagnostika markazi" },
    description: { ru: "Анализы, УЗИ и МРТ — результаты онлайн", uz: "Tahlillar, UZI va MRT — natijalar onlayn" },
  },
  {
    id: "surgery",
    name: { ru: "Хирургия и стоматология", uz: "Jarrohlik va stomatologiya" },
    description: { ru: "Амбулаторные операции и лечение зубов", uz: "Ambulator operatsiyalar va tish davolash" },
  },
];

export interface Department {
  id: DepartmentId;
  center: CenterId;
  name: L;
  short: L;
  /** Где находится: филиал и этаж — для схемы «Структура клиники» */
  location: { branch: BranchId; floor: number };
  services: L[];
}

export const departments: Department[] = [
  {
    id: "therapy",
    center: "adult",
    name: { ru: "Терапия", uz: "Terapiya" },
    short: { ru: "Первичный приём, направления, больничные", uz: "Birlamchi qabul, yoʻllanmalar, kasallik varaqasi" },
    location: { branch: "yunusabad", floor: 2 },
    services: [
      { ru: "Приём терапевта", uz: "Terapevt qabuli" },
      { ru: "Вызов врача на дом", uz: "Shifokorni uyga chaqirish" },
      { ru: "Справки и медкомиссии", uz: "Maʼlumotnomalar va tibbiy koʻrik" },
    ],
  },
  {
    id: "cardiology",
    center: "adult",
    name: { ru: "Кардиология", uz: "Kardiologiya" },
    short: { ru: "ЭКГ, холтер, давление и сердце", uz: "EKG, xolter, qon bosimi va yurak" },
    location: { branch: "yunusabad", floor: 3 },
    services: [
      { ru: "Приём кардиолога", uz: "Kardiolog qabuli" },
      { ru: "ЭКГ с расшифровкой", uz: "EKG va uning tavsifi" },
      { ru: "Суточный холтер", uz: "Sutkalik xolter" },
    ],
  },
  {
    id: "neurology",
    center: "adult",
    name: { ru: "Неврология", uz: "Nevrologiya" },
    short: { ru: "Головные боли, спина, сон", uz: "Bosh ogʻrigʻi, bel, uyqu" },
    location: { branch: "yunusabad", floor: 3 },
    services: [
      { ru: "Приём невролога", uz: "Nevrolog qabuli" },
      { ru: "Блокада", uz: "Blokada" },
      { ru: "План лечения боли в спине", uz: "Bel ogʻrigʻini davolash rejasi" },
    ],
  },
  {
    id: "endocrinology",
    center: "adult",
    name: { ru: "Эндокринология", uz: "Endokrinologiya" },
    short: { ru: "Щитовидная железа, диабет, гормоны", uz: "Qalqonsimon bez, diabet, gormonlar" },
    location: { branch: "yunusabad", floor: 4 },
    services: [
      { ru: "Приём эндокринолога", uz: "Endokrinolog qabuli" },
      { ru: "Школа диабета", uz: "Diabet maktabi" },
      { ru: "УЗИ щитовидной железы", uz: "Qalqonsimon bez UZIsi" },
    ],
  },
  {
    id: "gynecology",
    center: "adult",
    name: { ru: "Гинекология", uz: "Ginekologiya" },
    short: { ru: "Женское здоровье и ведение беременности", uz: "Ayollar salomatligi va homiladorlikni kuzatish" },
    location: { branch: "yunusabad", floor: 4 },
    services: [
      { ru: "Приём гинеколога", uz: "Ginekolog qabuli" },
      { ru: "Ведение беременности", uz: "Homiladorlikni kuzatish" },
      { ru: "УЗИ органов малого таза", uz: "Kichik chanoq aʼzolari UZIsi" },
    ],
  },
  {
    id: "pediatrics",
    center: "kids",
    name: { ru: "Педиатрия", uz: "Pediatriya" },
    short: { ru: "Наблюдение с рождения, прививки", uz: "Tugʻilgandan kuzatuv, emlashlar" },
    location: { branch: "chilanzar", floor: 1 },
    services: [
      { ru: "Приём педиатра", uz: "Pediatr qabuli" },
      { ru: "Прививки по календарю", uz: "Taqvim boʻyicha emlashlar" },
      { ru: "Медкарта в садик и школу", uz: "Bogʻcha va maktab uchun tibbiy karta" },
    ],
  },
  {
    id: "kids-lor",
    center: "kids",
    name: { ru: "Детский ЛОР", uz: "Bolalar LOR" },
    short: { ru: "Уши, горло, нос, аденоиды", uz: "Quloq, tomoq, burun, adenoidlar" },
    location: { branch: "chilanzar", floor: 2 },
    services: [
      { ru: "Приём детского ЛОРа", uz: "Bolalar LOR shifokori qabuli" },
      { ru: "Промывание носа", uz: "Burunni yuvish" },
      { ru: "Эндоскопия носоглотки", uz: "Burun-halqum endoskopiyasi" },
    ],
  },
  {
    id: "ultrasound",
    center: "diagnostics",
    name: { ru: "УЗИ-диагностика", uz: "UZI diagnostikasi" },
    short: { ru: "Экспертные аппараты, запись без очереди", uz: "Ekspert apparatlar, navbatsiz yozilish" },
    location: { branch: "mirzo", floor: 2 },
    services: [
      { ru: "УЗИ брюшной полости", uz: "Qorin boʻshligʻi UZIsi" },
      { ru: "УЗИ почек", uz: "Buyraklar UZIsi" },
      { ru: "Допплер сосудов", uz: "Tomirlar doppleri" },
    ],
  },
  {
    id: "lab",
    center: "diagnostics",
    name: { ru: "Лаборатория", uz: "Laboratoriya" },
    short: { ru: "500+ анализов, результаты в личном кабинете", uz: "500+ tahlil, natijalar shaxsiy kabinetda" },
    location: { branch: "mirzo", floor: 1 },
    services: [
      { ru: "Общий анализ крови", uz: "Umumiy qon tahlili" },
      { ru: "Биохимия крови", uz: "Qon biokimyosi" },
      { ru: "Гормоны щитовидной железы", uz: "Qalqonsimon bez gormonlari" },
    ],
  },
  {
    id: "mri",
    center: "diagnostics",
    name: { ru: "МРТ и КТ", uz: "MRT va KT" },
    short: { ru: "Томография 1,5 Тл, заключение за 2 часа", uz: "1,5 Tl tomografiya, xulosa 2 soatda" },
    location: { branch: "mirzo", floor: 3 },
    services: [
      { ru: "МРТ головного мозга", uz: "Bosh miya MRTsi" },
      { ru: "МРТ позвоночника", uz: "Umurtqa pogʻonasi MRTsi" },
      { ru: "КТ лёгких", uz: "Oʻpka KTsi" },
    ],
  },
  {
    id: "surgery",
    center: "surgery",
    name: { ru: "Хирургия", uz: "Jarrohlik" },
    short: { ru: "Амбулаторные операции и перевязки", uz: "Ambulator operatsiyalar va bogʻlash" },
    location: { branch: "yunusabad", floor: 5 },
    services: [
      { ru: "Приём хирурга", uz: "Jarroh qabuli" },
      { ru: "Удаление новообразований", uz: "Oʻsmalarni olib tashlash" },
      { ru: "Перевязка", uz: "Bogʻlash" },
    ],
  },
  {
    id: "dentistry",
    center: "surgery",
    name: { ru: "Стоматология", uz: "Stomatologiya" },
    short: { ru: "Лечение, гигиена, имплантация", uz: "Davolash, gigiyena, implantatsiya" },
    location: { branch: "yunusabad", floor: 1 },
    services: [
      { ru: "Профгигиена", uz: "Professional gigiyena" },
      { ru: "Лечение кариеса", uz: "Kariesni davolash" },
      { ru: "Консультация имплантолога", uz: "Implantolog maslahati" },
    ],
  },
];

export type Lang = "ru" | "uz" | "en";

export interface Doctor {
  id: string;
  name: L;
  department: DepartmentId;
  title: L;
  experience: number;
  rating: number;
  languages: Lang[];
  branch: BranchId;
  price: number;
}

export const doctors: Doctor[] = [
  { id: "d1", name: { ru: "Дилноза Каримова", uz: "Dilnoza Karimova" }, department: "therapy", title: { ru: "Терапевт, высшая категория", uz: "Terapevt, oliy toifa" }, experience: 14, rating: 4.9, languages: ["ru", "uz"], branch: "yunusabad", price: 150000 },
  { id: "d2", name: { ru: "Азиз Рахимов", uz: "Aziz Rahimov" }, department: "therapy", title: { ru: "Терапевт", uz: "Terapevt" }, experience: 7, rating: 4.7, languages: ["uz", "ru", "en"], branch: "yunusabad", price: 120000 },
  { id: "d3", name: { ru: "Шерзод Ахмедов", uz: "Sherzod Ahmedov" }, department: "cardiology", title: { ru: "Кардиолог, к.м.н.", uz: "Kardiolog, t.f.n." }, experience: 18, rating: 5.0, languages: ["ru", "uz"], branch: "yunusabad", price: 250000 },
  { id: "d4", name: { ru: "Елена Ким", uz: "Yelena Kim" }, department: "cardiology", title: { ru: "Кардиолог", uz: "Kardiolog" }, experience: 9, rating: 4.8, languages: ["ru", "en"], branch: "yunusabad", price: 200000 },
  { id: "d5", name: { ru: "Нигора Абдуллаева", uz: "Nigora Abdullayeva" }, department: "neurology", title: { ru: "Невролог", uz: "Nevrolog" }, experience: 11, rating: 4.9, languages: ["uz", "ru"], branch: "yunusabad", price: 200000 },
  { id: "d6", name: { ru: "Бахтиёр Турсунов", uz: "Baxtiyor Tursunov" }, department: "endocrinology", title: { ru: "Эндокринолог", uz: "Endokrinolog" }, experience: 12, rating: 4.8, languages: ["uz", "ru"], branch: "yunusabad", price: 200000 },
  { id: "d7", name: { ru: "Гульноза Мирзаева", uz: "Gulnoza Mirzayeva" }, department: "gynecology", title: { ru: "Гинеколог, высшая категория", uz: "Ginekolog, oliy toifa" }, experience: 16, rating: 4.9, languages: ["uz", "ru"], branch: "yunusabad", price: 220000 },
  { id: "d8", name: { ru: "Мадина Юсупова", uz: "Madina Yusupova" }, department: "pediatrics", title: { ru: "Педиатр", uz: "Pediatr" }, experience: 10, rating: 5.0, languages: ["uz", "ru"], branch: "chilanzar", price: 150000 },
  { id: "d9", name: { ru: "Ойбек Назаров", uz: "Oybek Nazarov" }, department: "pediatrics", title: { ru: "Педиатр, неонатолог", uz: "Pediatr, neonatolog" }, experience: 8, rating: 4.8, languages: ["uz", "ru", "en"], branch: "chilanzar", price: 150000 },
  { id: "d10", name: { ru: "Севара Исмоилова", uz: "Sevara Ismoilova" }, department: "kids-lor", title: { ru: "Детский оториноларинголог", uz: "Bolalar otorinolaringologi" }, experience: 13, rating: 4.9, languages: ["uz", "ru"], branch: "chilanzar", price: 180000 },
  { id: "d11", name: { ru: "Рустам Хайдаров", uz: "Rustam Haydarov" }, department: "ultrasound", title: { ru: "Врач УЗИ-диагностики", uz: "UZI diagnostikasi shifokori" }, experience: 15, rating: 4.9, languages: ["uz", "ru"], branch: "mirzo", price: 160000 },
  { id: "d12", name: { ru: "Феруза Холматова", uz: "Feruza Xolmatova" }, department: "lab", title: { ru: "Врач клинической лаборатории", uz: "Klinik laboratoriya shifokori" }, experience: 9, rating: 4.7, languages: ["uz", "ru"], branch: "mirzo", price: 100000 },
  { id: "d13", name: { ru: "Тимур Салимов", uz: "Timur Salimov" }, department: "mri", title: { ru: "Рентгенолог", uz: "Rentgenolog" }, experience: 12, rating: 4.8, languages: ["ru", "uz", "en"], branch: "mirzo", price: 300000 },
  { id: "d14", name: { ru: "Жасур Эргашев", uz: "Jasur Ergashev" }, department: "surgery", title: { ru: "Хирург", uz: "Jarroh" }, experience: 17, rating: 4.9, languages: ["uz", "ru"], branch: "yunusabad", price: 220000 },
  { id: "d15", name: { ru: "Лола Усмонова", uz: "Lola Usmonova" }, department: "dentistry", title: { ru: "Стоматолог-терапевт", uz: "Stomatolog-terapevt" }, experience: 6, rating: 4.8, languages: ["uz", "ru"], branch: "yunusabad", price: 150000 },
  { id: "d16", name: { ru: "Анвар Саидов", uz: "Anvar Saidov" }, department: "dentistry", title: { ru: "Хирург-имплантолог", uz: "Jarroh-implantolog" }, experience: 20, rating: 5.0, languages: ["uz", "ru", "en"], branch: "yunusabad", price: 250000 },
];

export interface PriceItem {
  name: L;
  price: number;
  /** Отделение, к которому относится услуга: по нему фильтр в прайсе */
  department: DepartmentId;
}

export const priceList: PriceItem[] = [
  { name: { ru: "Приём терапевта", uz: "Terapevt qabuli" }, price: 150000, department: "therapy" },
  { name: { ru: "Вызов терапевта на дом", uz: "Terapevtni uyga chaqirish" }, price: 350000, department: "therapy" },
  { name: { ru: "Приём кардиолога", uz: "Kardiolog qabuli" }, price: 250000, department: "cardiology" },
  { name: { ru: "ЭКГ с расшифровкой", uz: "EKG va tavsifi" }, price: 80000, department: "cardiology" },
  { name: { ru: "Суточный холтер ЭКГ", uz: "Sutkalik xolter EKG" }, price: 450000, department: "cardiology" },
  { name: { ru: "Приём невролога", uz: "Nevrolog qabuli" }, price: 200000, department: "neurology" },
  { name: { ru: "Приём эндокринолога", uz: "Endokrinolog qabuli" }, price: 200000, department: "endocrinology" },
  { name: { ru: "Приём гинеколога", uz: "Ginekolog qabuli" }, price: 220000, department: "gynecology" },
  { name: { ru: "Ведение беременности (месяц)", uz: "Homiladorlikni kuzatish (oy)" }, price: 900000, department: "gynecology" },
  { name: { ru: "Приём педиатра", uz: "Pediatr qabuli" }, price: 150000, department: "pediatrics" },
  { name: { ru: "Вакцинация (без стоимости вакцины)", uz: "Emlash (vaksina narxisiz)" }, price: 60000, department: "pediatrics" },
  { name: { ru: "Приём детского ЛОРа", uz: "Bolalar LOR qabuli" }, price: 180000, department: "kids-lor" },
  { name: { ru: "УЗИ брюшной полости", uz: "Qorin boʻshligʻi UZIsi" }, price: 160000, department: "ultrasound" },
  { name: { ru: "УЗИ щитовидной железы", uz: "Qalqonsimon bez UZIsi" }, price: 120000, department: "ultrasound" },
  { name: { ru: "Допплер сосудов шеи", uz: "Boʻyin tomirlari doppleri" }, price: 220000, department: "ultrasound" },
  { name: { ru: "Общий анализ крови", uz: "Umumiy qon tahlili" }, price: 45000, department: "lab" },
  { name: { ru: "Биохимия крови (10 показателей)", uz: "Qon biokimyosi (10 koʻrsatkich)" }, price: 190000, department: "lab" },
  { name: { ru: "ТТГ, Т3, Т4", uz: "TTG, T3, T4" }, price: 210000, department: "lab" },
  { name: { ru: "Витамин D", uz: "D vitamini" }, price: 150000, department: "lab" },
  { name: { ru: "МРТ головного мозга", uz: "Bosh miya MRTsi" }, price: 900000, department: "mri" },
  { name: { ru: "МРТ одного отдела позвоночника", uz: "Umurtqa pogʻonasining bir boʻlimi MRTsi" }, price: 850000, department: "mri" },
  { name: { ru: "КТ органов грудной клетки", uz: "Koʻkrak qafasi aʼzolari KTsi" }, price: 600000, department: "mri" },
  { name: { ru: "Приём хирурга", uz: "Jarroh qabuli" }, price: 220000, department: "surgery" },
  { name: { ru: "Профессиональная гигиена полости рта", uz: "Ogʻiz boʻshligʻi professional gigiyenasi" }, price: 400000, department: "dentistry" },
  { name: { ru: "Лечение кариеса (1 зуб)", uz: "Kariesni davolash (1 tish)" }, price: 500000, department: "dentistry" },
];

export interface Checkup {
  id: string;
  name: L;
  forWhom: L;
  duration: L;
  price: number;
  oldPrice: number;
  items: L[];
  featured?: boolean;
}

export const checkups: Checkup[] = [
  {
    id: "basic",
    name: { ru: "Базовый", uz: "Asosiy" },
    forWhom: { ru: "Раз в год для всех взрослых", uz: "Barcha kattalar uchun yiliga bir marta" },
    duration: { ru: "2 часа", uz: "2 soat" },
    price: 690000,
    oldPrice: 860000,
    items: [
      { ru: "Приём терапевта", uz: "Terapevt qabuli" },
      { ru: "Общий анализ крови и мочи", uz: "Qon va siydikning umumiy tahlili" },
      { ru: "Биохимия крови", uz: "Qon biokimyosi" },
      { ru: "ЭКГ", uz: "EKG" },
      { ru: "УЗИ брюшной полости", uz: "Qorin boʻshligʻi UZIsi" },
    ],
  },
  {
    id: "heart",
    name: { ru: "Сердце и сосуды", uz: "Yurak va qon tomirlari" },
    forWhom: { ru: "После 40 лет и при давлении", uz: "40 yoshdan keyin va qon bosimida" },
    duration: { ru: "3 часа", uz: "3 soat" },
    price: 1290000,
    oldPrice: 1600000,
    featured: true,
    items: [
      { ru: "Приём кардиолога", uz: "Kardiolog qabuli" },
      { ru: "ЭКГ и эхокардиография", uz: "EKG va exokardiografiya" },
      { ru: "Допплер сосудов шеи", uz: "Boʻyin tomirlari doppleri" },
      { ru: "Липидный профиль", uz: "Lipid profili" },
      { ru: "Суточный холтер", uz: "Sutkalik xolter" },
    ],
  },
  {
    id: "women",
    name: { ru: "Женское здоровье", uz: "Ayollar salomatligi" },
    forWhom: { ru: "Ежегодный осмотр для женщин", uz: "Ayollar uchun yillik koʻrik" },
    duration: { ru: "2,5 часа", uz: "2,5 soat" },
    price: 1090000,
    oldPrice: 1350000,
    items: [
      { ru: "Приём гинеколога", uz: "Ginekolog qabuli" },
      { ru: "УЗИ органов малого таза", uz: "Kichik chanoq aʼzolari UZIsi" },
      { ru: "УЗИ молочных желёз", uz: "Sut bezlari UZIsi" },
      { ru: "Гормоны щитовидной железы", uz: "Qalqonsimon bez gormonlari" },
      { ru: "Общий анализ крови", uz: "Umumiy qon tahlili" },
    ],
  },
  {
    id: "kids",
    name: { ru: "Детский перед школой", uz: "Maktab oldidan bolalar uchun" },
    forWhom: { ru: "Для детей 6–7 лет, все справки", uz: "6–7 yoshli bolalar uchun, barcha maʼlumotnomalar" },
    duration: { ru: "1,5 часа", uz: "1,5 soat" },
    price: 590000,
    oldPrice: 720000,
    items: [
      { ru: "Приём педиатра", uz: "Pediatr qabuli" },
      { ru: "ЛОР, окулист, невролог", uz: "LOR, okulist, nevrolog" },
      { ru: "Общий анализ крови", uz: "Umumiy qon tahlili" },
      { ru: "Медкарта для школы", uz: "Maktab uchun tibbiy karta" },
    ],
  },
];

export const faq: { q: L; a: L }[] = [
  {
    q: { ru: "Как получить результаты анализов?", uz: "Tahlil natijalarini qanday olaman?" },
    a: {
      ru: "Результаты приходят в личный кабинет и в Telegram-бот клиники — обычно в тот же день. Распечатать можно на ресепшене любого филиала.",
      uz: "Natijalar shaxsiy kabinetga va klinikaning Telegram-botiga keladi — odatda oʻsha kuni. Istalgan filial qabulxonasida chop etib olish mumkin.",
    },
  },
  {
    q: { ru: "Работаете ли вы со страховыми компаниями?", uz: "Sugʻurta kompaniyalari bilan ishlaysizmi?" },
    a: {
      ru: "Да, принимаем полисы ДМС. Перед визитом уточните у администратора, входит ли услуга в вашу программу.",
      uz: "Ha, ixtiyoriy tibbiy sugʻurta polislarini qabul qilamiz. Tashrifdan oldin xizmat dasturingizga kirishini administratordan aniqlang.",
    },
  },
  {
    q: { ru: "Можно ли перенести или отменить запись?", uz: "Yozilishni koʻchirish yoki bekor qilish mumkinmi?" },
    a: {
      ru: "Да, в один клик по ссылке из SMS или в Telegram-боте — не позже чем за 2 часа до приёма.",
      uz: "Ha, SMSdagi havola yoki Telegram-bot orqali bir bosishda — qabuldan kamida 2 soat oldin.",
    },
  },
  {
    q: { ru: "Как подготовиться к УЗИ брюшной полости?", uz: "Qorin boʻshligʻi UZIsiga qanday tayyorlanish kerak?" },
    a: {
      ru: "Не есть 6–8 часов до исследования, за день исключить газированные напитки. Подробная памятка придёт после записи.",
      uz: "Tekshiruvdan 6–8 soat oldin ovqatlanmang, bir kun oldin gazli ichimliklarni chiqarib tashlang. Batafsil eslatma yozilgandan keyin keladi.",
    },
  },
];

export const departmentById = (id: DepartmentId) => departments.find((d) => d.id === id)!;
export const branchById = (id: BranchId) => branches.find((b) => b.id === id)!;
