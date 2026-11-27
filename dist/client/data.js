'use strict';
window.CW_DATA = {
  categories: [
    {id:'all',ru:'Все проекты',uz:'Barcha loyihalar'},
    {id:'outdoor',ru:'Вывески и неон',uz:'Peshlavha va neon'},
    {id:'retail',ru:'POSM и ритейл',uz:'POSM va savdo'},
    {id:'spaces',ru:'Пространства',uz:'Makonlar'},
    {id:'transport',ru:'Транспорт',uz:'Transport'}
  ],
  projects: [
    {id:'chodir',name:'CHODIR',category:'outdoor',image:'chodir.webp',service:'letters',subtitle:{ru:'Световые объёмные буквы',uz:'Hajmli yoritilgan harflar'},description:{ru:'Контрастная световая вывеска на фактурной стене. Объёмный знак и буквы создают выразительный акцент и помогают бренду оставаться заметным в пространстве.',uz:'Teksturali devordagi yorqin peshlavha. Hajmli belgi va harflar makonda ifodali urg‘u yaratib, brendning ko‘zga tashlanishiga yordam beradi.'},
      brands: ["CHODIR"],
      gallery: [
        {image: "samarkand.webp",
          brands: ["SAMAR Developers"],
          related: true,
          subtitle: {"ru": "Объёмные буквы для интерьера", "en": "Interior 3D lettering", "uz": "Interyer uchun hajmli harflar"},
          description: {"ru": "Белые объёмные буквы и фирменный знак на стене с вертикальными деревянными рейками.", "en": "White dimensional letters and a brand mark mounted on a wall of vertical wooden slats.", "uz": "Vertikal yog‘och reykali devorga o‘rnatilgan oq hajmli harflar va firma belgisi."}
        },
        {image: "silkway.webp",
          brands: ["Silkway Health Technology"],
          related: true,
          subtitle: {"ru": "Логотип на зелёной стене", "en": "Logo on a green wall", "uz": "Yashil devordagi logotip"},
          description: {"ru": "Золотистые буквы и знак на фоне зелени. Подсветка выделяет логотип среди листьев.", "en": "Gold-toned letters and a symbol set against foliage. Lighting makes the logo stand out among the leaves.", "uz": "Yashil barglar fonidagi oltin tusli harflar va belgi. Yoritish logotipni barglar orasidan ajratib ko‘rsatadi."}
        }
      ]
    },
    {id:'coca-cola',name:'Coca-Cola',category:'retail',image:'coca-cola.webp',service:'posm',subtitle:{ru:'Брендированное торговое оборудование',uz:'Brendlangan savdo jihozi'},description:{ru:'Фигурная торговая конструкция в фирменном красном цвете. Узнаваемая графика, открытые полки и объёмная форма объединены в одном POS-решении.',uz:'Brendning qizil rangidagi shakldor savdo konstruksiyasi. Tanish grafika, ochiq javonlar va hajmli shakl bitta POS-yechimda birlashtirilgan.'},
      brands: ['Coca-Cola'],
      gallery: [
        {image: "coca-cola-full.webp",
          description: {"ru": "Стойка целиком. Видны круглое основание, открытые полки и рекламная панель над ними.", "en": "The full display shows its round base, open shelves and overhead advertising panel.", "uz": "Stendning to‘liq ko‘rinishida dumaloq taglik, ochiq javonlar va yuqoridagi reklama paneli ko‘rinadi."}
        },
        {image: "coca-cola-display-series.webp",
          description: {"ru": "Серия красно-белых стоек с фигурными боковинами и круглыми панелями с логотипом Coca-Cola.", "en": "A series of red-and-white displays with sculpted sides and round Coca-Cola logo panels.", "uz": "Shakldor yon qismlar va Coca-Cola logotipli dumaloq panellarga ega qizil-oq stendlar turkumi."}
        }
      ]
    },
    {id:'pepsi',name:'Pepsi',category:'spaces',image:'pepsi.webp',service:'complex',subtitle:{ru:'Праздничная инсталляция',uz:'Bayram installyatsiyasi'},description:{ru:'Объёмная праздничная композиция с подсветкой и символикой Pepsi. Крупный формат превращает бренд в часть городской среды и создаёт место для фотографий.',uz:'Pepsi ramzlari va yoritish bilan yaratilgan hajmli bayram kompozitsiyasi. Katta format brendni shahar muhitining bir qismiga va suratga tushish joyiga aylantiradi.'},
      brands: ["Pepsi"],
      gallery: [
        {image: "pepsi-2026-display.webp",
          subtitle: {"ru": "Новогоднее оформление", "en": "New Year display", "uz": "Yangi yil bezagi"},
          description: {"ru": "Синяя уличная конструкция с праздничной графикой Pepsi, цифрами 2026 и еловыми гирляндами.", "en": "A blue outdoor structure with festive Pepsi graphics, 2026 lettering and fir garlands.", "uz": "Pepsi bayram grafikasi, 2026 raqamlari va archa girlyandalari bilan bezatilgan ko‘k tashqi konstruksiya."}
        },
        {image: "pepsi-oasis.webp",
          brands: ["Pepsi Oasis"],
          related: true,
          subtitle: {"ru": "Уличный павильон с подсветкой", "en": "Illuminated outdoor pavilion", "uz": "Yoritilgan ochiq pavilyon"},
          description: {"ru": "Павильон с синими арками, орнаментом и световой вывеской над зоной отдыха.", "en": "A pavilion with blue arches, ornamental panels and an illuminated sign above the seating area.", "uz": "Ko‘k arkalar, naqshli panellar va dam olish joyi ustidagi yoritilgan peshlavhali pavilyon."}
        }
      ]
    },
    {id:'adrenaline',name:'Adrenaline Rush',category:'outdoor',image:'adrenaline.webp',service:'outdoor',subtitle:{ru:'Фасадная световая вывеска',uz:'Fasad uchun yoritilgan peshlavha'},description:{ru:'Крупные объёмные буквы и световые элементы на фасаде. Контраст тёмной основы и белого логотипа делает оформление читаемым и выразительным.',uz:'Fasaddagi yirik hajmli harflar va yorug‘lik elementlari. To‘q asos hamda oq logotip uyg‘unligi bezakni o‘qilishi oson va ifodali qiladi.'},
      brands: ["Adrenaline Rush"],
      gallery: [
        {image: "bovard-sign.webp",
          brands: ["BOVARD"],
          related: true,
          subtitle: {"ru": "Фасадная вывеска", "en": "Facade sign", "uz": "Fasad peshlavhasi"},
          description: {"ru": "Белые объёмные буквы и знак на синей панели над витриной. Логотип повторяется на стекле.", "en": "White dimensional letters and a symbol on a blue panel above the storefront. The logo is repeated on the glass.", "uz": "Vitrina ustidagi ko‘k panelda oq hajmli harflar va belgi. Logotip oynada ham takrorlangan."}
        },
        {image: "lola-original.webp",
          brands: ["Lola"],
          related: true,
          subtitle: {"ru": "Вывеска салона красоты", "en": "Beauty salon sign", "uz": "Go‘zallik saloni peshlavhasi"},
          description: {"ru": "Фигурное название и красные объёмные буквы на тёмной фасадной панели над входом в салон.", "en": "A script logo and red dimensional letters on a dark facade panel above the salon entrance.", "uz": "Salon kirish qismi ustidagi to‘q panelda bezakli nom va qizil hajmli harflar."}
        }
      ]
    },
    {id:'exhibition',name:{ru:'Пространство бренда',uz:'Brend makoni'},category:'spaces',image:'exhibition.webp',service:'exhibition',subtitle:{ru:'Выставочный стенд',uz:'Ko‘rgazma stendi'},description:{ru:'Выставочное пространство с открытой планировкой, графическими панелями и зоной для встреч. Единая конструкция объединяет презентацию бренда и общение с посетителями.',uz:'Ochiq reja, grafik panellar va uchrashuv joyiga ega ko‘rgazma makoni. Yagona konstruksiya brend taqdimoti va tashrif buyuruvchilar bilan muloqotni birlashtiradi.'},
      brands: ["Royal Agro", "Hektaş", "FNC Tarım"],
      gallery: [
        {image: "exhibition-side-view.webp",
          description: {"ru": "С бокового ракурса видны открытый вход, стойка регистрации и витрины с продукцией участников.", "en": "The side view shows the open entrance, reception counter and display shelves for the exhibitors’ products.", "uz": "Yon tomondan ochiq kirish qismi, qabul peshtaxtasi va ishtirokchilar mahsulotlari uchun vitrinalar ko‘rinadi."}
        },
        {image: "graduation-entrance.webp",
          brands: ["Inha University in Tashkent"],
          related: true,
          subtitle: {"ru": "Входная арка для выпускного", "en": "Graduation entrance arch", "uz": "Bitiruv marosimi uchun kirish arkasi"},
          description: {"ru": "Синяя арка с символикой университета и надписью Graduation Ceremony оформляет вход на выпускной.", "en": "A blue arch with university branding and the words Graduation Ceremony marks the entrance to the event.", "uz": "Universitet ramzlari va Graduation Ceremony yozuvi tushirilgan ko‘k arka bitiruv marosimiga kirish qismini bezatadi."}
        }
      ]
    },
    {id:'neon-bear',name:'Neon character',category:'outdoor',image:'neon-bear.webp',service:'letters',subtitle:{ru:'Фигурный неон для интерьера',uz:'Interyer uchun shakldor neon'},description:{ru:'Графичный персонаж, нарисованный светом. Неон повторяет контуры фигуры и добавляет интерьеру яркую деталь, которая хорошо работает и вживую, и в кадре.',uz:'Yorug‘lik bilan chizilgan grafik qahramon. Neon shakl konturlarini takrorlaydi va interyerga hayotda ham, kadrda ham yorqin ko‘rinadigan detal qo‘shadi.'},
      gallery: [
        {image: "neon-pnx.webp",
          related: true,
          subtitle: {"ru": "Двухцветная неоновая фигура", "en": "Two-colour neon figure", "uz": "Ikki rangli neon shakl"},
          description: {"ru": "Красный контур и холодное белое свечение выделяют фигуру на тёмной стене.", "en": "A red outline and cool white light make the figure stand out against the dark wall.", "uz": "Qizil kontur va sovuq oq nur shaklni to‘q devor fonida ajratib ko‘rsatadi."}
        },
        {image: "neon-mug.webp",
          related: true,
          subtitle: {"ru": "Неоновая кружка", "en": "Neon mug", "uz": "Neon krujka"},
          description: {"ru": "Белый световой контур кружки закреплён на прозрачной основе.", "en": "A white illuminated mug outline mounted on a clear backing.", "uz": "Krujkaning oq yoritilgan konturi shaffof asosga mahkamlangan."}
        }
      ]
    },
    {id:'vitros',name:'VITROS',category:'transport',image:'vitros.webp',service:'transport',subtitle:{ru:'Брендирование автомобиля',uz:'Avtomobilni brendlash'},description:{ru:'Фирменная графика на кузове автомобиля VITROS. Цветовые блоки, логотип и информация о бренде превращают повседневные поездки в визуальный контакт с аудиторией.',uz:'VITROS avtomobili kuzovidagi brend grafikasi. Rang bloklari, logotip va ma’lumotlar kundalik qatnovlarni auditoriya bilan vizual aloqaga aylantiradi.'},
      brands: ["VITROS"],
      gallery: [
        {image: "transport-vitros-front.webp",
          description: {"ru": "Передний и боковой ракурс бело-красного автомобиля. Фирменная графика проходит вдоль кузова.", "en": "The front and side view shows how the red-and-white brand graphics run along the vehicle.", "uz": "Old va yon tomondan qizil-oq firma grafikasi avtomobil kuzovi bo‘ylab joylashgani ko‘rinadi."}
        },
        {image: "transport-home-cleaning.webp",
          brands: ["Home Cleaning"],
          related: true,
          description: {"ru": "Синие и белые элементы оклейки, логотип и информация об услугах на кузове автомобиля.", "en": "Blue-and-white wrap graphics, a logo and service information on the vehicle body.", "uz": "Avtomobil kuzovida ko‘k-oq qoplama, logotip va xizmatlar haqida ma’lumot."}
        }
      ]
    },
    {id:'mountain-dew',name:'Mountain Dew',category:'retail',image:'mountain-dew.webp',service:'posm',subtitle:{ru:'Объёмная бренд-инсталляция',uz:'Hajmli brend installyatsiyasi'},description:{ru:'Увеличенная банка Mountain Dew в окружении цветной подсветки. Объём, масштаб и свет формируют выразительную точку внимания в интерьере.',uz:'Rangli yoritish bilan o‘ralgan ulkan Mountain Dew bankasi. Hajm, o‘lcham va yorug‘lik interyerda e’tiborni jalb qiluvchi nuqta yaratadi.'},
      brands: ['Mountain Dew'],
      gallery: [
        {image: "mountain-dew-side.webp",
          description: {"ru": "Объёмная банка на подиуме с бокового ракурса. Цветная подсветка подчёркивает форму и фирменную графику.", "en": "A side view of the oversized can on its plinth. Coloured lighting highlights the shape and brand graphics.", "uz": "Taglikdagi katta banka yon tomondan ko‘rinadi. Rangli yoritish shakl va firma grafikasini ajratib ko‘rsatadi."}
        }
      ]
    },
    {id:'aker',name:'AKER',category:'outdoor',image:'aker.webp',service:'letters',subtitle:{ru:'Световая вывеска магазина',uz:'Do‘kon uchun yoritilgan peshlavha'},description:{ru:'Объёмные буквы с тёплым свечением над входом в магазин. Лаконичная композиция дополняет витрину и подчёркивает характер бренда.',uz:'Do‘kon kirish qismidagi iliq nur taratuvchi hajmli harflar. Ixcham kompozitsiya vitrinani to‘ldirib, brend xarakterini ta’kidlaydi.'},
      brands: ["AKER"],
      gallery: [
        {image: "savdogar-bank-sign.webp",
          brands: ["Savdogar Bank"],
          related: true,
          subtitle: {"ru": "Интерьерная вывеска с подсветкой", "en": "Illuminated interior sign", "uz": "Yoritilgan interyer peshlavhasi"},
          description: {"ru": "Зеркальные золотистые буквы на светлой панели. Белая подсветка выделяет контуры букв и знака.", "en": "Mirrored gold-toned letters on a light panel. White lighting picks out the contours of the letters and symbol.", "uz": "Och rangli panelda yaltiroq oltin tusli harflar. Oq yoritish harflar va belgi konturini ajratib ko‘rsatadi."}
        },
        {image: "sparkle-sign.webp",
          brands: ["Sparkle Beauty Bar"],
          related: true,
          subtitle: {"ru": "Световая вывеска салона", "en": "Illuminated salon sign", "uz": "Salon uchun yoritilgan peshlavha"},
          description: {"ru": "Зеркальные объёмные буквы со светлыми гранями над узкой панелью с надписью beauty bar.", "en": "Mirrored dimensional letters with illuminated edges over a narrow panel reading beauty bar.", "uz": "Yoritilgan qirrali yaltiroq hajmli harflar beauty bar yozuvi tushirilgan ingichka panel ustida joylashgan."}
        }
      ]
    },
    {id:'wayfinding',name:{ru:'Навигация в деталях',uz:'Detallardagi navigatsiya'},category:'spaces',image:'wayfinding.webp',service:'complex',subtitle:{ru:'Интерьерные таблички',uz:'Interyer lavhalari'},description:{ru:'Система лаконичных информационных табличек для помещений. Единая типографика, пиктограммы и материалы помогают посетителям ориентироваться в пространстве.',uz:'Xonalar uchun ixcham axborot lavhalari tizimi. Yagona tipografika, piktogrammalar va materiallar tashrif buyuruvchilarga yo‘l topishda yordam beradi.'},
      brands: ['Rauza Hotel'],
      gallery: [
        {image: "print-office-signs.webp",
          description: {"ru": "Общий вид табличек у входов. Назначение помещений и ограничения доступа обозначены контрастным текстом.", "en": "A wider view of the signs by the doors. High-contrast text identifies rooms and access restrictions.", "uz": "Kirish joylaridagi lavhalarning umumiy ko‘rinishi. Xonalar vazifasi va kirish cheklovlari kontrastli matn bilan belgilangan."}
        },
        {image: "print-door-labels.webp",
          description: {"ru": "Таблички в санузле с пиктограммами, стрелками и подписями на узбекском и английском.", "en": "Restroom signs with pictograms, arrows and labels in Uzbek and English.", "uz": "Sanuzeldagi piktogrammali, strelkali hamda o‘zbek va ingliz tillaridagi yozuvli lavhalar."}
        }
      ]
    },
    {id:'furniture',name:{ru:'Функциональная форма',uz:'Funksional shakl'},category:'spaces',image:'furniture.webp',service:'furniture',subtitle:{ru:'Мебель для коммерческого интерьера',uz:'Tijorat interyeri uchun mebel'},description:{ru:'Индивидуальная мебельная композиция со стойкой и открытыми секциями хранения. Спокойная палитра и простые линии организуют рабочее пространство.',uz:'Peshtaxta va ochiq saqlash bo‘limlari bilan yaratilgan mebel kompozitsiyasi. Sokin ranglar va oddiy chiziqlar ish makonini tartibga soladi.'},
      gallery: [
        {image: "furniture-workspace.webp",
          description: {"ru": "Стойка со стороны рабочего места. Под столешницей расположены открытые секции и тумба с ящиком.", "en": "The counter from the working side, with open compartments and a drawer unit under the worktop.", "uz": "Peshtaxtaning ish tomoni. Stol yuzasi ostida ochiq bo‘limlar va tortmali tumba joylashgan."}
        },
        {image: "furniture-counter-side.webp",
          description: {"ru": "Боковой ракурс стойки показывает длинную столешницу и приподнятую секцию с полками.", "en": "A side view shows the long worktop and the raised shelving section.", "uz": "Yon rakursda peshtaxtaning uzun stol yuzasi va balandroq javonli bo‘lim ko‘rinadi."}
        }
      ]
    },
    {id:'doshirak',name:{ru:'Доширак',uz:'Doshirak'},category:'retail',image:'doshirak.webp',service:'posm',subtitle:{ru:'Стойка для выкладки продукции',uz:'Mahsulot joylashtirish stendi'},description:{ru:'Зелёная брендированная стойка с открытыми полками и фигурными боковинами. Торговое оборудование, в котором форма поддерживает узнаваемость продукта.',uz:'Ochiq javonlar va shakldor yon qismlari bor yashil brend stendi. Mahsulotning tanilishiga xizmat qiluvchi savdo jihozi.'},
      brands: ['Доширак'],
      gallery: [
        {image: "doshirak-display-side.webp",
          description: {"ru": "Стойка в три четверти. В этом ракурсе видны глубина полок и фирменная графика на боковой панели.", "en": "A three-quarter view shows the shelf depth and the branding on the side panel.", "uz": "Uch chorak rakursdan javonlarning chuqurligi va yon paneldagi firma grafikasi ko‘rinadi."}
        }
      ]
    }
  ],
  services: [
    {id:'outdoor',image:'adrenaline.webp',title:{ru:'Наружная реклама',uz:'Tashqi reklama'},description:{ru:'Вывески, световые короба, крышные установки и городские рекламные конструкции. Продумываем внешний вид и конструктив под место размещения.',uz:'Peshlavhalar, yorug‘lik qutilari, tom usti va shahar reklama konstruksiyalari. Tashqi ko‘rinish va tuzilishni joylashuvga moslaymiz.'},tags:{ru:['Фасады','Световые короба','City-форматы'],uz:['Fasadlar','Yorug‘lik qutilari','City-formatlar']}},
    {id:'letters',image:'chodir.webp',title:{ru:'Объёмные буквы и неон',uz:'Hajmli harflar va neon'},description:{ru:'Буквы, логотипы и световые фигуры для фасадов и интерьеров. Работаем с акрилом, металлом, пластиком и гибким неоном.',uz:'Fasad va interyerlar uchun harflar, logotiplar va yorug‘lik shakllari. Akril, metall, plastik va egiluvchan neon bilan ishlaymiz.'},tags:{ru:['Объёмные буквы','LED-неон','Логотипы'],uz:['Hajmli harflar','LED-neon','Logotiplar']}},
    {id:'transport',image:'vitros.webp',title:{ru:'Брендирование транспорта',uz:'Transportni brendlash'},description:{ru:'Полная и частичная оклейка автомобилей, грузового и корпоративного транспорта. Адаптируем фирменную графику к геометрии кузова.',uz:'Yengil, yuk va korporativ transportni to‘liq yoki qisman qoplash. Brend grafikasini kuzov geometriyasiga moslaymiz.'},tags:{ru:['Оклейка авто','Корпоративный транспорт'],uz:['Avtomobil qoplamasi','Korporativ transport']}},
    {id:'posm',image:'coca-cola.webp',title:{ru:'POSM и торговое оборудование',uz:'POSM va savdo jihozlari'},description:{ru:'Стойки, дисплеи, промозоны и объёмные фигуры для торговых пространств. Помогаем выделить продукт там, где принимают решение о покупке.',uz:'Savdo makonlari uchun stendlar, displeylar, promo-zonalar va hajmli shakllar. Xarid qarori qabul qilinadigan joyda mahsulotni ajratib ko‘rsatamiz.'},tags:{ru:['Торговые стойки','Дисплеи','3D-фигуры'],uz:['Savdo stendlari','Displeylar','3D-shakllar']}},
    {id:'print',image:'wayfinding.webp',title:{ru:'Печать и полиграфия',uz:'Chop etish va poligrafiya'},description:{ru:'Широкоформатная и УФ-печать, рекламная полиграфия. От баннеров и наклеек до каталогов, меню и фирменных материалов.',uz:'Keng formatli va UV-bosma, reklama poligrafiyasi. Banner va stikerlardan katalog, menyu va firma materiallarigacha.'},tags:{ru:['УФ-печать','Баннеры','Полиграфия'],uz:['UV-bosma','Bannerlar','Poligrafiya']}},
    {id:'exhibition',image:'exhibition.webp',title:{ru:'Выставочные стенды',uz:'Ko‘rgazma stendlari'},description:{ru:'Индивидуальные, модульные и мобильные стенды для выставок и презентаций. Объединяем конструкцию, графику и функциональные зоны.',uz:'Ko‘rgazma va taqdimotlar uchun individual, modulli va mobil stendlar. Konstruksiya, grafika va funksional zonalarni birlashtiramiz.'},tags:{ru:['Выставки','Презентации','Промозоны'],uz:['Ko‘rgazmalar','Taqdimotlar','Promo-zonalar']}},
    {id:'complex',image:'silkway.webp',title:{ru:'Комплексное оформление',uz:'Kompleks bezatish'},description:{ru:'Фасады, витрины, интерьерная реклама и навигация в едином стиле. Формируем целостное визуальное присутствие вашего бренда.',uz:'Fasad, vitrina, interyer reklamasi va navigatsiya yagona uslubda. Brendingizning yaxlit vizual qiyofasini yaratamiz.'},tags:{ru:['Ритейл','Офисы','HoReCa'],uz:['Savdo','Ofislar','HoReCa']}},
    {id:'furniture',image:'furniture.webp',title:{ru:'Мебель и металлоконструкции',uz:'Mebel va metall konstruksiyalar'},description:{ru:'Индивидуальная мебель, стойки ресепшн, витрины и металлические конструкции. Проектируем изделия под размеры и задачи вашего пространства.',uz:'Individual mebel, resepshn peshtaxtalari, vitrinalar va metall konstruksiyalar. Buyumlarni makoningiz o‘lchami va vazifalariga mos loyihalaymiz.'},tags:{ru:['Мебель на заказ','Ресепшн','Металлоконструкции'],uz:['Buyurtma mebel','Resepshn','Metall konstruksiyalar']}}
  ],
  ru: {navOrder:'Заказать',aboutPageTitle:'О нас.',aboutPageIntro:'Люди, идеи и производство, которые помогают брендам стать заметнее.',aboutPageCtaTitle:'Создадим что-то заметное?',aboutPageCtaText:'Выберите изделие, создайте макет и отправьте заказ менеджеру.',teamEyebrow:'ЛЮДИ COLOURWAY / 08',teamTitle:'Знакомьтесь, команда.',teamNote:'От первого разговора до монтажа — рядом специалисты, которые знают своё дело.',roleArtDirector:'Арт-директор',roleSalesDirector:'Директор по продажам',roleProjectManager:'Менеджер проектов',role3dDesigner:'3D-дизайнер',roleDesigner:'Дизайнер',roleCrmSpecialist:'CRM-специалист',briefContact:'Телефон или @Telegram',contactPlaceholder:'+998 90 123 45 67 или @username',summaryContact:'Контакт',sendLead:'Отправить заявку',sendingLead:'Отправляем заявку…',leadSent:'Заявка отправлена менеджеру. Мы свяжемся с вами по указанному контакту.',leadFailed:'Не удалось отправить заявку. Скопируйте бриф и отправьте его через Telegram.',leadInvalid:'Укажите имя и телефон или @Telegram.',briefReadyDirect:'Бриф готов. Отправьте его менеджеру одним нажатием.',briefPrivacyDirect:'Отправляя заявку, вы передаёте указанные данные менеджеру ColourWay через Telegram.',productionVideoEyebrow:'ВИДЕО / ПРОИЗВОДСТВО',productionVideoTitle:'Производство изнутри',productionVideoNote:'От идеи до монтажа. Смотреть видео ↗',productionVideoFallback:'Ваш браузер не поддерживает воспроизведение видео.',productionVideoClose:'Закрыть видео',productionVideoSource:'Открыть видео в Instagram',certificateEyebrow:'ДОКУМЕНТЫ / COLOURWAY',certificateTitle:'Свидетельство о регистрации.',certificateDescription:'ColourWay Design официально зарегистрирована в Узбекистане с 2015 года.',certificateOpen:'Посмотреть документ',certificateZoom:'Увеличить',certificateFit:'По размеру окна',chooseError:'Выберите направление или пункт «Нужна консультация».',consultation:'Нужна консультация',orderCTA:'Создать макет и заказать',serviceCTA:'Создать макет',shown:'Показано {count} из {total} проектов',copied:'Бриф скопирован. Откройте Telegram и вставьте его в сообщение.',copyFailed:'Выделите и скопируйте текст брифа вручную, затем откройте Telegram.',briefGreeting:'Здравствуйте, ColourWay! Хочу обсудить проект.',summaryServices:'Направления',summaryName:'Имя',summaryCompany:'Компания',summaryTask:'Задача',serviceCaption:'Форма. Свет. Характер.'},
  uz: {aboutPageTitle:'Biz haqimizda.',aboutPageIntro:'Brendlarni yanada ko‘zga tashlanadigan qiladigan odamlar, g‘oyalar va ishlab chiqarish.',aboutPageCtaTitle:'Yorqin loyiha yaratamizmi?',aboutPageCtaText:'Mahsulotni tanlang, maket yarating va buyurtmani menejerga yuboring.',teamEyebrow:'COLOURWAY JAMOASI / 08',teamTitle:'Jamoamiz bilan tanishing.',teamNote:'Birinchi suhbatdan o‘rnatishgacha yoningizda o‘z ishini biladigan mutaxassislar bo‘ladi.',roleArtDirector:'Art-direktor',roleSalesDirector:'Savdo bo‘limi rahbari',roleProjectManager:'Loyiha menejeri',role3dDesigner:'3D dizayner',roleDesigner:'Dizayner',roleCrmSpecialist:'CRM mutaxassisi',briefContact:'Telefon yoki @Telegram',contactPlaceholder:'+998 90 123 45 67 yoki @username',summaryContact:'Aloqa',sendLead:'Arizani yuborish',sendingLead:'Ariza yuborilmoqda…',leadSent:'Ariza menejerga yuborildi. Siz bilan ko‘rsatilgan aloqa orqali bog‘lanamiz.',leadFailed:'Arizani yuborib bo‘lmadi. Brifni nusxalab Telegram orqali yuboring.',leadInvalid:'Ismingizni va telefon yoki @Telegram manzilingizni kiriting.',briefReadyDirect:'Brif tayyor. Uni menejerga bir tugma bilan yuboring.',briefPrivacyDirect:'Ariza yuborilganda maʼlumotlaringiz ColourWay menejeriga Telegram orqali uzatiladi.',productionVideoEyebrow:'VIDEO / ISHLAB CHIQARISH',productionVideoTitle:'Ishlab chiqarish jarayoni',productionVideoNote:'G‘oyadan montajgacha. Videoni ko‘rish ↗',productionVideoFallback:'Brauzeringiz videoni ijro eta olmaydi.',productionVideoClose:'Videoni yopish',productionVideoSource:'Videoni Instagram’da ochish',certificateEyebrow:'HUJJATLAR / COLOURWAY',certificateTitle:'Ro‘yxatdan o‘tganlik guvohnomasi.',certificateDescription:'ColourWay Design 2015-yildan beri O‘zbekistonda rasmiy ro‘yxatdan o‘tgan.',certificateOpen:'Hujjatni ko‘rish',certificateZoom:'Kattalashtirish',certificateFit:'Oynaga sig‘dirish',
    carouselEyebrow:'Haqiqiy loyihalar / 2015-yildan bugungacha',carouselTitle:'Ishlarimiz harakatda.',carouselRole:'karusel',carouselPrevious:'Oldingi ishlar',carouselNext:'Keyingi ishlar',carouselLabel:'ColourWay loyihalari karuseli',
    skip:'Mazmunga o‘tish',navigation:'Navigatsiya',navProjects:'Loyihalar',navServices:'Xizmatlar',navOrder:'Buyurtma',navAbout:'Biz haqimizda',navContact:'Aloqa',discuss:'Loyihani muhokama qilish',menu:'Menyuni ochish',heroEyebrow:'Reklama ishlab chiqarish · Toshkent',hero1:'Brendingizni',hero2:'yorqin',hero3:'qilamiz.',heroDescription:'G‘oyalarni peshlavha, makon va taassurotga aylantiramiz. Birinchi eskizdan so‘nggi mahkamlashgacha.',startProject:'Loyihani boshlash',seeWorks:'Ishlarni ko‘rish',visualNote:'Shaklga aylanadigan g‘oyalar ↗',since:'2015-yildan beri yaratamiz',ownProduction:'O‘z ishlab chiqarish bazamiz',scroll:'Pastga — yanada yorqin',projectsEyebrow:'01 / Tanlangan loyihalar',projectsNote:'Haqiqiy ishlar. Ko‘zga ko‘rinarli natija.',projectsTitle:'Ishlarimiz so‘zlaydi.',filterLabel:'Loyihalarni saralash',moreProjects:'Yana loyihalar',servicesEyebrow:'02 / Nimalar yaratamiz',servicesNote:'Bitta jamoa. Ko‘p imkoniyatlar.',servicesTitle1:'Sizni ko‘rishlari',servicesTitle2:'uchun hammasi.',servicesDescription:'Kichik peshlavhadan kompleks bezatishgacha. Vazifa, makon va brendingizga mos yechim tanlaymiz.',serviceImageCaption:'Shakl. Yorug‘lik. Xarakter.',aboutEyebrow:'Jamoa va ishlab chiqarish',yearStamp:'Hammasi boshlangan yil',officeCaption:'Ilhom maskanimiz. Toshkent.',aboutTitle1:'Yaxshi g‘oya',aboutTitle2:'amalga oshishga',aboutTitle3:'arziydi.',aboutLead:'Biz — ColourWay. Brendingiz real dunyoning bir qismiga aylanishi uchun dizayn, texnologiya va qo‘l mehnatini birlashtiramiz.',aboutText:'2015-yildan buyon O‘zbekistonda reklama yechimlarini yaratamiz. O‘z ishlab chiqarish bazamiz, dizaynerlar va montajchilar jamoasi loyihani konsepsiyadan o‘rnatishgacha olib borishga imkon beradi.',ourProcess:'Qanday ishlaymiz',factDesign:'Dizayn va modellashtirish',factCycleValue:'To‘liq jarayon',factCycle:'G‘oyadan montajgacha',partners:'Mijozlarimiz va hamkorlarimiz orasida',processEyebrow:'03 / G‘oyadan natijaga yo‘l',processTitle:'Hammasi birlashadi.',processDescription:'Tinglaymiz. O‘ylaymiz. Yaratamiz.<br>Har bosqichda — siz bilan.',process1Title:'Tanishamiz',process1Text:'Vazifa, joylashuv va istaklaringizni muhokama qilamiz. Brendingizga aslida nima kerakligini aniqlaymiz.',process2Title:'Loyihalaymiz',process2Text:'Dizayn va 3D-vizualizatsiya yaratamiz. Materiallar, konstruksiya va loyiha detallarini kelishamiz.',process3Title:'Ishlab chiqaramiz',process3Text:'Tasdiqlangan maketni o‘z ishlab chiqarish bazamizda amalga oshiramiz. Bajarilish sifatini tekshiramiz.',process4Title:'O‘rnatamiz',process4Text:'Tayyor yechimni obyektda o‘rnatamiz. Brendingiz o‘z o‘rnini topadi va ko‘zga tashlanadi.',contactEyebrow:'04 / G‘oyangizdan boshlaymiz',contactTitle1:'G‘oyangiz bormi?',contactTitle2:'Unga shakl',contactTitle3:'beramiz.',contactText:'Mahsulotni tanlang, maket yarating<br>va buyurtmani menejerga yuboring.<br>Tafsilotlarni birga aniqlaymiz.',orWrite:'Yoki bizga to‘g‘ridan-to‘g‘ri yozing',footerTagline:'Sizni o‘ziga xos qiladigan<br>jihatlarni ko‘rsatamiz.',stayInTouch:'Aloqada bo‘lamiz',visit:'Mehmonga keling',address:'Toshkent, Mirzo Ulug‘bek tumani,<br>TTZ-2, 2-kvartal, 2-uy',hours:'Du–Ju: 09:00–18:00<br>Sha: 09:00–16:00',map:'Xaritada ko‘rish',backTop:'Yuqoriga',close:'Yopish',previous:'Oldingi loyiha',next:'Keyingi loyiha',projectBy:'ColourWay Design portfoliosidan loyiha',wantSimilar:'Shunday loyiha istayman',briefEyebrow:'Katta ish kichik qadamdan boshlanadi',briefTitle:'Keling, tanishamiz.',briefStep1:'Vazifa',briefStep2:'Tafsilotlar',briefStep3:'Brifingiz',briefChoose:'Nima yaratamiz?',briefChooseHint:'Bir nechta yo‘nalishni tanlash mumkin.',briefName:'Sizga qanday murojaat qilaylik?',briefCompany:'Kompaniya yoki brend <span class="optional">(ixtiyoriy)</span>',briefTask:'Vazifa haqida qisqacha',namePlaceholder:'Ismingiz',companyPlaceholder:'Kompaniya nomi',taskPlaceholder:'Nima qilish, qayerga joylashtirish kerak, qanday istaklaringiz bor?',briefDetailHint:'O‘lchamlar, muddatlar va namunalarni yozishmada aniqlashtirish mumkin.',briefReady:'Yaxshi boshlanish!',briefReadyText:'Brif tayyor. Uni nusxalang va Telegram orqali yuboring — muhokamani u yerda davom ettiramiz.',briefSummaryLabel:'Tayyor brif',copyBrief:'Brifni nusxalash',openTelegram:'Telegramni ochish',briefPrivacy:'Brifni ColourWay chatiga o‘zingiz yuborasiz. Ushbu shakl ma’lumotlari serverda saqlanmaydi.',back:'Orqaga',nextStep:'Keyingisi',chooseError:'Yo‘nalish yoki «Maslahat kerak» bandini tanlang.',consultation:'Maslahat kerak',orderCTA:'Maket yaratish va buyurtma berish',serviceCTA:'Maket yaratish',shown:'{total} loyihadan {count} tasi ko‘rsatilgan',copied:'Brif nusxalandi. Telegramni oching va xabarga joylang.',copyFailed:'Brif matnini belgilang va qo‘lda nusxalang, keyin Telegramni oching.',briefGreeting:'Salom, ColourWay! Loyihani muhokama qilmoqchiman.',summaryServices:'Yo‘nalishlar',summaryName:'Ism',summaryCompany:'Kompaniya',summaryTask:'Vazifa',serviceCaption:'Shakl. Yorug‘lik. Xarakter.'
  }
};
